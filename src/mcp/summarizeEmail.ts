export interface EmailSummary {
  summary: string;
  actionItems: string;
}

export async function summarizeEmail(email: string): Promise<EmailSummary> {
  if (!email.trim()) {
    return {
      summary: 'No content available',
      actionItems: ''
    };
  }

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.error('VITE_GEMINI_API_KEY not found in environment variables');
    return {
      summary: 'API key not configured',
      actionItems: ''
    };
  }

  try {
    const prompt = `Please analyze this email and provide:

1. A concise summary (2-3 sentences max)
2. Any action items or tasks that need to be done

Email content:
${email.length > 2000 ? email.substring(0, 2000) + '...' : email}

Format your response exactly like this:
Summary: [brief summary of the email content]
Action Items: [specific actions needed, or "None" if no actions required]`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 300,
          stopSequences: []
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, response.statusText, errorText);
      return {
        summary: 'Unable to generate summary',
        actionItems: ''
      };
    }

    const data = await response.json();
    const content = data.candidates[0]?.content?.parts[0]?.text || '';
    
    // Parse the structured response
    const summaryMatch = content.match(/Summary:\s*(.+?)(?=Action Items:|$)/s);
    const actionsMatch = content.match(/Action Items:\s*(.+?)$/s);
    
    const summary = summaryMatch?.[1]?.trim() || 'No summary available';
    const actionItems = actionsMatch?.[1]?.trim() || '';
    
    return {
      summary: summary.length > 300 ? summary.substring(0, 300) + '...' : summary,
      actionItems: actionItems === 'None' ? '' : actionItems
    };
    
  } catch (error) {
    console.error('Error summarizing email:', error);
    return {
      summary: 'Error generating summary',
      actionItems: ''
    };
  }
}

// Alternative function using Gemini Pro for better quality summaries
export async function summarizeEmailWithGeminiPro(email: string): Promise<EmailSummary> {
  if (!email.trim()) {
    return {
      summary: 'No content available',
      actionItems: ''
    };
  }

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.error('VITE_GEMINI_API_KEY not found in environment variables');
    return {
      summary: 'API key not configured',
      actionItems: ''
    };
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this email and extract:
1. A clear, concise summary (max 2-3 sentences)
2. Specific action items that require follow-up

Email: ${email.length > 3000 ? email.substring(0, 3000) + '...' : email}

Response format:
Summary: [concise summary]
Action Items: [list specific actions or "None"]`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 250,
        }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.candidates[0]?.content?.parts[0]?.text || '';
      
      const summaryMatch = content.match(/Summary:\s*(.+?)(?=Action Items:|$)/s);
      const actionsMatch = content.match(/Action Items:\s*(.+?)$/s);
      
      const summary = summaryMatch?.[1]?.trim() || 'No summary available';
      const actionItems = actionsMatch?.[1]?.trim() || '';
      
      return {
        summary: summary.length > 300 ? summary.substring(0, 300) + '...' : summary,
        actionItems: actionItems === 'None' ? '' : actionItems
      };
    }
  } catch (error) {
    console.error('Gemini Pro summarization error:', error);
  }
  
  return {
    summary: 'Error generating summary',
    actionItems: ''
  };
}

// Batch summarization with rate limiting for free tier
export async function summarizeBatchEmails(
  emails: Array<{ id: string; content: string }>,
  onProgress?: (processed: number, total: number) => void,
  onEmailSummarized?: (emailId: string, summary: EmailSummary) => void
): Promise<Array<{ id: string; summary: EmailSummary }>> {
  const results: Array<{ id: string; summary: EmailSummary }> = [];
  const delayBetweenRequests = 4000; // 4 seconds between requests for free tier
  
  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    
    try {
      const summary = await summarizeEmail(email.content);
      results.push({ id: email.id, summary });
      onEmailSummarized?.(email.id, summary);
      
      onProgress?.(i + 1, emails.length);
      
      // Wait between requests (except for the last one)
      if (i < emails.length - 1) {
        console.log(`Summarized email ${i + 1}/${emails.length}, waiting ${delayBetweenRequests}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
      }
      
    } catch (error) {
      console.error(`Failed to summarize email ${email.id}:`, error);
      const fallbackSummary: EmailSummary = {
        summary: 'Error generating summary',
        actionItems: ''
      };
      results.push({ id: email.id, summary: fallbackSummary });
      onEmailSummarized?.(email.id, fallbackSummary);
    }
  }
  
  return results;
}