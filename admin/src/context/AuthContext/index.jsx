import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await authService.me();
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const checkDailyLogout = () => {
      const now = new Date();
      if (now.getHours() >= 13) {
        const lastCleared = localStorage.getItem('last_cleared_13_date');
        // YYYY-MM-DD olarak bugünün tarihini al
        const todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
        
        if (lastCleared !== todayStr) {
          localStorage.removeItem('token');
          localStorage.setItem('last_cleared_13_date', todayStr);
          setUser(null);
          
          // Eğer login sayfasında değilsek login'e at
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
    };

    checkDailyLogout(); // İlk başta kontrol et
    const interval = setInterval(checkDailyLogout, 60000); // Her dakika kontrol et

    return () => clearInterval(interval);
  }, []);

  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      if (data.success) {
        await checkAuth(); // re-fetch user details and set them
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuth, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
