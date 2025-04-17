
import CreatePostCard from "@/components/CreatePostCard";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import ProfileCard from "@/components/ProfileCard";
import ConnectionCard from "@/components/ConnectionCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

// Mock data
const posts = [
  {
    id: "1",
    author: {
      name: "Sarah Johnson",
      title: "Product Designer at Design Co.",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      profileUrl: "/profile/sarah-johnson",
    },
    content: "Just launched our new product design system! It's been months in the making, but I'm so proud of what our team has accomplished. \n\nCheck it out and let me know what you think!",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    likes: 48,
    comments: 12,
  },
  {
    id: "2",
    author: {
      name: "Michael Chen",
      title: "Software Engineer at TechCorp",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      profileUrl: "/profile/michael-chen",
    },
    content: "Excited to share that I've just published my first open-source library for React! It's a collection of hooks that I've found useful in my own projects.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), // 8 hours ago
    likes: 132,
    comments: 24,
  },
  {
    id: "3",
    author: {
      name: "Priya Sharma",
      title: "Marketing Director at GrowthHackers",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      profileUrl: "/profile/priya-sharma",
    },
    content: "Looking for recommendations on the best marketing automation tools for a growing startup. What has worked well for your team?",
    timestamp: new Date(Date.now() - 3600000 * 22).toISOString(), // 22 hours ago
    likes: 15,
    comments: 36,
    isLiked: true,
  }
];

const connectionSuggestions = [
  {
    id: "101",
    name: "Emily Wilson",
    title: "UX Researcher at UserFirst",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    mutualConnections: 7,
    profileUrl: "/profile/emily-wilson",
  },
  {
    id: "102",
    name: "David Rodriguez",
    title: "Frontend Developer at WebTech",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    mutualConnections: 3,
    profileUrl: "/profile/david-rodriguez",
  },
  {
    id: "103",
    name: "Alex Thompson",
    title: "Product Manager at InnovateCo",
    avatarUrl: "https://i.pravatar.cc/150?img=7",
    mutualConnections: 12,
    profileUrl: "/profile/alex-thompson",
  }
];

export default function Feed() {
  return (
    <div className="min-h-screen bg-linkedin-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <ProfileCard />
            
            <Card className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <div className="text-xs text-gray-500 flex justify-between items-center">
                  <span>Connections</span>
                  <a href="/my-network" className="text-linkedin-blue hover:underline">See all</a>
                </div>
                <div className="font-medium mt-1">Grow your network</div>
                <div className="mt-4 space-y-2">
                  {connectionSuggestions.slice(0, 2).map(connection => (
                    <div key={connection.id} className="flex items-center space-x-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={connection.avatarUrl} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-tight">{connection.name}</p>
                        <p className="text-xs text-gray-500 truncate">{connection.title}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs border-gray-300"
                      >
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-6 space-y-4">
            <CreatePostCard />
            
            {posts.map(post => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
          
          {/* Right sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-base font-medium mb-3">Add to your feed</h3>
              <div className="space-y-4">
                {connectionSuggestions.map(connection => (
                  <div key={connection.id} className="flex items-start space-x-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={connection.avatarUrl} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{connection.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{connection.title}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs border-gray-300"
                      >
                        + Follow
                      </Button>
                    </div>
                  </div>
                ))}
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
