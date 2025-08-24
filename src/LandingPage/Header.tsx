import { useState } from 'react';
import { useEmailStore } from '../store/useEmailStore';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setLoginTrigger } = useEmailStore();
  const handleGetStarted = () => {
  setLoginTrigger(true);
}

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ClarityMail</span>
            </div>
            
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </button>
            
            <button
            onClick={handleGetStarted}
            className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4">
          <button
          onClick={handleGetStarted}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Get Started Free
          </button>
        </div>
      )}
    </>
  );
}