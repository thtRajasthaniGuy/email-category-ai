import { create } from 'zustand';
import { categorizeEmail } from '../mcp/categorizeEmail';
import { processEmailFull } from '../mcp/processEmail';
import { fetchRecentMessages } from '../utils/gmail';

export interface Email {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  body: string;
  timestamp: string;
  category?: string;
  summary?: string;
  actionItems?: string;
  isProcessing?: boolean;
  isSummarizing?: boolean;
}

interface EmailStore {
  emails: Email[];
  isAuthenticated: boolean;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  categorizing: boolean;
  categorizationProgress: { processed: number; total: number } | null;
  loginTrigger: boolean;
   pageToken: string | null;
   nextPageToken: string | null;
  
  
  // Email management
  setEmails: (emails: Email[]) => void;
  updateEmail: (id: string, updates: Partial<Email>) => void;
  
  // Authentication
  setAuthenticated: (authenticated: boolean, token?: string) => void;
  logout: () => void;
  
  // Loading and error states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Categorization
  categorizeEmails: () => Promise<void>;
  setCategorizing: (categorizing: boolean) => void;
  setCategorizationProgress: (progress: { processed: number; total: number } | null) => void;
  
  // Email processing
  summarizeEmail: (emailId: string) => Promise<void>;
  
  // Category management
  getAllCategories: () => string[];
  getEmailsByCategory: (category: string) => Email[];
  
  // Persistence
  initializeFromStorage: () => void;

   setLoginTrigger: (trigger: boolean) => void;
   fetchEmails: (pageToken?: string) => Promise<void>;
    setAccessToken: (token: string) => void;
     clearEmails: () => void;
}

