import { useState, useEffect } from 'react';
import { useEmailStore } from './store/useEmailStore';
import Dashboard from './Dashboard';
import LandingPage from './components/LandingPage';
import GoogleLogin from './components/GoogleLogin'; // Add this import

export default function AppRouter() {
  const { isAuthenticated, loginTrigger, setLoginTrigger, initializeFromStorage } = useEmailStore(); // Add loginTrigger
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize from storage on app start
  useEffect(() => {
    initializeFromStorage();
    setIsInitialized(true);
  }, [initializeFromStorage]);
  
  // Show loading during initialization
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
  
  // If authenticated, show the app
  if (isAuthenticated) {
    return <Dashboard />;
  }
  
  // If not authenticated, show landing page
  return (
    <>
      <LandingPage />
      
      {/* Login Modal - only show when loginTrigger is true */}
      {loginTrigger && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setLoginTrigger(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Your Gmail</h3>
              <p className="text-gray-600">Sign in with Google to start organizing your emails with AI</p>
            </div>
            
            <div className="flex justify-center">
              <GoogleLogin
               />
            </div>
          </div>
        </div>
      )}
    </>
  );
}