
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileCardProps {
  name?: string;
  title?: string;
  location?: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  connectionCount?: number;
  isCurrentUser?: boolean;
  className?: string;
}

export default function ProfileCard({
  name = "John Doe",
  title = "Software Engineer",
  location = "San Francisco Bay Area",
  avatarUrl = "",
  backgroundUrl = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
  connectionCount = 432,
  isCurrentUser = true,
  className = ""
}: ProfileCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Gradient header */}
      <div 
        className="h-14 bg-gradient-to-r from-pink-500 via-purple-400 to-blue-400" 
        style={{
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Profile content */}
      <CardContent className="p-0">
        <div className="flex flex-col px-4 pt-3 pb-2">
          {/* Avatar */}
          <div className="relative -mt-8 mb-2">
            <Avatar className="h-14 w-14 border-2 border-white">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-gray-200">
                <User className="h-6 w-6 text-gray-500" />
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* User info */}
          <div className="space-y-0.5">
            <Link to={isCurrentUser ? "/profile" : `/profile/${name.toLowerCase().replace(/\s+/g, "-")}`}>
              <h3 className="text-base font-semibold leading-tight">{name}</h3>
            </Link>
            <p className="text-xs text-gray-600 leading-tight">{title}</p>
            <div className="flex items-center text-xs text-gray-500 leading-tight">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span>{location}</span>
            </div>
            {connectionCount > 0 && (
              <div className="text-xs text-blue-600 font-medium pt-1">
                {connectionCount} connections
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Footer */}
      {isCurrentUser && (
        <CardFooter className="border-t px-4 py-3 flex">
          <Link to="/profile" className="w-full">
            <Button variant="default" size="sm" className="w-full text-sm h-8 bg-blue-600 hover:bg-blue-700">
              View profile
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
