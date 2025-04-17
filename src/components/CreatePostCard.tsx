
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Image, FileText, Calendar, User } from "lucide-react";

export default function CreatePostCard() {
  const [postText, setPostText] = useState("");
  
  const handleCreatePost = () => {
    if (!postText.trim()) return;
    
    // In a real app, you would send this to your API
    console.log("Creating post:", postText);
    
    // Reset input
    setPostText("");
  };
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex space-x-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div 
            className="bg-gray-100 hover:bg-gray-200 rounded-full flex-1 px-4 py-3 text-gray-500 cursor-pointer"
            onClick={() => document.getElementById("post-input")?.focus()}
          >
            Start a post
          </div>
        </div>
        
        <div className={`transition-all duration-300 overflow-hidden mt-3 ${postText ? 'max-h-40' : 'max-h-0'}`}>
          <textarea
            id="post-input"
            className={`w-full p-2 border-none focus:ring-0 resize-none outline-none ${!postText && 'hidden'}`}
            placeholder="What do you want to talk about?"
            rows={3}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
        </div>
        
        {postText && (
          <div className="mt-3 flex justify-end">
            <Button 
              onClick={handleCreatePost}
              className="rounded-full bg-linkedin-blue hover:bg-linkedin-lightblue"
            >
              Post
            </Button>
          </div>
        )}
        
        <Separator className="my-3" />
        
        <div className="flex justify-between items-center pt-1">
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
      </CardContent>
    </Card>
  );
}
