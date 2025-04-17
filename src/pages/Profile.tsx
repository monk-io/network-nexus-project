
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Edit, ExternalLink, Link2, MapPin, MoreHorizontal, PenSquare, Plus, User } from "lucide-react";
import PostCard from "@/components/PostCard";

// Mock data
const userProfile = {
  name: "Jane Smith",
  headline: "Senior Product Designer | UX/UI | Creating user-centered digital experiences",
  location: "San Francisco Bay Area",
  avatarUrl: "https://i.pravatar.cc/150?img=5",
  coverUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  connectionCount: 732,
  about: "I'm a product designer with over 8 years of experience in creating digital products that solve real user problems. My approach combines user research, interaction design, and visual design to create intuitive and delightful experiences.",
  experience: [
    {
      id: "exp1",
      title: "Senior Product Designer",
      company: "Design Innovation Co",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      description: "Leading product design for the company's flagship product. Conducting user research, creating wireframes, prototypes, and high-fidelity designs."
    },
    {
      id: "exp2",
      title: "Product Designer",
      company: "Tech Solutions Inc",
      location: "San Francisco, CA",
      startDate: "Mar 2018",
      endDate: "Dec 2020",
      description: "Designed user interfaces for mobile and web applications. Collaborated with product managers and engineers to deliver features."
    }
  ],
  education: [
    {
      id: "edu1",
      school: "University of California, Berkeley",
      degree: "Bachelor of Arts in Design",
      field: "Human-Computer Interaction",
      startYear: "2014",
      endYear: "2018"
    }
  ],
  skills: [
    "User Experience (UX)",
    "User Interface Design",
    "Wireframing",
    "Prototyping",
    "Figma",
    "Adobe Creative Suite",
    "User Research"
  ]
};

const posts = [
  {
    id: "1",
    author: {
      name: userProfile.name,
      title: userProfile.headline.split('|')[0].trim(),
      avatarUrl: userProfile.avatarUrl,
      profileUrl: "/profile",
    },
    content: "I just published an article on my design process for our latest product. Check it out!",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    likes: 87,
    comments: 16,
  },
  {
    id: "2",
    author: {
      name: userProfile.name,
      title: userProfile.headline.split('|')[0].trim(),
      avatarUrl: userProfile.avatarUrl,
      profileUrl: "/profile",
    },
    content: "Excited to be speaking at the upcoming UX Conference next month! Who else is attending?",
    timestamp: new Date(Date.now() - 3600000 * 36).toISOString(), // 36 hours ago
    likes: 124,
    comments: 28,
  }
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-linkedin-bg">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Profile header */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
          {/* Cover photo */}
          <div 
            className="h-48 md:h-60 w-full bg-gradient-to-r from-blue-400 to-blue-600" 
            style={{
              backgroundImage: userProfile.coverUrl ? `url(${userProfile.coverUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-5 relative">
            {/* Avatar */}
            <div className="absolute -top-20 left-4">
              <Avatar className="h-36 w-36 border-4 border-white shadow-md">
                <AvatarImage src={userProfile.avatarUrl} />
                <AvatarFallback className="bg-gray-200">
                  <User className="h-16 w-16 text-gray-500" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute right-1 bottom-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white rounded-full border shadow-sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Profile info */}
            <div className="mt-16 md:flex md:justify-between md:items-center">
              <div>
                <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                <p className="text-gray-700 mt-1">{userProfile.headline}</p>
                <div className="flex items-center text-gray-500 mt-2 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{userProfile.location}</span>
                  <span className="mx-2">•</span>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <a href="#" className="text-linkedin-blue hover:underline">Contact info</a>
                </div>
                <div className="text-sm text-linkedin-blue font-medium mt-2">
                  {userProfile.connectionCount} connections
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-2">
                <Button className="bg-linkedin-blue hover:bg-linkedin-lightblue">Add section</Button>
                <Button variant="outline" className="border-gray-300">More</Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs and content */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <Tabs defaultValue="posts" className="w-full">
              <div className="bg-white rounded-lg shadow mb-4">
                <TabsList className="w-full justify-start border-b p-0">
                  <TabsTrigger value="posts" className="rounded-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-black">Posts</TabsTrigger>
                  <TabsTrigger value="activity" className="rounded-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-black">Activity</TabsTrigger>
                  <TabsTrigger value="about" className="rounded-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-black">About</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="posts" className="space-y-4 mt-0">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <h3 className="font-medium">Activity</h3>
                      <span className="ml-2 text-sm text-gray-500">{posts.length} posts</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-linkedin-blue">Posts</Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">Comments</Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">Images</Button>
                    </div>
                  </CardContent>
                </Card>
                
                {posts.map(post => (
                  <PostCard key={post.id} {...post} />
                ))}
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-4 mt-0">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium">No recent activity</h3>
                    <p className="text-sm text-gray-500 mt-2">Posts you share, comment on, or react to will be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="about" className="mt-0">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">About</h3>
                      <Button variant="ghost" size="icon">
                        <PenSquare className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm mt-2 whitespace-pre-line">{userProfile.about}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* Experience section */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Experience</h3>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PenSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {userProfile.experience.map(exp => (
                    <div key={exp.id} className="flex">
                      <div className="mr-3 mt-1">
                        <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded">
                          <Briefcase className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">{exp.title}</h4>
                        <p className="text-sm">{exp.company}</p>
                        <p className="text-sm text-gray-500">
                          {exp.startDate} - {exp.endDate}
                        </p>
                        <p className="text-sm text-gray-500">{exp.location}</p>
                        {exp.description && (
                          <p className="text-sm mt-2">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Education section */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Education</h3>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PenSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {userProfile.education.map(edu => (
                    <div key={edu.id} className="flex">
                      <div className="mr-3 mt-1">
                        <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">{edu.school}</h4>
                        <p className="text-sm">{edu.degree}, {edu.field}</p>
                        <p className="text-sm text-gray-500">
                          {edu.startYear} - {edu.endYear}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Skills section */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Skills</h3>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PenSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {userProfile.skills.map((skill, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{skill}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Endorse
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
