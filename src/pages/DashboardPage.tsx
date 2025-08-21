
import React from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navigation />
        <Dashboard />
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
