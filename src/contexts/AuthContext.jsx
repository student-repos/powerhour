import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:7500/user/getprotected', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.data);
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:7500/user/login', { email, password });
      localStorage.setItem('token', response.data.accessToken);
      setUser(response.data.user);

      // Ensure the dashboard URL matches the paths defined in App.js
      const dashboardUrlMap = {
        admin: '/dashboard/admin',
        trainer: '/dashboard/trainer',
        member: '/dashboard/member'
      };
      const dashboardUrl = dashboardUrlMap[response.data.user.role] || '/';

      navigate(dashboardUrl); // Navigate to the dashboard based on user role
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
