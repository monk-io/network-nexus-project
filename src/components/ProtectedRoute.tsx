import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const location = useLocation();
  
  console.log('ProtectedRoute - Auth State:', {
    isAuthenticated,
    isLoading,
    user,
    path: location.pathname
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading…</div>;
  }
  if (!isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to signup');
    // Redirect to /signup for root path, otherwise /login
    return <Navigate to={location.pathname === '/' ? '/signup' : '/login'} replace />;
  }
  return <>{children}</>;
} 