

import { useState, useEffect, useRef } from 'react';
import { useEmailStore } from '../store/useEmailStore';

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

interface GoogleLoginProps {}

const GoogleLogin: React.FC<GoogleLoginProps> = () => {
  const { 
    isAuthenticated, 
    accessToken,
    categorizing,
    categorizationProgress,
    setAuthenticated, 
    setEmails, 
    setLoading, 
    setError,
    logout,
    categorizeEmails
  } = useEmailStore();
  
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [gisReady, setGisReady] = useState(false);
  const [gapiReady, setGapiReady] = useState(false);
  const tokenClientRef = useRef<any>(null);

  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

  // Initialize Google APIs
  useEffect(() => {
    const initializeGapi = async () => {
      try {
        await new Promise<void>((resolve) => {
          window.gapi.load('client', resolve);
        });
        
        await window.gapi.client.init({
          discoveryDocs: [DISCOVERY_DOC],
        });
        
        setGapiReady(true);
      } catch (err) {
        console.error('Error initializing GAPI:', err);
        setError('Failed to initialize Google API');
      }
    };

    const initializeGis = () => {
      try {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse: any) => {
            if (tokenResponse?.error) {
              console.error('GIS token error:', tokenResponse);
              setError(`Authentication failed: ${tokenResponse.error}`);
              return;
            }
            
            // Set the access token for gapi client
            window.gapi.client.setToken({
              access_token: tokenResponse.access_token
            });
            
            setAuthenticated(true, tokenResponse.access_token);
            setError(null);
          },
        });
        setGisReady(true);
      } catch (err) {
        console.error('Error initializing GIS:', err);
        setError('Failed to initialize Google Identity Services');
      }
    };

    // Load GAPI script
    if (!window.gapi) {
      const gapiScript = document.createElement('script');
      gapiScript.src = 'https://apis.google.com/js/api.js';
      gapiScript.onload = initializeGapi;
      gapiScript.onerror = () => setError('Failed to load Google API script');
      document.head.appendChild(gapiScript);
    } else {
      initializeGapi();
    }

    // Load GIS script
    if (!window.google?.accounts) {
      const gisScript = document.createElement('script');
      gisScript.src = 'https://accounts.google.com/gsi/client';
      gisScript.onload = initializeGis;
      gisScript.onerror = () => setError('Failed to load Google Identity script');
      document.head.appendChild(gisScript);
    } else {
      initializeGis();
    }
  }, []);

  // Check if token is still valid on component mount
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      validateToken();
    }
  }, [isAuthenticated, accessToken]);

  const validateToken = async () => {
    if (!accessToken) return;
    
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken);
      if (!response.ok) {
        logout();
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
    }
  };

  const handleGoogleLogin = () => {
    if (!tokenClientRef.current || !gapiReady || !gisReady) {
      setError('Google services not ready. Please try again.');
      return;
    }
    
    setError(null);
    
    // Check if user is already authorized
    if (window.gapi.client.getToken()) {
      // Already authorized, just update state
      const token = window.gapi.client.getToken();
      setAuthenticated(true, token.access_token);
    } else {
      // Request new authorization
      tokenClientRef.current.requestAccessToken({ prompt: 'consent' });
    }
  };

  const fetchEmails = async () => {
    if (!accessToken || !gapiReady) return;
    
    setIsLoadingEmails(true);
    setError(null);
    
    try {
      // Make sure the token is set
      window.gapi.client.setToken({
        access_token: accessToken
      });

      // Use GAPI client to fetch emails
      const listResponse = await window.gapi.client.gmail.users.messages.list({
        userId: 'me',
        maxResults: 5,
        q: 'in:inbox'
      });

      const messages = listResponse.result.messages || [];
      
      if (!messages.length) {
        setEmails([]);
        return;
      }

      // Fetch detailed information for each email
      const emailPromises = messages.map(async (message: { id: string }) => {
        const emailResponse = await window.gapi.client.gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full'
        });

        return emailResponse.result;
      });

      const emailsData = await Promise.all(emailPromises);
      
      // Process and format emails
      const formattedEmails = emailsData.map((emailData) => {
        const headers = emailData.payload.headers || [];
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
        const from = headers.find((h: any) => h.name === 'From')?.value || 'Unknown Sender';
        const date = headers.find((h: any) => h.name === 'Date')?.value || new Date().toISOString();
        
        // Extract body content
        let body = '';
        const extractBody = (part: any): string => {
          if (part.mimeType === 'text/plain' && part.body?.data) {
            return atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          }
          if (part.parts) {
            for (const subPart of part.parts) {
              const extracted = extractBody(subPart);
              if (extracted) return extracted;
            }
          }
          return '';
        };
        
        if (emailData.payload.body?.data) {
          body = atob(emailData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        } else if (emailData.payload.parts) {
          body = extractBody(emailData.payload);
        }

        return {
          id: emailData.id,
          subject,
          from,
          snippet: emailData.snippet || '',
          body: body.substring(0, 1000), // Limit body length
          timestamp: date,
          category: 'uncategorized', // Will be categorized automatically
        };
      });

      // Set emails immediately so user can see them
      setEmails(formattedEmails);
      
      // Start categorization automatically in the background
      setTimeout(() => {
        categorizeEmails();
      }, 1000); // Small delay to let the UI update first
      
    } catch (error) {
      console.error('Error fetching emails:', error);
      if (error instanceof Error && error.message.includes('401')) {
        logout();
        setError('Authentication expired. Please log in again.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to fetch emails');
      }
    } finally {
      setIsLoadingEmails(false);
    }
  };

  const handleLogout = () => {
    // Revoke the token
    const token = window.gapi?.client?.getToken();
    if (token?.access_token) {
      window.google?.accounts?.oauth2?.revoke(token.access_token);
      window.gapi.client.setToken('');
    }
    logout();
  };

  const isReady = gisReady && gapiReady;

  if (!isAuthenticated) {
    return (
      <button
        onClick={handleGoogleLogin}
        disabled={!isReady}
        className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>{!isReady ? 'Initializing...' : 'Connect Gmail'}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Fetch Emails Button */}
      <button
        onClick={fetchEmails}
        disabled={isLoadingEmails || !isReady || categorizing}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
      >
        {isLoadingEmails ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Fetching...</span>
          </>
        ) : categorizing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>
              Categorizing... {categorizationProgress && 
                `(${categorizationProgress.processed}/${categorizationProgress.total})`
              }
            </span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M12 12v7" />
            </svg>
            <span>Fetch Emails</span>
          </>
        )}
      </button>

      {/* Manual Categorize Button */}
      <button
        onClick={categorizeEmails}
        disabled={categorizing || isLoadingEmails}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
      >
        {categorizing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Categorizing...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Categorize</span>
          </>
        )}
      </button>

      {/* User Info & Logout */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          {/* <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg> */}
        </div>
        
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default GoogleLogin;