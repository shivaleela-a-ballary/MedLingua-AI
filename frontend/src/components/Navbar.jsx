import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/chat" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">MedLingua AI</span>
          </Link>
          
          <div className="flex space-x-1">
            <Link 
              to="/chat" 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/chat') 
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-emerald-50'
              }`}
            >
              💬 Chatbot
            </Link>
            
            <Link 
              to="/health-news" 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/health-news') 
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-emerald-50'
              }`}
            >
              📰 Health News
            </Link>
            
            <Link 
              to="/blood-bank" 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/blood-bank') 
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-emerald-50'
              }`}
            >
              🩸 Blood Bank
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
