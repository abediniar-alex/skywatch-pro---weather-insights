
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import { api } from './api/client';
import { AuthStatus } from './types';

const App: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.LOADING);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      setAuthStatus(AuthStatus.AUTHENTICATED);
    } else {
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
    }
  }, []);

  const handleLogin = () => {
    setAuthStatus(AuthStatus.AUTHENTICATED);
  };

  const handleLogout = () => {
    api.setToken(null);
    setAuthStatus(AuthStatus.UNAUTHENTICATED);
  };

  if (authStatus === AuthStatus.LOADING) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Initializing SkyWatch...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout isAuthenticated={authStatus === AuthStatus.AUTHENTICATED} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route 
            path="/login" 
            element={
              authStatus === AuthStatus.AUTHENTICATED 
                ? <Navigate to="/" /> 
                : <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              authStatus === AuthStatus.AUTHENTICATED 
                ? <Navigate to="/" /> 
                : <Register />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
