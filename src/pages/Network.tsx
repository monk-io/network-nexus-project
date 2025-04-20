import Header from "@/components/Header";
import ConnectionCard from "@/components/ConnectionCard";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchConnections, fetchSuggestions, createConnection, fetchPendingConnections, updateConnection, deleteConnection } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid2X2, Grid3X3, UserPlus, Users, UsersRound, User } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

// Types for API data
interface Suggestion { id: string; name: string; title: string; avatarUrl: string; mutualConnections: number; profileUrl: string; }
interface ConnectionUser { _id: string; name: string; title?: string; avatarUrl?: string; }

// Types for pending connection invitations
interface PendingConnection {
  _id: string;
  from: {
    sub: string;
    name: string;
    title?: string;
    avatarUrl?: string;
  };
}

export default function Network() {
  const [gridView, setGridView] = useState<'grid' | 'list'>('grid');
  const queryClient = useQueryClient();
  const { getAccessTokenSilently, isAuthenticated, isLoading: authLoading } = useAuth0();

  // Fetch existing connections
  const { data: connections = [], isLoading: connectionsLoading } = useQuery<ConnectionUser[], Error>({
    queryKey: ['connections'],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return fetchConnections(token);
    },
    enabled: isAuthenticated,
  });

  // Fetch suggestions
  const { data: suggestions = [], isLoading: suggestionsLoading } = useQuery<Suggestion[], Error>({
    queryKey: ['suggestions'],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return fetchSuggestions(token);
    },
    enabled: isAuthenticated,
  });

  // Fetch pending connection requests
  const { data: pending = [], isLoading: pendingLoading } = useQuery<PendingConnection[], Error>({
    queryKey: ['pendingConnections'],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return fetchPendingConnections(token);
    },
    enabled: isAuthenticated,
  });

  // Mutations for accepting or rejecting invitations
  const acceptMutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const token = await getAccessTokenSilently();
      await updateConnection(token, id, 'connected');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({ queryKey: ['pendingConnections'] });
    },
  });
  const rejectMutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const token = await getAccessTokenSilently();
      await deleteConnection(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingConnections'] });
    },
  });

  const handleConnect = async (id: string) => {
    const token = await getAccessTokenSilently();
    await createConnection(token, id);
    // Refresh both lists
    queryClient.invalidateQueries({ queryKey: ['connections'] });
    queryClient.invalidateQueries({ queryKey: ['suggestions'] });
  };

  return (
    <div className="min-h-screen bg-linkedin-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Left sidebar */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="border-b p-4">
                  <h2 className="font-medium">Manage my network</h2>
                </div>
                <ul className="py-2">
                  <li>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-linkedin-blue">
                      <UsersRound className="h-5 w-5 mr-3" />
                      Connections
                      <span className="ml-auto text-gray-500">{connections.length}</span>
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-linkedin-blue">
                      <UserPlus className="h-5 w-5 mr-3" />
                      People I Follow
                      <span className="ml-auto text-gray-500">0</span>
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-linkedin-blue">
                      <Users className="h-5 w-5 mr-3" />
                      Groups
                      <span className="ml-auto text-gray-500">0</span>
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-linkedin-blue">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      Pages
                      <span className="ml-auto text-gray-500">0</span>
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Add personal contacts</h3>
                <p className="text-xs text-gray-500 mb-3">
                  We'll periodically import and store your contacts to help you and others connect. You choose who to connect to and who to invite.
                </p>
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full p-2 border border-gray-300 rounded-md mb-2"
                />
                <Button className="w-full bg-linkedin-blue hover:bg-linkedin-lightblue">
                  Continue
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <Tabs defaultValue="connections" className="w-full">
              <Card className="mb-4">
                <CardHeader className="p-0">
                  <div className="flex items-center justify-between p-4">
                    <TabsList className="bg-transparent p-0">
                      <TabsTrigger 
                        value="connections" 
                        className="text-base font-medium px-2 py-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-linkedin-blue"
                      >
                        My Connections
                      </TabsTrigger>
                      <TabsTrigger 
                        value="suggestions" 
                        className="text-base font-medium px-2 py-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-linkedin-blue"
                      >
                        People You May Know
                      </TabsTrigger>
                      <TabsTrigger 
                        value="pending" 
                        className="text-base font-medium px-2 py-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-linkedin-blue"
                      >
                        Invitations
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${gridView === 'grid' ? 'text-linkedin-blue' : 'text-gray-500'}`}
                        onClick={() => setGridView('grid')}
                      >
                        <Grid3X3 className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${gridView === 'list' ? 'text-linkedin-blue' : 'text-gray-500'}`}
                        onClick={() => setGridView('list')}
                      >
                        <Grid2X2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              <TabsContent value="connections" className="mt-0">
                <div className={gridView === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
                  {connectionsLoading ? (
                    <div>Loading connections…</div>
                  ) : (
                    connections.map(c => (
                      <ConnectionCard
                        key={c._id}
                        id={c._id}
                        name={c.name}
                        title={c.title}
                        avatarUrl={c.avatarUrl}
                        profileUrl={`/profile/${encodeURIComponent(c.name.toLowerCase().replace(/\s+/g, '-'))}`}
                        isConnected={true}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="suggestions" className="mt-0">
                <div className={gridView === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
                  {suggestionsLoading ? (
                    <div>Loading suggestions…</div>
                  ) : (
                    suggestions.map(suggestion => (
                      <ConnectionCard
                        key={suggestion.id}
                        id={suggestion.id}
                        name={suggestion.name}
                        title={suggestion.title}
                        avatarUrl={suggestion.avatarUrl}
                        mutualConnections={suggestion.mutualConnections}
                        profileUrl={suggestion.profileUrl}
                        onConnect={handleConnect}
                        isConnected={false}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="mt-0">
                {pendingLoading ? (
                  <div>Loading invitations…</div>
                ) : pending.length === 0 ? (
                  <div>No pending invitations</div>
                ) : (
                  pending.map(conn => (
                    <div key={conn._id} className="flex items-center justify-between p-3 border-b">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conn.from.avatarUrl} />
                          <AvatarFallback>
                            <User className="h-5 w-5 text-gray-500" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link to={`/profile/${encodeURIComponent(conn.from.sub)}`} className="font-medium hover:underline">
                            {conn.from.name}
                          </Link>
                          <p className="text-xs text-gray-500">{conn.from.title}</p>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button size="sm" onClick={() => acceptMutation.mutate(conn._id)}>
                          Accept
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => rejectMutation.mutate(conn._id)}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
