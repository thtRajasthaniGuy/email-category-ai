import { useState, useEffect } from 'react';
import { EmailList } from "./components/EmailList";
import { useEmailStore } from "./store/useEmailStore";
import { addToast, ToastContainer } from './utils/Toast';

export default function App() {
  const { 
    emails, 
    loading,
    getAllCategories, 
    categorizeEmails,
    logout,
    fetchEmails
  } = useEmailStore();
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Auto-categorize emails when they're first loaded
  
useEffect(() => {
  if (emails.length > 0) {
    const uncategorizedCount = emails.filter(
      email => !email.category || email.category === "uncategorized"
    ).length;

    if (uncategorizedCount > 0) {
      setTimeout(() => {
        categorizeEmails();   // ✅ call store action
      }, 500);
    }
  }
}, [emails.length, categorizeEmails]);

  useEffect(() => {
  fetchEmails(); // load first batch on login
}, []);
  
  const categories = getAllCategories();

  // Enhanced categorize function with error handling
  const handleCategorizeEmails = async () => {
    try {
      await categorizeEmails();
      addToast('Emails categorized successfully!', 'success');
    } catch (error) {
      console.error('Categorization error:', error);
      addToast('Failed to categorize emails. Please try again.', 'error');
    }
  };

  // Get stats for each category
  const getCategoryStats = (category: string) => {
    if (category === 'All') return emails.length;
    if (category === 'Uncategorized') {
      return emails.filter(e => !e.category || e.category === 'uncategorized').length;
    }
    return emails.filter(e => e.category === category.toLowerCase()).length;
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 flex-shrink-0 z-20 sticky top-0">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button with better design */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Enhanced Logo and Title */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="text-3xl filter drop-shadow-sm">📧</div>
                  {emails.some(e => e.isProcessing) && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="hidden xs:block">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                    Smart Email Categorizer
                  </h1>
                  {emails.length > 0 && (
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{emails.length} emails</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{categories.length - 2} categories</span>
                    </div>
                  )}
                </div>
                <div className="ml-auto">
        <button
          onClick={logout}
          className="text-sm px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
        >
          Logout
        </button>
      </div>
              </div>

              {/* Enhanced Processing indicator */}
              {emails.some(e => e.isProcessing) && (
                <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-4 py-2 rounded-full shadow-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-sm text-blue-700 font-medium">
                    AI Categorizing...
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced Google Login */}
            {/* <div className="flex items-center">
              <GoogleLogin />
            </div> */}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay with improved animation */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Enhanced Categories Sidebar */}
        <div className={`
          fixed md:relative inset-y-0 left-0 z-40 w-72 md:w-64 bg-white/90 backdrop-blur-lg border-r border-gray-200/50
          shadow-xl md:shadow-none
          transform transition-all duration-300 ease-out md:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${emails.length > 0 ? 'block' : 'hidden md:block'}
        `}>
          <div className="h-full flex flex-col">
            {/* Enhanced Sidebar Header */}
            <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📂</span>
                  </div>
                  <h2 className="font-bold text-gray-900">Categories</h2>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Enhanced Category List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {categories.map((category) => {
                const isActive = activeFilter === category;
                const emailCount = getCategoryStats(category);
                
                return (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveFilter(category);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 border-2 border-blue-200 shadow-sm scale-[1.02]'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`text-lg transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                          {category === 'All' ? '📋' : 
                           category === 'Uncategorized' ? '❓' :
                           category === 'Work' ? '💼' :
                           category === 'Personal' ? '👤' :
                           category === 'Shopping' ? '🛒' :
                           category === 'Social' ? '👥' :
                           category === 'Finance' ? '💰' :
                           category === 'Travel' ? '✈️' :
                           category === 'Health' ? '🏥' :
                           category === 'Education' ? '📚' : '📁'
                          }
                        </span>
                        <span>{category}</span>
                      </div>
                      {emailCount > 0 && (
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                          isActive 
                            ? 'bg-blue-200 text-blue-800 shadow-sm' 
                            : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                        }`}>
                          {emailCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Enhanced Re-categorize Button */}
            {emails.length > 0 && (
              <div className="p-3 border-t border-gray-200/50 bg-gradient-to-t from-gray-50/50 to-transparent">
                <button
                  onClick={handleCategorizeEmails}
                  disabled={loading || emails.some(e => e.isProcessing)}
                  className={`w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    loading || emails.some(e => e.isProcessing)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className={`text-lg ${loading || emails.some(e => e.isProcessing) ? 'animate-spin' : ''}`}>
                      {loading || emails.some(e => e.isProcessing) ? '⚡' : '🔄'}
                    </span>
                    <span>
                      {emails.some(e => e.isProcessing) ? 'Processing...' : 'Re-categorize All'}
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Email Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {!emails.length ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <div className="relative mb-8">
                  <div className="text-8xl mb-4 animate-bounce">📨</div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Ready to Organize!
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Connect your Gmail and let our AI-powered system categorize your emails intelligently.
                </p>
                <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-center space-x-2 text-blue-700">
                    <span className="text-2xl">✨</span>
                    <span className="font-medium">Smart categorization awaits</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <EmailList filter={activeFilter} />
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Mobile Processing Indicator */}
      {emails.some(e => e.isProcessing) && (
        <div className="sm:hidden bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200 p-3 shadow-lg">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm text-blue-700 font-medium">
              AI is categorizing your emails...
            </span>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}