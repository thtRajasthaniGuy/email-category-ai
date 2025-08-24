import React from 'react';
import type { Email } from '../store/useEmailStore';
import { useEmailStore } from '../store/useEmailStore';
import { getCategoryMeta } from '../lib/categories';

interface EmailCardProps {
  email: Email;
}

export const EmailCard: React.FC<EmailCardProps> = ({ email }) => {
  const { summarizeEmail } = useEmailStore();
  const categoryMeta = getCategoryMeta(email.category);
  
  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  const extractSenderName = (from: string) => {
    const match = from.match(/^(.*?)\s*<(.+)>$/) || from.match(/^(.+)$/);
    if (match) {
      const name = match[1]?.trim();
      const email = match[2]?.trim();
      return name && name !== email ? name : email || from;
    }
    return from;
  };

  const extractEmail = (from: string) => {
    const match = from.match(/<([^>]+)>/);
    return match ? match[1] : from;
  };

  const handleSummarize = () => {
    if (!email.summary && !email.isSummarizing) {
      summarizeEmail(email.id);
    }
  };

  const hasSummary = email.summary && email.summary !== 'Failed to generate summary';

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-50">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-4">
            {email.subject}
          </h3>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {formatDate(email.timestamp)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{extractSenderName(email.from)}</span>
            {extractSenderName(email.from) !== extractEmail(email.from) && (
              <span className="text-gray-400 ml-1">({extractEmail(email.from)})</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Processing indicator */}
            {email.isProcessing && (
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-1"></div>
                Processing...
              </div>
            )}
            
            {/* Category badge */}
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryMeta.badge}`}>
              <span className="mr-1">{categoryMeta.icon}</span>
              {categoryMeta.label}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Snippet */}
        {email.snippet && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {email.snippet}
          </p>
        )}

        {/* Summary Section */}
        {email.isSummarizing ? (
          <div className="flex items-center text-sm text-blue-600 bg-blue-50 p-3 rounded-lg mb-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Generating summary and action items...
          </div>
        ) : hasSummary ? (
          <>
            {/* Summary */}
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                📝 Summary
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                {email.summary}
              </p>
            </div>

            {/* Action Items */}
            {email.actionItems && email.actionItems.trim() && (
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  🔧 Action Items
                </div>
                <p className="text-sm text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  {email.actionItems}
                </p>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
            View Full Email →
          </button>
          
          <div className="flex items-center space-x-2">
            {/* Summarize Button */}
            {!hasSummary && !email.isSummarizing && (
              <button
                onClick={handleSummarize}
                className="text-xs text-green-600 hover:text-green-800 font-medium transition-colors px-2 py-1 rounded hover:bg-green-50"
              >
                ✨ Summarize
              </button>
            )}
            
            {/* Re-summarize Button */}
            {hasSummary && (
              <button
                onClick={handleSummarize}
                disabled={email.isSummarizing}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors px-2 py-1 rounded hover:bg-blue-50 disabled:opacity-50"
              >
                🔄 Re-summarize
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};