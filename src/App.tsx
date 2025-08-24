import { useState, useEffect } from 'react';
import { EmailList } from "./components/EmailList";
import GoogleLogin from "./components/GoogleLogin";
import { useEmailStore } from "./store/useEmailStore";

export default function App() {
  const { 
    emails, 
    isAuthenticated,
    loading,
    getAllCategories, 
    categorizeEmails,
    initializeFromStorage
  } = useEmailStore();
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize from localStorage on app start
  useEffect(() => {
    initializeFromStorage();
    setIsInitialized(true);
  }, [initializeFromStorage]);
  
  // Auto-categorize emails when they're first loaded
  useEffect(() => {
    if (isInitialized && emails.length > 0) {
      const uncategorizedCount = emails.filter(email => 
        !email.category || email.category === 'uncategorized'
      ).length;
      
      if (uncategorizedCount > 0) {
        // Small delay to ensure UI is ready
        setTimeout(() => {
          categorizeEmails();
        }, 500);
      }
    }
  }, [emails.length, isInitialized, categorizeEmails]);
  
  const categories = getAllCategories();
  
  // Show loading screen during initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                ✉️ Smart Email Categorizer
              </h1>
              {emails.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {emails.length} emails
                  </span>
                  {emails.some(e => e.isProcessing) && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-1"></div>
                      Categorizing...
                    </span>
                  )}
                </div>
              )}
            </div>
            <GoogleLogin />
          </div>
        </div>
      </header>

      {/* Category Filter Tabs */}
      {emails.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-1 overflow-x-auto py-2">
              {categories.map((category) => {
                const isActive = activeFilter === category;
                const emailCount = category === 'All' 
                  ? emails.length 
                  : category === 'Uncategorized'
                  ? emails.filter(e => !e.category || e.category === 'uncategorized').length
                  : emails.filter(e => e.category === category.toLowerCase()).length;

                return (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    {category}
                    {emailCount > 0 && (
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        isActive 
                          ? 'bg-blue-200 text-blue-800' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {emailCount}
                      </span>
                    )}
                  </button>
                );
              })}
              
              {/* Manual Categorize Button */}
              <button
                onClick={categorizeEmails}
                disabled={loading || emails.some(e => e.isProcessing)}
                className="px-4 py-2 rounded-lg text-sm font-medium border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {emails.some(e => e.isProcessing) ? '🔄 Processing...' : '🔄 Re-categorize'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {!isAuthenticated ? (
          <div className="text-center p-12">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome to Smart Email Categorizer
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Connect your Gmail account to automatically categorize and organize your emails using AI.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-blue-900 mb-2">🚀 Features:</h3>
              <ul className="text-sm text-blue-800 text-left space-y-1">
                <li>• AI-powered email categorization (Work, Personal, Finance, etc.)</li>
                <li>• On-demand smart summaries and action item extraction</li>
                <li>• Persistent login - no need to re-authenticate</li>
                <li>• Secure read-only Gmail integration</li>
              </ul>
            </div>
            
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-xs text-amber-800">
                <strong>Setup Required:</strong> You'll need to configure your own Google Cloud project with Gmail API and OpenAI API key for full functionality.
              </p>
            </div>
          </div>
        ) : !emails.length ? (
          <div className="text-center p-12">
            <div className="text-6xl mb-4">📨</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Ready to organize your emails!
            </h2>
            <p className="text-gray-600 mb-4">
              You're logged in. Click "Fetch Emails" to start categorizing your messages.
            </p>
          </div>
        ) : (
          <EmailList filter={activeFilter} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>
              Built with React, Gmail API, and OpenAI • 
              {emails.length > 0 && (
                <span className="ml-2">
                  {emails.filter(e => e.category && e.category !== 'uncategorized').length} of {emails.length} emails categorized
                  {emails.filter(e => e.summary).length > 0 && 
                    ` • ${emails.filter(e => e.summary).length} summarized`
                  }
                </span>
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}