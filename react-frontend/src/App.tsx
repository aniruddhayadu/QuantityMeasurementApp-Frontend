import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// 🛡️ YAHAN CHANGE KIYA HAI: JSX.Element ki jagah React.ReactNode likha hai
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('qm_token');
  if (!token || token === 'null') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// 🔑 Token Handler & Login Page
function AuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    
    if (urlToken) {
      localStorage.setItem('qm_token', urlToken);
      window.history.replaceState({}, document.title, "/dashboard"); 
      navigate('/dashboard');
    } else {
      const existingToken = localStorage.getItem('qm_token');
      if (existingToken && existingToken !== 'null') {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  return <Login />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthHandler />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;