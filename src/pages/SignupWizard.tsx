import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from '@tanstack/react-query';
import { upsertUser } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

export default function SignupWizard() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || '');
  const [title, setTitle] = useState(user?.nickname || '');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  const saveMutation = useMutation<unknown, Error, void>({
    mutationFn: async () => {
      const token = await getAccessTokenSilently();
      await upsertUser(token, {
        sub: user!.sub,
        name,
        title,
        avatarUrl: user!.picture || '',
        bio,
        location
      });
    },
    onSuccess: () => {
      navigate('/');
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);
  const finish = () => saveMutation.mutate();

  const percent = Math.round((step / 3) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linkedin-bg">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">Complete Your Profile (Step {step} of 3)</h2>
          <Progress value={percent} className="mb-4" />

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
              <p className="text-sm text-gray-700">Review your details:</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li><strong>Name:</strong> {name}</li>
                <li><strong>Title:</strong> {title}</li>
                <li><strong>Bio:</strong> {bio}</li>
                <li><strong>Location:</strong> {location}</li>
              </ul>
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