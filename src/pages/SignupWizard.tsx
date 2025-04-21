import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upsertUser } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StepIndicator } from '@/components/ui/StepIndicator';
import ProfileCard from '@/components/ProfileCard';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';

export default function SignupWizard() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || '');
  const [title, setTitle] = useState(user?.nickname || '');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  const saveMutation = useMutation<unknown, Error, void>({
    mutationFn: async () => {
      const token = await getAccessTokenSilently();
      const userData = {
        sub: user!.sub,
        name,
        title,
        avatarUrl: user!.picture || '',
        bio,
        location
      };
      await upsertUser(token, userData);
    },
    onSuccess: async () => {
      try {
        console.log("SignupWizard: Mutation success. Invalidating and awaiting refetch...");
        await queryClient.refetchQueries({ queryKey: ['currentUser'] });
        console.log("SignupWizard: currentUser query refetched. Navigating to /");
        navigate('/');
      } catch (refetchError) {
        console.error("SignupWizard: Failed to refetch currentUser after mutation:", refetchError);
        navigate('/');
      }
    },
    onError: (error) => {
      console.error("SignupWizard: Mutation failed:", error);
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const next = () => {
    console.log(`Moving from step ${step} to ${step + 1}`);
    setStep((s) => s + 1);
  }
  const back = () => {
    console.log(`Moving from step ${step} to ${step - 1}`);
    setStep((s) => s - 1);
  }
  const finish = () => {
    console.log("Finish button clicked, initiating mutation...");
    saveMutation.mutate();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linkedin-bg p-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        {/* Replace Placeholder with actual Logo component */}
        <div className="inline-block p-1 mb-4">
          <Logo className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
        <p className="text-md text-gray-600">Let's set up your profile before you dive in.</p>
      </div>

      {/* Wizard Card */}
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <StepIndicator currentStep={step} totalSteps={3} />
          <h2 className="text-xl font-semibold mb-4 text-center">Complete Your Profile</h2>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Software Engineer" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Your location" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-700 mb-4 text-center">Please review your details before saving:</p>
              <ProfileCard
                name={name}
                title={title}
                location={location}
                avatarUrl={user!.picture || ''}
                connectionCount={0}
                isCurrentUser={false}
              />
              {bio && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Bio</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{bio}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            {step > 1
              ? <Button variant="outline" onClick={back}>Back</Button>
              : <span />
            }
            {step < 3
              ? <Button onClick={next} disabled={(step === 1 && !name) || (step === 2 && !location)}>Next</Button>
              : <Button onClick={finish} disabled={saveMutation.status === 'pending'}>{saveMutation.status === 'pending' ? 'Saving...' : 'Finish'}</Button>
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 