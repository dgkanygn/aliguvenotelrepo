import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import HeroManagement from './pages/HeroManagement';
import CounterManagement from './pages/CounterManagement';
import FounderManagement from './pages/FounderManagement';
import FeatureManagement from './pages/FeatureManagement';
import RoomManagement from './pages/RoomManagement';
import RestaurantManagement from './pages/RestaurantManagement';
import EventManagement from './pages/EventManagement';
import ContactManagement from './pages/ContactManagement';
import BannerManagement from './pages/BannerManagement';
import OverviewManagement from './pages/OverviewManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Dashboard & Overview */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      
      {/* Home Content Section */}
      <Route path="/hero" element={<ProtectedRoute><HeroManagement /></ProtectedRoute>} />
      <Route path="/counter" element={<ProtectedRoute><CounterManagement /></ProtectedRoute>} />
      <Route path="/founder" element={<ProtectedRoute><FounderManagement /></ProtectedRoute>} />
      <Route path="/overview" element={<ProtectedRoute><OverviewManagement /></ProtectedRoute>} />
      <Route path="/features" element={<ProtectedRoute><FeatureManagement /></ProtectedRoute>} />
      
      {/* Content Management Section */}
      <Route path="/rooms" element={<ProtectedRoute><RoomManagement /></ProtectedRoute>} />
      <Route path="/restaurant" element={<ProtectedRoute><RestaurantManagement /></ProtectedRoute>} />
      <Route path="/wedding" element={<ProtectedRoute><EventManagement /></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><ContactManagement /></ProtectedRoute>} />
      <Route path="/banners" element={<ProtectedRoute><BannerManagement /></ProtectedRoute>} />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;