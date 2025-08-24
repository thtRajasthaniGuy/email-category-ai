export const categorizePrompt = (email: string) => `
You are an email categorization assistant. Analyze the following email and categorize it into ONE of these categories:

Categories:
- order: Order confirmations, shipping notifications, delivery updates
- return: Return requests, return confirmations, return policies
- refund: Refund requests, refund confirmations, billing disputes
- fraud: Suspicious activities, security alerts, fraud warnings
- urgent-support: Urgent customer support, escalated issues, time-sensitive matters
- work: Work-related emails, meetings, professional correspondence
- personal: Personal emails from friends, family, non-work related
- finance: Banking, investments, financial statements, bills
- spam: Promotional emails, newsletters, marketing content
- other: Everything else that doesn't fit the above categories

Email Content:
"""
${email}
"""

Rules:
- Respond with ONLY the category name (lowercase, use hyphens for multi-word categories)
- Consider the sender, subject, and content to make the best decision
- If unsure, use "other"
- Be consistent with similar email types

Category:`;

export const summarizePrompt = (email: string) => `
You are an email summarization assistant. Analyze the following email and provide:

1. A concise 1-2 sentence summary of the main content
2. Any action items or tasks that need to be completed

Email Content:
"""
${email}
"""

Instructions:
- Keep the summary clear and under 100 words
- Extract specific action items (what needs to be done, by when, by whom)
- If no action items exist, write "None"
- Focus on the most important information
- Use clear, professional language

Format your response exactly as:
Summary: [Your summary here]
Action Items: [Action items or "None"]`;