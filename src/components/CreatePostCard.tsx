import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Image, FileText, Calendar, User } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, fetchCurrentUser } from "@/lib/api";
import { useAuth0 } from "@auth0/auth0-react";
import React, { KeyboardEvent } from "react";

// Define UserProfile type based on fetchCurrentUser response
interface UserProfile {
  _id: string;
  name: string;
  avatarUrl?: string;
  // Add other fields if needed, matching the actual API response
}

export default function CreatePostCard() {
  const [postText, setPostText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Fetch current user data for avatar
  const { data: user, isLoading: userLoading } = useQuery<UserProfile, Error>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return fetchCurrentUser(token);
    },
    enabled: isAuthenticated,
  });

  const createPostMutation = useMutation<unknown, Error, string>({
    mutationFn: async (content: string) => {
      const token = await getAccessTokenSilently();
      return createPost(token, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      setPostText("");
      setIsExpanded(false);
    },
  });

  const handleCreatePost = () => {
    if (!postText.trim()) return;
    createPostMutation.mutate(postText);
  };

  const handleStartPostClick = () => {
    setIsExpanded(true);
    setTimeout(() => document.getElementById("post-input")?.focus(), 100);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') {
      setPostText('');
      setIsExpanded(false);
    } else if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (postText.trim()) {
        handleCreatePost();
      }
    }
  };

  return (
    <Card className="mb-4" id="create-post-card">
      <CardContent className="pt-4 pb-2">
        <div className="flex space-x-3 items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback>
              {userLoading ? '...' : <User className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
          {!isExpanded ? (
            <div
              className="bg-gray-100 hover:bg-gray-200 rounded-full flex-1 px-4 py-3 text-gray-500 cursor-pointer"
              onClick={handleStartPostClick}
            >
              Start a post
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <textarea
                id="post-input"
                className="w-full p-2 border rounded-md focus:ring-1 focus:ring-linkedin-blue resize-y outline-none mb-2"
                placeholder="What do you want to talk about?"
                rows={3}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleCreatePost}
                  disabled={!postText.trim() || createPostMutation.status === 'pending'}
                  className="bg-linkedin-blue hover:bg-linkedin-lightblue px-4 py-1.5 text-sm"
                >
                  {createPostMutation.status === 'pending' ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {!isExpanded && (
          <>
            <Separator className="my-3" />
            <div className="flex justify-around items-center pt-1">
              <Button variant="ghost" size="sm" className="text-xs flex items-center text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <Image className="h-5 w-5 mr-2 text-blue-600" />
                Photo
              </Button>
              <Button variant="ghost" size="sm" className="text-xs flex items-center text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <Calendar className="h-5 w-5 mr-2 text-amber-600" />
                Event
              </Button>
              <Button variant="ghost" size="sm" className="text-xs flex items-center text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <FileText className="h-5 w-5 mr-2 text-orange-600" />
                Article
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
