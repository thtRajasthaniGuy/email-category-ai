
// utils/categorizeEmail.ts
import { getCategoryMeta, CATEGORY_META } from "../lib/categoryMeta";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

async function callGeminiModel(
  model: "gemini-1.5-flash" | "gemini-1.5-pro",
  prompt: string,
  maxRetries = 3,
  baseDelay = 1000
): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error("❌ VITE_GEMINI_API_KEY missing");
    return "other";
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(
        `${BASE_URL}/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 10 }
          }),
        }
      );

      if (res.status === 429) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500;
        console.warn(`⏳ Rate limited. Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();
      const raw =
        data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase() || "other";

      const {key} =  getCategoryMeta(raw);   // ✅ map safely via categories.ts
      return key;

    } catch (err) {
      console.error(`⚠️ Gemini API error (attempt ${attempt + 1}):`, err);
      if (attempt === maxRetries - 1) return "other";
      await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt)));
    }
  }

  return "other";
}

// 🔹 Flash model
export async function categorizeEmail(emailContent: string, subject: string) {
  const prompt = `
You are an assistant that classifies emails for B2B/E-commerce.
Categories: ${Object.keys(CATEGORY_META).join(", ")}.
Return ONLY the category key (lowercase).

Subject: ${subject}
Content: ${emailContent.substring(0, 500)}...
  `;

  return await callGeminiModel("gemini-1.5-flash", prompt);
}

// 🔹 Pro model
export async function categorizeEmailWithGeminiPro(emailContent: string, subject: string) {
  const prompt = `
Categorize this email into exactly one of the categories:
${Object.keys(CATEGORY_META).join(", ")}.
Return only the category key.

Subject: ${subject}
Content: ${emailContent.substring(0, 800)}...
  `;

  return await callGeminiModel("gemini-1.5-pro", prompt);
}
