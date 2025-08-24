import { useEmailStore } from '../store/useEmailStore';
export default function HeroSection() {
  const { setLoginTrigger } = useEmailStore();
const handleGetStarted = () => {
  setLoginTrigger(true);
};
  return (
    <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* AI Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Powered by Advanced AI Technology</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI Email Assistant for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Smart Businesses</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Let AI automatically categorize, prioritize, and summarize your business emails. 
            Save 3+ hours daily and never miss important orders, payments, or customer messages.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
             onClick={handleGetStarted}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
              🚀 Start AI Magic - Free
            </button>
            <button className="w-full sm:w-auto border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              📹 Watch AI in Action
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>2-min Setup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}