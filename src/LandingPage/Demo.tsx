export default function DemoSection() {
  const categories = [
    { name: "🛒 Orders", count: 23, color: "bg-blue-100 text-blue-800" },
    { name: "💰 Payments", count: 12, color: "bg-green-100 text-green-800" },
    { name: "👥 Customers", count: 18, color: "bg-purple-100 text-purple-800" },
    { name: "📈 Marketing", count: 7, color: "bg-orange-100 text-orange-800" },
    { name: "🤝 Partners", count: 5, color: "bg-indigo-100 text-indigo-800" }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your AI-Organized Inbox
          </h2>
          <p className="text-xl text-gray-600">
            See how AI transforms chaotic emails into organized business intelligence
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-white font-medium">ClarityMail AI Dashboard</span>
              <div className="ml-auto flex items-center space-x-2 text-white text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>AI Active</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Categories */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🤖</span>
                  AI-Sorted Categories
                </h3>
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="font-medium text-gray-900">{category.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                        {category.count} new
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Summary */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">⚡</span>
                  AI Email Summary
                </h3>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">Order #12,345 - Premium Plan</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Orders</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <strong>AI Summary:</strong> Customer John upgraded to Premium ($245/month). Payment confirmed via Stripe. Requested faster support response time and white-label options.
                  </div>
                  <div className="text-sm">
                    <strong className="text-gray-900">AI Suggested Actions:</strong>
                    <ul className="mt-1 space-y-1 text-gray-600">
                      <li>• ✅ Process premium upgrade</li>
                      <li>• 📞 Schedule onboarding call</li>
                      <li>• 📋 Send white-label pricing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}