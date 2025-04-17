
import { useState } from "react";
import { Bell, Briefcase, Home, MessageSquare, Search, User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-linkedin-blue fill-current">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
              </svg>
            </Link>
            <div className="ml-4 relative flex-grow max-w-xs hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                className="pl-10 py-1.5 w-full bg-gray-100 focus:bg-white"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <nav className="flex items-center space-x-1 md:space-x-4">
            <Link to="/" className="p-2 text-gray-500 hover:text-linkedin-blue flex flex-col items-center text-xs">
              <Home className="h-6 w-6" />
              <span className="hidden md:inline-block">Home</span>
            </Link>
            <Link to="/network" className="p-2 text-gray-500 hover:text-linkedin-blue flex flex-col items-center text-xs">
              <Users className="h-6 w-6" />
              <span className="hidden md:inline-block">My Network</span>
            </Link>
            <Link to="/jobs" className="p-2 text-gray-500 hover:text-linkedin-blue flex flex-col items-center text-xs">
              <Briefcase className="h-6 w-6" />
              <span className="hidden md:inline-block">Jobs</span>
            </Link>
            <Link to="/messages" className="p-2 text-gray-500 hover:text-linkedin-blue flex flex-col items-center text-xs">
              <MessageSquare className="h-6 w-6" />
              <span className="hidden md:inline-block">Messaging</span>
            </Link>
            <Link to="/notifications" className="p-2 text-gray-500 hover:text-linkedin-blue flex flex-col items-center text-xs">
              <Bell className="h-6 w-6" />
              <span className="hidden md:inline-block">Notifications</span>
            </Link>

            <div className="border-l h-8 mx-1 border-gray-200 hidden md:block"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="p-2 flex flex-col items-center hover:text-linkedin-blue">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-[10px]">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs hidden md:inline-block">Me</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">View Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button className="w-full text-left">Sign Out</button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