export const useEmailStore = create<EmailStore>((set, get) => ({
  emails: [],
  isAuthenticated: false,
  accessToken: null,
  loading: false,
  error: null,
  categorizing: false,
  categorizationProgress: null,
  loginTrigger: false,
  pageToken:null,
  nextPageToken:null,

  setEmails: (emails) => {
    set({ emails });
    // Persist emails to localStorage
    try {
      localStorage.setItem('gmail_emails', JSON.stringify(emails));
    } catch (error) {
      console.error('Error saving emails to localStorage:', error);
    }
  },
  
  updateEmail: (id, updates) => {
    set((state) => {
      const updatedEmails = state.emails.map(email => 
        email.id === id ? { ...email, ...updates } : email
      );
      
      // Persist updated emails to localStorage
      try {
        localStorage.setItem('gmail_emails', JSON.stringify(updatedEmails));
      } catch (error) {
        console.error('Error saving updated emails to localStorage:', error);
      }
      
      return { emails: updatedEmails };
    });
  },

  setAuthenticated: (authenticated, token) => {
    // set({ 
    //   isAuthenticated: authenticated, 
    //   accessToken: token || null 
    // });
    
    // // Persist auth state
    // try {
    //   if (authenticated && token) {
    //     localStorage.setItem('gmail_access_token', token);
    //     localStorage.setItem('gmail_authenticated', 'true');
    //   } else {
    //     localStorage.removeItem('gmail_access_token');
    //     localStorage.removeItem('gmail_authenticated');
    //   }
    // } catch (error) {
    //   console.error('Error saving auth state:', error);
    // }
     const expiresAt = Date.now() + 55 * 60 * 1000; // assume 55 min lifetime for safety
  set({ 
    isAuthenticated: authenticated, 
    accessToken: token || null,
  });

  try {
    if (authenticated && token) {
      localStorage.setItem('gmail_access_token', token);
      localStorage.setItem('gmail_authenticated', 'true');
      localStorage.setItem('gmail_expires_at', String(expiresAt));
    } else {
      localStorage.removeItem('gmail_access_token');
      localStorage.removeItem('gmail_authenticated');
      localStorage.removeItem('gmail_expires_at');
    }
  } catch (error) {
    console.error('Error saving auth state:', error);
  }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCategorizing: (categorizing) => set({ categorizing }),
  setCategorizationProgress: (progress) => set({ categorizationProgress: progress }),

  logout: () => {
    set({ 
      isAuthenticated: false, 
      accessToken: null, 
      emails: [],
      error: null,
      categorizing: false,
      categorizationProgress: null
    });
    
    // Clear localStorage
    try {
      localStorage.removeItem('gmail_access_token');
      localStorage.removeItem('gmail_authenticated');
      localStorage.removeItem('gmail_emails');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // categorizeEmails: async () => {
  //   const { emails, setCategorizing, setCategorizationProgress, setError, updateEmail } = get();
    
  //   // Filter uncategorized emails
  //   const uncategorizedEmails = emails.filter(email => 
  //     !email.category || email.category === 'uncategorized'
  //   );
    
  //   if (uncategorizedEmails.length === 0) {
  //     console.log('No uncategorized emails to process');
  //     return;
  //   }

  //   setCategorizing(true);
  //   setCategorizationProgress({ processed: 0, total: uncategorizedEmails.length });
  //   setError(null);

  //   try {
  //     console.log(`Starting to categorize ${uncategorizedEmails.length} emails in batches...`);
      
  //     // Mark emails as processing
  //     uncategorizedEmails.forEach(email => {
  //       updateEmail(email.id, { isProcessing: true });
  //     });
      
  //     // await categorizeBatchEmails(
  //     //   uncategorizedEmails,
  //     //   // Progress callback
  //     //   (processed, total) => {
  //     //     setCategorizationProgress({ processed, total });
  //     //     console.log(`Categorization progress: ${processed}/${total}`);
  //     //   },
  //     //   // Individual email categorized callback
  //     //   (emailId, category) => {
  //     //     updateEmail(emailId, { category, isProcessing: false });
  //     //     console.log(`Email ${emailId} categorized as: ${category}`);
  //     //   }
  //     // );

  //     console.log('All emails categorized successfully!');
  //     setCategorizationProgress(null);
      
  //   } catch (error) {
  //     console.error('Error during email categorization:', error);
  //     setError(error instanceof Error ? error.message : 'Failed to categorize emails');
  //     setCategorizationProgress(null);
      
  //     // Clear processing state on error
  //     uncategorizedEmails.forEach(email => {
  //       updateEmail(email.id, { isProcessing: false });
  //     });
  //   } finally {
  //     setCategorizing(false);
  //   }
  // },

  categorizeEmails: async () => {
  const { emails, setCategorizing, setCategorizationProgress, setError, updateEmail } = get();

  const uncategorizedEmails = emails.filter(
    email => !email.category || email.category === "uncategorized"
  );

  if (uncategorizedEmails.length === 0) {
    console.log("✅ No uncategorized emails to process");
    return;
  }

  setCategorizing(true);
  setCategorizationProgress({ processed: 0, total: uncategorizedEmails.length });
  setError(null);

  try {
    console.log(`📩 Categorizing ${uncategorizedEmails.length} emails...`);

    for (let i = 0; i < uncategorizedEmails.length; i++) {
      const email = uncategorizedEmails[i];
      updateEmail(email.id, { isProcessing: true });

      const categoryKey = await categorizeEmail(email.snippet || email.body || "", email.subject);

      updateEmail(email.id, { category: categoryKey, isProcessing: false });
      setCategorizationProgress({ processed: i + 1, total: uncategorizedEmails.length });

      console.log(`✅ Email ${email.id} categorized as: ${categoryKey}`);
    }

    console.log("🎉 All emails categorized!");
    setCategorizationProgress(null);

  } catch (error) {
    console.error("❌ Error during categorization:", error);
    setError(error instanceof Error ? error.message : "Failed to categorize emails");
    setCategorizationProgress(null);

    uncategorizedEmails.forEach(email => {
      updateEmail(email.id, { isProcessing: false });
    });
  } finally {
    setCategorizing(false);
  }
},
  summarizeEmail: async (emailId) => {
    const { emails, updateEmail } = get();
    const email = emails.find(e => e.id === emailId);
    
    if (!email || email.isSummarizing) {
      console.log(`Cannot summarize email ${emailId}: email not found or already summarizing`);
      return;
    }
    
    updateEmail(emailId, { isSummarizing: true });
    
    try {
      console.log(`Starting to summarize email ${emailId}...`);
      const emailContent = `Subject: ${email.subject}\nFrom: ${email.from}\nContent: ${email.body || email.snippet}`;
      const result = await processEmailFull(emailContent);
      
      updateEmail(emailId, {
        summary: result.summary,
        actionItems: result.actionItems,
        isSummarizing: false
      });
      
      console.log(`Email ${emailId} summarized successfully`);
    } catch (error) {
      console.error(`Error summarizing email ${emailId}:`, error);
      updateEmail(emailId, {
        summary: 'Failed to generate summary',
        actionItems: '',
        isSummarizing: false
      });
    }
  },

  getAllCategories: () => {
    const { emails } = get();
    const categories = new Set<string>();
    categories.add('All');
    categories.add('Uncategorized');
    
    emails.forEach(email => {
      if (email.category && email.category !== 'uncategorized') {
        const categoryName = email.category.charAt(0).toUpperCase() + email.category.slice(1);
        categories.add(categoryName);
      }
    });
    
    return Array.from(categories);
  },

  getEmailsByCategory: (category) => {
    const { emails } = get();
    if (category === 'All') return emails;
    if (category === 'Uncategorized') {
      return emails.filter(email => !email.category || email.category === 'uncategorized');
    }
    return emails.filter(email => email.category === category.toLowerCase());
  },

  initializeFromStorage: () => {
    try {
      console.log('Initializing from localStorage...');
      
      const isAuthenticated = localStorage.getItem('gmail_authenticated') === 'true';
      const accessToken = localStorage.getItem('gmail_access_token');
      
      // if (isAuthenticated && accessToken) {
      //   console.log('Restored authentication state');
      //   set({ isAuthenticated: true, accessToken });
      // }
      
      // if (emailsData) {
      //   try {
      //     const emails = JSON.parse(emailsData);
      //     console.log(`Restored ${emails.length} emails from localStorage`);
      //     set({ emails });
      //   } catch (parseError) {
      //     console.error('Error parsing emails from localStorage:', parseError);
      //     localStorage.removeItem('gmail_emails'); // Clear corrupted data
      //   }
      // }
      const expiresAt = localStorage.getItem('gmail_expires_at');
if (isAuthenticated && accessToken && expiresAt) {
  if (Date.now() < parseInt(expiresAt)) {
    set({ isAuthenticated: true, accessToken });
  } else {
    console.log('Stored token expired, forcing logout');
    set({ isAuthenticated: false, accessToken: null });
  }
}
    } catch (error) {
      console.error('Error initializing from storage:', error);
    }
  },
  setLoginTrigger: (trigger) => set({ loginTrigger: trigger }),
  setAccessToken: (token) => set({ accessToken: token }),
   clearEmails: () => set({ emails: [], nextPageToken: null }),
  fetchEmails: async (pageToken?: string) => {
  const { accessToken, setEmails } = get();
  if (!accessToken) return;
console.log("fetchEmails page token", pageToken)
  try {
    const { messages, nextPageToken } = await fetchRecentMessages(accessToken, 5, pageToken);

    const emails = messages.map((m) => ({
      id: m.id,
      subject: m.subject,
      from: m.from,
      snippet: m.snippet,
      body: '',
      timestamp: m.date,
      category: 'uncategorized',
    }));

    // Append if loading more, otherwise replace
    if (pageToken) {
      setEmails([...get().emails, ...emails]);
    } else {
      setEmails(emails);
    }

    // Save the new token so UI can show "Load More"
    set({ nextPageToken });
  } catch (err) {
    console.error('Error fetching emails:', err);
  }
},
}));