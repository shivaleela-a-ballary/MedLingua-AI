import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Skip auth check on login and signup pages
    if (location.pathname === '/' || location.pathname === '/signup') {
      setLoading(false);
      return;
    }

    // Check authentication for other pages
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
      navigate('/');
    }
  }, [token, location.pathname]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const updatePreferences = async (age, language) => {
    try {
      const res = await fetch('/api/auth/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ age, language })
      });
      if (res.ok) {
        setUser({ ...user, age, language });
      }
    } catch (error) {
      console.error('Update preferences error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, updatePreferences }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
