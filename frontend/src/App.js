import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './App.css';

// Tenant page component imports
import TenantDashboard from './pages/tenant/TenantDashboard'; 
import ProfileMatch from './pages/tenant/FindRoommatesPage'; // FindRoommatesPage.jsx 파일명 사용
import Messages from './pages/tenant/Messages'; // MessageDetail 페이지로 가정
import NotFoundPage from './pages/NotFoundPage'; // (404 페이지)

// 2. Routing
function App() {
  return (
    <Router>
      <div className="App">
        {/* TODO: Enter Navbar, Sidebar, etc.
        */}
        <Routes>
          {/* Tenant Flow routing */}
          <Route path="/" element={<TenantDashboard />} /> 
          <Route path="/dashboard" element={<TenantDashboard />} />
          <Route path="/match" element={<ProfileMatch />} />
          {/* Message details page(ID parameters required) */}
          <Route path="/messages/:id" element={<Messages />} /> 
          
          {/* Other routing */}
          <Route path="*" element={<NotFoundPage />} /> {/* 404 Not Found */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
