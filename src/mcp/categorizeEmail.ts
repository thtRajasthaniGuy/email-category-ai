  // categorizeEmail.ts - Updated to use Gemini API (Free tier available)
export async function categorizeEmail(emailContent: string, subject: string): Promise<string> {
  const maxRetries = 3;
  const baseDelay = 1000; // Start with 1 second delay
  
  // Get your free API key from: https://makersuite.google.com/app/apikey
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.error('VITE_GEMINI_API_KEY not found in environment variables');
    return 'other';
  }
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an email categorization assistant. Categorize this email into one of these categories:
- work: Professional emails, business correspondence, work-related matters
- personal: Personal messages, family, friends, social
- finance: Banking, investments, bills, financial statements
- shopping: E-commerce, purchases, order confirmations, deals
- newsletters: Newsletters, subscriptions, marketing emails
- social: Social media notifications, community updates
- travel: Travel bookings, confirmations, itineraries
- health: Medical, fitness, wellness related
- education: Learning, courses, academic content
- other: Anything that doesn't fit the above categories

Respond with only the category name in lowercase.

Subject: ${subject}

Content: ${emailContent.substring(0, 500)}...`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 0.8,
            maxOutputTokens: 10,
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
        if (response.status === 429) {
          // Rate limited - wait with exponential backoff
          const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
          console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${attempt + 1})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      const category = data.candidates[0]?.content?.parts[0]?.text?.trim().toLowerCase();
      
      // Validate the category
      const validCategories = ['work', 'personal', 'finance', 'shopping', 'newsletters', 'social', 'travel', 'health', 'education', 'other'];
      return validCategories.includes(category) ? category : 'other';
      
    } catch (error) {
      console.error(`Gemini API error (attempt ${attempt + 1}):`, error);
      
      if (attempt === maxRetries - 1) {
        // Last attempt failed, return default category
        return 'other';
      }
      
      // Wait before retrying
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return 'other'; // Fallback
}

// Batch processing function optimized for Gemini's free tier limits
export async function categorizeBatchEmails(
  emails: Array<{ id: string; subject: string; body: string; snippet: string }>,
  onProgress?: (processed: number, total: number) => void,
  onEmailCategorized?: (emailId: string, category: string) => void
): Promise<Array<{ id: string; category: string }>> {
  const results: Array<{ id: string; category: string }> = [];
  const batchSize = 2; // Smaller batch size for free tier
  const delayBetweenBatches = 3000; // 3 second delay between batches to respect rate limits
  
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    
    // Process batch sequentially to avoid rate limits
    for (const email of batch) {
      try {
        const content = email.body || email.snippet || '';
        const category = await categorizeEmail(content, email.subject);
        results.push({ id: email.id, category });
        onEmailCategorized?.(email.id, category);
        
        // Small delay between individual requests
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Failed to categorize email ${email.id}:`, error);
        results.push({ id: email.id, category: 'other' });
        onEmailCategorized?.(email.id, 'other');
      }
    }
    
    onProgress?.(Math.min(i + batchSize, emails.length), emails.length);
    
    // Wait between batches (except for the last batch)
    if (i + batchSize < emails.length) {
      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}, waiting ${delayBetweenBatches}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }
  
  return results;
}

// Alternative: Use Gemini Pro for better accuracy (still free but with different limits)
export async function categorizeEmailWithGeminiPro(emailContent: string, subject: string): Promise<string> {
  const GEMINI_API_KEY = 'AIzaSyDNBpbwEzDCUgbioBCjO-TOsWiL3bxvoCI';
  console.log("GEMINI_API_KEY",GEMINI_API_KEY)
  if (!GEMINI_API_KEY) {
    console.error('VITE_GEMINI_API_KEY not found in environment variables');
    return 'other';
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
            text: `Categorize this email into exactly one category. Return only the category name:

Categories: work, personal, finance, shopping, newsletters, social, travel, health, education, other

Subject: ${subject}
Content: ${emailContent.substring(0, 800)}`
          }]
        }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 5,
        }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const category = data.candidates[0]?.content?.parts[0]?.text?.trim().toLowerCase();
      const validCategories = ['work', 'personal', 'finance', 'shopping', 'newsletters', 'social', 'travel', 'health', 'education', 'other'];
      return validCategories.includes(category) ? category : 'other';
    }
  } catch (error) {
    console.error('Gemini Pro error:', error);
  }
  
  return 'other';
}