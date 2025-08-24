import { categorizeEmail } from './categorizeEmail';
import { summarizeEmail } from './summarizeEmail';

export async function processEmail(email: string,subject:string) {
  const [category, summary] = await Promise.all([
    categorizeEmail(email,subject),
    summarizeEmail(email),
  ]);

  return {
    category,
    summary: summary.summary,
    actionItems: summary.actionItems,
  };
}
