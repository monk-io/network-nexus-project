
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

interface ConnectionCardProps {
  id: string;
  name: string;
  title?: string;
  avatarUrl?: string;
  mutualConnections?: number;
  profileUrl: string;
  onConnect?: (id: string) => void;
  isConnected?: boolean;
}

export default function ConnectionCard({
  id,
  name,
  title,
  avatarUrl,
  mutualConnections = 0,
  profileUrl,
  onConnect,
  isConnected = false,
}: ConnectionCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-200" />
      <CardContent className="pt-0 pb-3 text-center">
        <div className="-mt-6 mb-1 flex justify-center">
          <Avatar className="h-12 w-12 ring-4 ring-white">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-gray-200">
              <User className="h-6 w-6 text-gray-500" />
            </AvatarFallback>
          </Avatar>
        </div>
        
        <Link to={profileUrl}>
          <h3 className="text-sm font-medium hover:underline cursor-pointer">{name}</h3>
        </Link>
        
        {title && <p className="text-xs text-gray-600 mt-0.5">{title}</p>}
        
        {mutualConnections > 0 && (
          <p className="text-xs text-gray-500 mt-0.5">
            {mutualConnections} mutual connection{mutualConnections !== 1 ? 's' : ''}
          </p>
        )}
        
        <div className="mt-2">
          {isConnected ? (
            <Button 
              variant="outline"
              size="sm"
              className="w-full text-xs h-7 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            >
              Message
            </Button>
          ) : (
            <Button 
              variant="outline"
              size="sm"
              className="w-full text-xs h-7 border-linkedin-blue text-linkedin-blue hover:bg-blue-50 hover:border-blue-700"
              onClick={() => onConnect?.(id)}
            >
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

