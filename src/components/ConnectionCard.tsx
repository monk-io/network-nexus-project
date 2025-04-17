
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
    <div className="flex items-center gap-3 py-2">
      {/* Avatar */}
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="bg-gray-200">
          <User className="h-6 w-6 text-gray-500" />
        </AvatarFallback>
      </Avatar>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link to={profileUrl}>
          <h3 className="text-sm font-medium hover:underline leading-tight">{name}</h3>
        </Link>
        
        {title && <p className="text-xs text-gray-600 leading-tight truncate mt-0.5">{title}</p>}
        
        {mutualConnections > 0 && (
          <p className="text-xs text-gray-500 leading-tight mt-0.5">
            {mutualConnections} mutual connection{mutualConnections !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      
      {/* Button */}
      <div className="flex-shrink-0">
        {isConnected ? (
          <Button 
            variant="outline"
            size="sm"
            className="text-xs h-7 border-gray-300 hover:border-gray-400 hover:bg-gray-50 whitespace-nowrap"
          >
            Message
          </Button>
        ) : (
          <Button 
            variant="outline"
            size="sm"
            className="text-xs h-7 border-gray-300 hover:border-gray-400 hover:bg-gray-50 whitespace-nowrap"
            onClick={() => onConnect?.(id)}
          >
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}
