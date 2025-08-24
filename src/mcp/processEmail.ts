import { categorizeEmail } from './categorizeEmail';
import { summarizeEmail, type EmailSummary } from './summarizeEmail';

export interface ProcessedEmail {
  category: string;
  summary: string;
  actionItems: string;
}

export interface EmailInput {
  content: string;
  subject: string;
}

// For categorization only
export async function processEmail(email: EmailInput | string): Promise<Pick<ProcessedEmail, 'category'>> {
  let content: string;
  let subject: string;
  
  if (typeof email === 'string') {
    content = email;
    subject = '';
  } else {
    content = email.content;
    subject = email.subject || '';
  }

  if (!content.trim()) {
    return { category: 'other' };
  }

  try {
    const category = await categorizeEmail(content, subject);
    return { category };
  } catch (error) {
    console.error('Error processing email:', error);
    return { category: 'other' };
  }
}

// For full processing (categorization + summarization)
export async function processEmailFull(email: EmailInput | string): Promise<ProcessedEmail> {
  let content: string;
  let subject: string;
  
  if (typeof email === 'string') {
    content = email;
    subject = '';
  } else {
    content = email.content;
    subject = email.subject || '';
  }

  if (!content.trim()) {
    return {
      category: 'other',
      summary: 'No content available',
      actionItems: ''
    };
  }

  try {
    // Process categorization and summarization in parallel
    const [categoryResult, summaryResult] = await Promise.allSettled([
      categorizeEmail(content, subject),
      summarizeEmail(content)
    ]);

    const category = categoryResult.status === 'fulfilled' ? categoryResult.value : 'other';
    const summaryData: EmailSummary = summaryResult.status === 'fulfilled' 
      ? summaryResult.value 
      : { summary: 'Unable to generate summary', actionItems: '' };

    return {
      category,
      summary: summaryData.summary,
      actionItems: summaryData.actionItems
    };

  } catch (error) {
    console.error('Error processing email:', error);
    return {
      category: 'other',
      summary: 'Processing failed',
      actionItems: ''
    };
  }
}