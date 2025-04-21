import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function Login() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);
  return <div className="flex items-center justify-center h-screen">Redirecting to login…</div>;
} 