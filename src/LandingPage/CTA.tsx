import { useEmailStore } from '../store/useEmailStore';
export default function CTASection() {
  const { setLoginTrigger } = useEmailStore();
const handleGetStarted = () => {
  setLoginTrigger(true);
};
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>🚀</span>
            <span>Join 10,000+ AI-Powered Businesses</span>
          </div>
        </div>
        
        <h2 className="text-3xl sm:text-5xl font-bold mb-6">
          Let AI Run Your Inbox,
          <br />
          <span className="text-blue-200">You Run Your Business</span>
        </h2>
        
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Start your AI email transformation today. Setup takes 2 minutes, results are immediate.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleGetStarted}
          className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
            🤖 Activate AI Assistant - Free
          </button>
        </div>
        
        <div className="mt-8 flex flex-wrap items-center justify-center space-x-8 text-sm text-blue-200">
          <span>✓ 2-minute AI setup</span>
          <span>✓ No credit card required</span>
          <span>✓ AI learns your patterns</span>
        </div>
      </div>
    </section>
  );
}