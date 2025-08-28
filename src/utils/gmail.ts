export interface GmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
}

export async function listMessages(accessToken: string, maxResults = 50, pageToken?: string) {
  const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  url.searchParams.set('maxResults', String(maxResults));
  if (pageToken) url.searchParams.set('pageToken', pageToken);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Failed to list messages: ${res.status}`);
  return res.json();
}

export async function getMessage(accessToken: string, id: string): Promise<GmailMessage> {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch message: ${res.status}`);
  const data = await res.json();

  const headers = Object.fromEntries(data.payload.headers.map((h: any) => [h.name, h.value]));
  return {
    id: data.id,
    threadId: data.threadId,
    subject: headers.Subject || '',
    from: headers.From || '',
    snippet: data.snippet,
    date: headers.Date || '',
  };
}

export async function fetchRecentMessages(
  accessToken: string,
  maxResults = 30,
  pageToken?: any
): Promise<{ messages: any[]; nextPageToken?: string }> {
  const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
  url.searchParams.set("maxResults", String(maxResults));
  if (pageToken) url.searchParams.set("pageToken", pageToken);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error("Failed to fetch messages list");

  const data = await res.json();

  if (!data.messages) return { messages: [], nextPageToken: undefined };

  // fetch details for each message
  const detailed = await Promise.all(
    data.messages.map(async (msg: { id: string }) => {
      const r = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date&metadataHeaders=Snippet`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const d = await r.json();

      return {
        id: d.id,
        subject: d.payload?.headers?.find((h: any) => h.name === "Subject")?.value || "(No Subject)",
        from: d.payload?.headers?.find((h: any) => h.name === "From")?.value || "(Unknown)",
        date: d.payload?.headers?.find((h: any) => h.name === "Date")?.value || "",
        snippet: d.snippet || "",
      };
    })
  );

  return { messages: detailed, nextPageToken: data.nextPageToken };
}