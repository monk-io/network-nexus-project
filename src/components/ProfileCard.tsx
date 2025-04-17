
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
  className?: string; // Added className prop
}

export default function ProfileCard({
  name = "John Doe",
  title = "Software Engineer",
  location = "San Francisco Bay Area",
  avatarUrl = "",
  backgroundUrl = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
  connectionCount = 432,
  isCurrentUser = true,
  className = "" // Default to empty string
}: ProfileCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div 
        className="h-24 bg-gradient-to-r from-blue-400 to-blue-600" 
        style={{
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <CardContent className="pt-0 relative">
        <div className="absolute -top-8 left-4 ring-4 ring-white rounded-full">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-gray-200">
              <User className="h-8 w-8 text-gray-500" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-10 mb-4">
          <Link to={isCurrentUser ? "/profile" : `/profile/${name.toLowerCase().replace(/\s+/g, "-")}`}>
            <h3 className="text-lg font-semibold hover:underline cursor-pointer">{name}</h3>
          </Link>
          <p className="text-sm text-gray-600">{title}</p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{location}</span>
          </div>
          {connectionCount > 0 && (
            <div className="mt-2 text-xs text-blue-600 font-medium">
              {connectionCount} connections
            </div>
          )}
        </div>
      </CardContent>
      {isCurrentUser && (
        <CardFooter className="border-t px-4 py-3 bg-gray-50">
          <Link to="/profile" className="w-full">
            <Button variant="secondary" size="sm" className="w-full text-xs h-8">
              View profile
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
