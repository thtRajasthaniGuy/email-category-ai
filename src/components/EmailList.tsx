import { useEmailStore } from '../store/useEmailStore';
import { EmailCard } from './EmailCard';

interface EmailListProps {
  filter?: string;
}

export const EmailList = ({ filter = 'All' }: EmailListProps) => {
  const { emails, loading, error } = useEmailStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading emails...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div className="text-red-800 font-medium">Error:</div>
        <div className="text-red-600 mt-1">{error}</div>
      </div>
    );
  }

  if (!emails.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        <div className="text-6xl mb-4">📧</div>
        <h3 className="text-lg font-medium mb-2">No emails found</h3>
        <p>Connect your Gmail account to start categorizing emails.</p>
      </div>
    );
  }

  // Filter emails based on the selected filter
  const filteredEmails = emails.filter(email => {
    if (filter === 'All') return true;
    if (filter === 'Uncategorized') {
      return !email.category || email.category === 'uncategorized';
    }
    return email.category === filter.toLowerCase();
  });

  // Group emails by category for display
  const grouped = filteredEmails.reduce((acc: Record<string, typeof emails>, email) => {
    const category = email.category || 'uncategorized';
    const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
    
    if (!acc[displayCategory]) {
      acc[displayCategory] = [];
    }
    acc[displayCategory].push(email);
    return acc;
  }, {});

  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    // Sort categories: uncategorized last, others alphabetically
    if (a === 'Uncategorized') return 1;
    if (b === 'Uncategorized') return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="p-4">
      {filter !== 'All' && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {filter} ({filteredEmails.length})
          </h2>
        </div>
      )}
      
      {sortedCategories.map((category) => (
        <div key={category} className="mb-8">
          {filter === 'All' && (
            <h2 className="text-xl font-bold mb-4 flex items-center">
              {category}
              <span className="ml-2 text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {grouped[category].length}
              </span>
            </h2>
          )}
          
          <div className="space-y-4">
            {grouped[category].map((email) => (
              <EmailCard key={email.id} email={email} />
            ))}
          </div>
        </div>
      ))}

      {filteredEmails.length === 0 && filter !== 'All' && (
        <div className="text-center p-8 text-gray-500">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium mb-2">No emails in "{filter}"</h3>
          <p>Try selecting a different category or "All" to see more emails.</p>
        </div>
      )}
    </div>
  );
};