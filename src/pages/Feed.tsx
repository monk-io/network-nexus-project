import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchFeed, fetchSuggestions, createConnection, fetchCurrentUser, fetchConnections } from '@/lib/api';
import CreatePostCard from "@/components/CreatePostCard";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import ProfileCard from "@/components/ProfileCard";
import ConnectionCard from "@/components/ConnectionCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

// Type for feed post data fetched from API
interface FeedPost {
  _id: string;
  id: string;
  author: {
    _id: string;
    username: string;
    name: string;
    title?: string;
    avatarUrl?: string;
    profileUrl?: string;
  };
  content: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

// Type for connection suggestion
interface Suggestion {
  _id: string;
  sub: string;
  username: string;
  name: string;
  title?: string;
  avatarUrl?: string;
}

// Types for user and connections
interface UserProfile { sub: string; name: string; title?: string; avatarUrl?: string; location?: string; }
interface ConnectionUser { _id: string; name: string; title?: string; avatarUrl?: string; }

export default function Feed() {
  const { getAccessTokenSilently, isAuthenticated, isLoading: authLoading } = useAuth0();
  const queryClient = useQueryClient();
  const connectMutation = useMutation<unknown, Error, string>({
    mutationFn: async (id: string) => {
      const token = await getAccessTokenSilently();
      return createConnection(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
    },
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery<FeedPost[], Error>({
    queryKey: ['feed'],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return fetchFeed(token);
    },
    enabled: isAuthenticated,
  });

  const {
    data: suggestions = [],
    isLoading: suggestionsLoading
  } = useQuery<Suggestion[], Error>({
    queryKey: ['suggestions'],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return fetchSuggestions(token);
    },
    enabled: isAuthenticated,
  });

  // Fetch current user and their connections for the profile card
  const { data: user, isLoading: userLoading } = useQuery<UserProfile, Error>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return fetchCurrentUser(token);
    },
    enabled: isAuthenticated,
  });
  const { data: connectionsList = [], isLoading: connLoading } = useQuery<ConnectionUser[], Error>({
    queryKey: ['connections'],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return fetchConnections(token);
    },
    enabled: isAuthenticated,
  });

  if (authLoading || postsLoading || userLoading || connLoading) {
    return <div className="flex items-center justify-center h-screen">Loading feed…</div>;
  }

  return (
    <div className="min-h-screen bg-linkedin-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <ProfileCard
              className="mb-4"
              name={user?.name}
              title={user?.title}
              location={user?.location}
              avatarUrl={user?.avatarUrl}
              connectionCount={connectionsList.length}
              isCurrentUser
            />
            
            <Card className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">Connections</span>
                  <Link to="/network" className="text-xs text-blue-600 hover:underline">See all</Link>
                </div>
                <h4 className="text-base font-semibold mb-3">Grow your network</h4>
                <div className="space-y-1">
                  {suggestionsLoading ? (
                    <div>Loading suggestions…</div>
                  ) : (
                    suggestions.slice(0, 2).map(connection => (
                      <ConnectionCard
                        key={connection._id}
                        id={connection._id}
                        name={connection.name}
                        title={connection.title}
                        avatarUrl={connection.avatarUrl}
                        profileUrl={`/profile/${connection.username}`}
                        onConnect={(id) => connectMutation.mutate(id)}
                      />
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-6 space-y-4">
            <CreatePostCard />
            
            {posts.map(post => (
              <PostCard 
                key={post._id}
                id={post._id}
                author={{
                  ...post.author,
                  profileUrl: `/profile/${post.author.username}`
                }}
                content={post.content}
                imageUrl={post.imageUrl}
                timestamp={post.timestamp}
                likes={post.likes}
                comments={post.comments}
                isLiked={post.isLiked}
              />
            ))}
          </div>
          
          {/* Right sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-base font-medium mb-3">Add to your feed</h3>
              <div className="space-y-4">
                {suggestionsLoading ? (
                  <div>Loading suggestions…</div>
                ) : (
                  suggestions.slice(0, 2).map(suggestion => (
                    <ConnectionCard
                      key={suggestion._id}
                      id={suggestion._id}
                      name={suggestion.name}
                      title={suggestion.title}
                      avatarUrl={suggestion.avatarUrl}
                      profileUrl={`/profile/${suggestion.username}`}
                      onConnect={(id) => connectMutation.mutate(id)}
                    />
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-base font-medium mb-2">LinkedIn News</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm font-medium hover:text-linkedin-blue">Tech layoffs continue across industry</a>
                  <p className="text-xs text-gray-500">1d ago • 2,543 readers</p>
                </li>
                <li>
                  <a href="#" className="text-sm font-medium hover:text-linkedin-blue">Remote work trends in 2023</a>
                  <p className="text-xs text-gray-500">3d ago • 15,423 readers</p>
                </li>
                <li>
                  <a href="#" className="text-sm font-medium hover:text-linkedin-blue">AI changing the job market</a>
                  <p className="text-xs text-gray-500">2d ago • 8,741 readers</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>{children}</div>;
}
