export default function FeaturesSection() {
  const features = [
    {
      icon: "🧠",
      title: "Smart AI Categorization",
      description: "AI automatically learns your business patterns and sorts emails into Orders, Payments, Customers, Marketing, and custom categories",
      highlight: "99.2% accuracy"
    },
    {
      icon: "⚡",
      title: "Instant AI Summaries", 
      description: "Complex email threads become clear summaries with key decisions, action items, and next steps highlighted by AI",
      highlight: "3-sec processing"
    },
    {
      icon: "🎯",
      title: "Predictive Insights",
      description: "AI predicts email priority, suggests responses, and identifies urgent business opportunities before you miss them",
      highlight: "AI-powered"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>🤖</span>
            <span>AI Technology at Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            See the AI Magic in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our advanced AI doesn't just sort emails - it understands your business context
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all hover:scale-105">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <div className="mb-3">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-bold">
                  {feature.highlight}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}