import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/lib/api';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

interface RequireProfileCompleteProps {
  children: React.ReactNode;
}

// Redirects to /signup if any required profile field is missing
export default function RequireProfileComplete({ children }: RequireProfileCompleteProps) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { data: profile, isLoading } = useQuery<{
    sub: string;
    name: string;
    title?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
  }, Error>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return fetchCurrentUser(token);
    },
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading profile…</div>;
  }

  // Check after loading and authentication
  if (!isLoading && isAuthenticated) {
    // Redirect if profile doesn't exist OR if it exists but is incomplete
    if (!profile) {
      console.log("RequireProfileComplete: Redirecting to /signup due to missing profile");
      return <Navigate to="/signup" replace />;
    } else if (!profile.title || !profile.location || !profile.bio) {
      console.log("RequireProfileComplete: Redirecting to /signup due to missing fields", profile);
      return <Navigate to="/signup" replace />;
    }
  }

  return <>{children}</>;
} 