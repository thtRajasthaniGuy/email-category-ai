import { useState } from 'react';
import type { EmailSummary } from '../mcp/summarizeEmail';

interface EmailSummaryViewProps {
  emailId: string;
  emailContent: string;
  summarizeEmailFn: (content: string) => Promise<EmailSummary>;
}

export function EmailSummaryView({ emailId, emailContent, summarizeEmailFn }: EmailSummaryViewProps) {
  const [summaryData, setSummaryData] = useState<EmailSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const handleGenerateSummary = async () => {
    setLoading(true);
    const result = await summarizeEmailFn(emailContent);
    setSummaryData(result);
    setShowFull(true); // show full summary immediately after generation
    setLoading(false);
  };

  return (
    <div className="border p-4 rounded-md shadow-sm mb-4">
      <p className="text-gray-700 mb-2">
        {summaryData ? (showFull ? summaryData.summary : summaryData.snippet) : emailContent.substring(0, 100) + '...'}
      </p>

      {summaryData && !showFull && (
        <button
          className="text-blue-500 underline"
          onClick={() => setShowFull(true)}
        >
          Show Full Summary
        </button>
      )}

      {!summaryData && (
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={handleGenerateSummary}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>
      )}

      {summaryData && showFull && summaryData.actionItems && (
        <div className="mt-2 text-sm text-gray-600">
          <strong>Action Items:</strong> {summaryData.actionItems}
        </div>
      )}
    </div>
  );
}
