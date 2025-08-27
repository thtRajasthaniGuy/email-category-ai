import { useEffect, useRef, useState } from 'react';
import { useEmailStore } from '../store/useEmailStore';
import { getCategoryMeta } from '../lib/categories';

interface EmailListProps {
  filter?: string;
}

export const EmailList = ({ filter = 'All' }: EmailListProps) => {
  const { emails, loading, error, summarizeEmail, fetchEmails, nextPageToken, setEmails } = useEmailStore();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (emails.length === 0) {
      fetchEmails();
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && nextPageToken) {
          fetchEmails(nextPageToken);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading, nextPageToken]);

  const handleSummarize = (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    if (email && !email.summary && !email.isSummarizing) {
      summarizeEmail(emailId);
    }
  };

  const toggleSummaryExpanded = (emailId: string) => {
    const email:any = emails.find(e => e.id === emailId);
    if (email) {
      email.summaryExpanded = !email.summaryExpanded;
      setEmails([...emails]); // trigger state update
    }
  };

  const handleEmailSelect = (emailId: string) => {
    setSelectedEmailId(emailId);
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading emails...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
        <div className="text-red-800 font-medium text-lg">Error</div>
        <div className="text-red-600 mt-2">{error}</div>
      </div>
    );
  }

  if (!emails.length) {
    return (
      <div className="text-center p-12 text-gray-500">
        <div className="text-6xl mb-6">📧</div>
        <h3 className="text-xl font-medium mb-3">No emails found</h3>
        <p className="text-gray-400">Connect your Gmail account to start categorizing emails.</p>
      </div>
    );
  }

  const filteredEmails = emails.filter(email => {
    if (filter === 'All') return true;
    if (filter === 'Uncategorized') {
      return !email.category || email.category === 'uncategorized';
    }
    return email.category === filter.toLowerCase();
  });

  const selectedEmail:any = selectedEmailId ? emails.find(e => e.id === selectedEmailId) : null;

  return (
    <div className="h-full flex">
      {/* Email List Sidebar */}
      <div className="w-full md:w-96 lg:w-1/3 xl:w-96 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{filter}</h2>
            <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full border">{filteredEmails.length}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-3xl mb-3">🔍</div>
              <p className="text-sm">No emails in "{filter}"</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredEmails.map((email) => {
                const categoryMeta = getCategoryMeta(email.category);
                const isSelected = selectedEmailId === email.id;
                const isRead = email.summary || email.isSummarizing;

                return (
                  <div
                    key={email.id}
                    onClick={() => handleEmailSelect(email.id)}
                    className={`p-4 cursor-pointer transition-all duration-150 hover:bg-gray-50 ${
                      isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                          {extractSenderName(email.from)}
                        </div>
                        <div className="text-xs text-gray-400 truncate">{extractEmail(email.from)}</div>
                      </div>
                      <div className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {new Date(email.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div className={`text-sm mb-2 line-clamp-1 ${isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                      {email.subject}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2 mb-3">{email.snippet}</div>
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryMeta.badge}`}>
                        <span className="mr-1">{categoryMeta.icon}</span>
                        {categoryMeta.label}
                      </div>
                      <div className="flex items-center space-x-1">
                        {email.isProcessing && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                        {email.isSummarizing && <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>}
                        {email.summary && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {nextPageToken && (
            <button
              onClick={() => fetchEmails(nextPageToken)}
              className="px-6 py-2 mt-4 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
            >
              Load More Emails
            </button>
          )}
        </div>
      </div>

      {/* Email Detail View */}
      <div className={`flex-1 bg-white ${selectedEmail ? 'block' : 'hidden md:block'}`}>
        {!selectedEmail ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">📨</div>
              <p className="text-lg">Select an email to read</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Back button for mobile */}
            <div className="md:hidden p-4 border-b border-gray-200">
              <button onClick={() => setSelectedEmailId(null)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                ← Back to list
              </button>
            </div>

            {/* Email Header */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-xl font-semibold text-gray-900 flex-1 mr-4">{selectedEmail.subject}</h1>
                <div className="text-sm text-gray-500">{formatDate(selectedEmail.timestamp)}</div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">{extractSenderName(selectedEmail.from)}</div>
                  <div className="text-sm text-gray-500">{extractEmail(selectedEmail.from)}</div>
                </div>
                <div className="flex items-center space-x-3">
                  {selectedEmail.isProcessing && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-2"></div>
                      Processing...
                    </div>
                  )}
                  <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getCategoryMeta(selectedEmail.category).badge}`}>
                    <span className="mr-2">{getCategoryMeta(selectedEmail.category).icon}</span>
                    {getCategoryMeta(selectedEmail.category).label}
                  </div>
                </div>
              </div>
            </div>

            {/* Email Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm text-gray-700">{selectedEmail.snippet || 'No preview available'}</div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-4">
                {selectedEmail.isSummarizing ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                    <div>
                      <div className="font-medium text-blue-900">Generating Summary</div>
                      <div className="text-sm text-blue-700">Please wait while we analyze this email...</div>
                    </div>
                  </div>
                ) : selectedEmail.summary && selectedEmail.summary !== 'Failed to generate summary' ? (
                  <div className="space-y-4">
                    {/* Summary Preview */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="text-green-600 mr-2 mt-1">📝</div>
                        <div className="flex-1">
                          <div className="font-medium text-green-900 mb-2">Summary Preview</div>
                          <div className="text-sm text-green-800 line-clamp-2">{selectedEmail.summary}</div>
                        </div>
                      </div>
                    </div>

                    {/* Full Summary Toggle Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => toggleSummaryExpanded(selectedEmail.id)}
                        disabled={selectedEmail.isSummarizing}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {selectedEmail.summaryExpanded ? 'Hide Full Summary' : 'Show Full Summary'}
                      </button>
                    </div>

                    {/* Full Summary + Action Items */}
                    {selectedEmail.summaryExpanded && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-sm text-green-800">{selectedEmail.summary}</div>

                        {selectedEmail.actionItems && (
                          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <div className="text-amber-600 mr-2 mt-1">🔧</div>
                              <div className="flex-1">
                                <div className="font-medium text-amber-900 mb-2">Action Items</div>
                                <div className="text-sm text-amber-800">{selectedEmail.actionItems}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <div className="text-gray-400 text-4xl mb-3">✨</div>
                    <div className="text-gray-600 mb-4">
                      Get an AI summary of this email with key points and action items
                    </div>
                    <button
                      onClick={() => handleSummarize(selectedEmail.id)}
                      disabled={selectedEmail.isSummarizing}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      Generate Summary
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Email Actions Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">📎 View Attachments</button>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">View Full Email →</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
