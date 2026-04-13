import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// 🛡️ Protected Route Logic
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('qm_token');
  // Check if token exists and is not literally the string "null"
  if (!token || token === 'null') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// 🔑 Token Handler Logic
function AuthHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. URL se token nikalo
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    
    if (urlToken) {
      console.log("Token received from URL, saving...");
      localStorage.setItem('qm_token', urlToken);
      
      // Clean URL: Remove token from browser address bar
      window.history.replaceState({}, document.title, "/dashboard"); 
      
      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      // 2. Agar URL mein token nahi hai, toh localstorage check karo
      const existingToken = localStorage.getItem('qm_token');
      if (existingToken && existingToken !== 'null') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate, location]);

  return <Login />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Fix: Dono paths ko AuthHandler handle karega */}
        <Route path="/" element={<AuthHandler />} />
        <Route path="/login-success" element={<AuthHandler />} /> 
        
        {/* Dashboard path */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all: Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;