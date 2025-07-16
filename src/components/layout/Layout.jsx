
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

const Layout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Public routes that don't need the sidebar/header
  const publicRoutes = ['/auth', '/welcome'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  console.log('Layout: Auth state', { isAuthenticated, loading, pathname: location.pathname, isPublicRoute });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || isPublicRoute) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
