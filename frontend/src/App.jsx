import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Chatbot from './pages/Chatbot';
import HealthNews from './pages/HealthNews';
import BloodBank from './pages/BloodBank';

function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/health-news" element={<HealthNews />} />
        <Route path="/blood-bank" element={<BloodBank />} />
      </Routes>
    </div>
  );
}

export default App;
