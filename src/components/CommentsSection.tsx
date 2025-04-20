import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchComments, addComment } from '@/lib/api';
import { useAuth0 } from '@auth0/auth0-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CommentsSectionProps {
  postId: string;
}

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  author: {
    sub: string;
    name: string;
    title?: string;
    avatarUrl?: string;
  };
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');

  const { data: comments = [], isLoading } = useQuery<Comment[], Error>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return fetchComments(token, postId);
    },
    enabled: !!postId,
  });

  const addCommentMutation = useMutation<Comment, Error, string>({
    mutationFn: async (content: string) => {
      const token = await getAccessTokenSilently();
      return addComment(token, postId, content);
    },
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  if (isLoading) {
    return <div className="p-4 text-sm text-gray-500">Loading comments…</div>;
  }

  return (
    <div className="p-4 border-t space-y-4">
      {comments.map(c => (
        <div key={c._id} className="flex items-start space-x-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={c.author.avatarUrl} />
            <AvatarFallback>
              <User className="h-4 w-4 text-gray-500" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Link to={`/profile/${encodeURIComponent(c.author.sub)}`} className="font-medium text-sm hover:underline">
              {c.author.name}
            </Link>
            <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
            <p className="text-sm text-gray-700 mt-1">{c.content}</p>
          </div>
        </div>
      ))}

      <div className="flex space-x-2">
        <Input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment…"
        />
        <Button
          onClick={() => addCommentMutation.mutate(newComment)}
          disabled={!newComment.trim() || addCommentMutation.status === 'pending'}
        >
          Post
        </Button>
      </div>
    </div>
  );
} 