
export default function Footer() {
  
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold">ClarityMail</span>
            </div>
            <p className="text-gray-400 max-w-md">
              AI-powered email management for modern businesses. 
              Save time, increase productivity, and never miss important communications.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">AI Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About AI</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            © 2024 ClarityMail AI. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-4 sm:mt-0">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>AI Systems Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}