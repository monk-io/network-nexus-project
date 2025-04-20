import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { upsertUser } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Network from "./pages/Network";
import SignupWizard from '@/pages/SignupWizard';
import RequireProfileComplete from '@/components/RequireProfileComplete';
import NotFound from "./pages/NotFound";
import React, { useEffect } from 'react';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  // On initial login, upsert user profile
  const mutation = useMutation<unknown, Error, void>({
    mutationFn: async () => {
      const token = await getAccessTokenSilently();
      await upsertUser(token, {
        sub: user!.sub,
        name: user!.name,
        title: user!.nickname || '',
        avatarUrl: user!.picture || '',
        bio: '',
        location: ''
      });
    },
  });
  useEffect(() => {
    if (isAuthenticated && user) {
      mutation.mutate();
    }
  }, [isAuthenticated, user]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<ProtectedRoute><SignupWizard /></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute><RequireProfileComplete><Index /></RequireProfileComplete></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><RequireProfileComplete><Profile /></RequireProfileComplete></ProtectedRoute>} />
            <Route path="/network" element={<ProtectedRoute><RequireProfileComplete><Network /></RequireProfileComplete></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
