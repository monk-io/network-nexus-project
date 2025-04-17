
import Header from "@/components/Header";
import ConnectionCard from "@/components/ConnectionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid2X2, Grid3X3, UserPlus, Users, UsersRound } from "lucide-react";
import { useState } from "react";

// Mock data
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
  },
  {
    id: "104",
    name: "Maria Garcia",
    title: "Data Scientist at DataCorp",
    avatarUrl: "https://i.pravatar.cc/150?img=10",
    mutualConnections: 5,
    profileUrl: "/profile/maria-garcia",
  },
  {
    id: "105",
    name: "James Wilson",
    title: "UI Designer at DesignHub",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    mutualConnections: 9,
    profileUrl: "/profile/james-wilson",
  },
  {
    id: "106",
    name: "Sarah Brown",
    title: "Marketing Manager at GrowthInc",
    avatarUrl: "https://i.pravatar.cc/150?img=14",
    mutualConnections: 2,
    profileUrl: "/profile/sarah-brown",
  },
  {
    id: "107",
    name: "Robert Johnson",
    title: "Software Architect at TechBuilders",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    mutualConnections: 8,
    profileUrl: "/profile/robert-johnson",
  },
  {
    id: "108",
    name: "Jennifer Lee",
    title: "Content Strategist at ContentWorks",
    avatarUrl: "https://i.pravatar.cc/150?img=16",
    mutualConnections: 4,
    profileUrl: "/profile/jennifer-lee",
  }
];

const existingConnections = [
  {
    id: "201",
    name: "Thomas Wright",
    title: "Full Stack Developer at WebSolutions",
    avatarUrl: "https://i.pravatar.cc/150?img=17",
    profileUrl: "/profile/thomas-wright",
    isConnected: true
  },
  {
    id: "202",
    name: "Olivia Parker",
    title: "Product Designer at CreativeCo",
    avatarUrl: "https://i.pravatar.cc/150?img=18",
    profileUrl: "/profile/olivia-parker",
    isConnected: true
  },
  {
    id: "203",
    name: "Michael Scott",
    title: "Regional Manager at Dunder Mifflin",
    avatarUrl: "https://i.pravatar.cc/150?img=19",
    profileUrl: "/profile/michael-scott",
    isConnected: true
  },
  {
    id: "204",
    name: "Pam Beesly",
    title: "Office Administrator at Dunder Mifflin",
    avatarUrl: "https://i.pravatar.cc/150?img=20",
    profileUrl: "/profile/pam-beesly",
    isConnected: true
  }
];

export default function Network() {
  const [gridView, setGridView] = useState<'grid' | 'list'>('grid');
  const [connectedUsers, setConnectedUsers] = useState<string[]>(existingConnections.map(c => c.id));

  const handleConnect = (id: string) => {
    setConnectedUsers(prev => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-linkedin-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Left sidebar */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="border-b p-4">
                  <h2 className="font-medium">Manage my network</h2>
                </div>
                <ul className="py-2">
                  <li>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-linkedin-blue">
                      <UsersRound className="h-5 w-5 mr-3" />
                      Connections
                      <span className="ml-auto text-gray-500">{connectedUsers.length}</span>
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-linkedin-blue">
                      <UserPlus className="h-5 w-5 mr-3" />
                      People I Follow
                      <span className="ml-auto text-gray-500">0</span>
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-linkedin-blue">
                      <Users className="h-5 w-5 mr-3" />
                      Groups
                      <span className="ml-auto text-gray-500">0</span>
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-linkedin-blue">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      Pages
                      <span className="ml-auto text-gray-500">0</span>
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Add personal contacts</h3>
                <p className="text-xs text-gray-500 mb-3">
                  We'll periodically import and store your contacts to help you and others connect. You choose who to connect to and who to invite.
                </p>
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full p-2 border border-gray-300 rounded-md mb-2"
                />
                <Button className="w-full bg-linkedin-blue hover:bg-linkedin-lightblue">
                  Continue
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <Tabs defaultValue="connections" className="w-full">
              <Card className="mb-4">
                <CardHeader className="p-0">
                  <div className="flex items-center justify-between p-4">
                    <TabsList className="bg-transparent p-0">
                      <TabsTrigger 
                        value="connections" 
                        className="text-base font-medium px-2 py-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-linkedin-blue"
                      >
                        My Connections
                      </TabsTrigger>
                      <TabsTrigger 
                        value="suggestions" 
                        className="text-base font-medium px-2 py-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-linkedin-blue"
                      >
                        People You May Know
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${gridView === 'grid' ? 'text-linkedin-blue' : 'text-gray-500'}`}
                        onClick={() => setGridView('grid')}
                      >
                        <Grid3X3 className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${gridView === 'list' ? 'text-linkedin-blue' : 'text-gray-500'}`}
                        onClick={() => setGridView('list')}
                      >
                        <Grid2X2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              <TabsContent value="connections" className="mt-0">
                <div className={gridView === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
                  {existingConnections.map(connection => (
                    <ConnectionCard key={connection.id} {...connection} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="suggestions" className="mt-0">
                <div className={gridView === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
                  {connectionSuggestions.map(suggestion => (
                    <ConnectionCard 
                      key={suggestion.id} 
                      {...suggestion}
                      onConnect={handleConnect}
                      isConnected={connectedUsers.includes(suggestion.id)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
