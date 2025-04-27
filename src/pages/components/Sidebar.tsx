import { useEffect, useState } from 'react';
import { Home, User, Users, Compass, Bookmark, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavLink, useLocation } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

interface ProfileDetailsType {
  _id: string;
  fullname: string;
  username: string;
  mobilenumber: string;
  bio: string;
  gender: string;
  dateofbirth: string;
  location: string;
  profileImg?: string;
}

interface StatsType {
  posts: number;
  followers: number;
  following: number;
}

export function Sidebar({ className }: SidebarProps) {
  const [profileData, setProfileData] = useState<ProfileDetailsType[]>([]);
  const [stats, setStats] = useState<StatsType>({ posts: 0, followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchProfiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/profile');

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setProfileData(result.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const postsResponse = await fetch('http://localhost:8000/post');
      if (postsResponse.ok) {
        const postsResult = await postsResponse.json();
        setStats((prev) => ({ ...prev, posts: postsResult.data.length }));
      }

      const followersResponse = await fetch('http://localhost:8000/followers');
      if (followersResponse.ok) {
        const followersResult = await followersResponse.json();
        setStats((prev) => ({ ...prev, followers: followersResult.data.length }));
      }

      const followingResponse = await fetch('http://localhost:8000/following');
      if (followingResponse.ok) {
        const followingResult = await followingResponse.json();
        setStats((prev) => ({ ...prev, following: followingResult.data.length }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchStats();
  }, []);

  const navItems = [
    { path: '/home', icon: <Home className="mr-2 h-4 w-4" />, label: 'Feed' },
    { path: '/profile', icon: <User className="mr-2 h-4 w-4" />, label: 'Profile' },
    { path: '/friends', icon: <Users className="mr-2 h-4 w-4" />, label: 'Friends' },
    { path: '/explorepage', icon: <Compass className="mr-2 h-4 w-4" />, label: 'Explore' },
    { path: '/saved', icon: <Bookmark className="mr-2 h-4 w-4" />, label: 'Saved' },
    { path: '/settings', icon: <Settings className="mr-2 h-4 w-4" />, label: 'Settings' },
  ];

  return (
    <div className={cn('p-4', className)}>
      {loading ? (
        <div className="flex justify-center py-8">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="rounded-full h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"
          ></motion.div>
        </div>
      ) : (
        <div className="space-y-6 text-gray-300">
          {profileData.length > 0 ? (
            profileData.map((profile) => (
              <div
                key={profile._id}
                className="flex justify-center items-center flex-col gap-3"
              >
                <Avatar className="h-24 w-24 bg-[#3b3b47] border-2 border-gray-600 ring ring-blue-500/30">
                  {profile.profileImg ? (
                    <AvatarImage
                      src={`http://localhost:8000/Images/${profile.profileImg}`}
                      alt={profile.fullname}
                    />
                  ) : (
                    <AvatarFallback className="bg-blue-900 text-xl">
                      {profile.fullname.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center">
                  <h1 className="font-bold text-lg text-gray-100">{profile.fullname}</h1>
                  <p className="text-gray-400 text-sm">@{profile.username}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center flex-col gap-3">
              <Avatar className="h-24 w-24 bg-[#3b3b47] border-2 border-gray-600">
                <AvatarFallback className="bg-blue-900">
                  <User size={32} />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h1 className="font-bold text-gray-300">No Profile</h1>
                <Button variant="link" className="text-blue-400 p-0" asChild>
                  <NavLink to="/profile">Create Profile</NavLink>
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center bg-card p-4 rounded-lg shadow-lg">
            <div className="text-center">
              <h3 className="font-semibold text-xl text-gray-100">{stats.posts}</h3>
              <p className="text-gray-400 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-xl text-gray-100">{stats.followers.toLocaleString()}</h3>
              <p className="text-gray-400 text-sm">Followers</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-xl text-gray-100">{stats.following.toLocaleString()}</h3>
              <p className="text-gray-400 text-sm">Following</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 py-4">
        <div className="px-3 py-2 bg-card rounded-lg shadow-md">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-gray-200 hover:bg-[#283848] relative",
                    isActive && "bg-#283848] font-medium"
                  )}
                  asChild
                >
                  <NavLink to={item.path}>
                    {item.icon}
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </NavLink>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="px-3 py-2 bg-card rounded-lg shadow-md">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-gray-100 flex items-center">
            <span>Trending Topics</span>
            <Badge className="ml-2 bg-blue-600 hover:bg-blue-700">New</Badge>
          </h2>
          <ScrollArea className="h-[220px]">
            <div className="space-y-1 p-2">
              {[
                '#Technology',
                '#Travel',
                '#Food',
                '#Fashion',
                '#Sports',
                '#Music',
                '#Art',
                '#Health',
                '#Business',
                '#Education',
              ].map((topic, index) => (
                <Button
                  key={topic}
                  variant="ghost"
                  className="w-full justify-start font-normal text-gray-200 hover:bg-[#283848]"
                >
                  {topic}
                  {index < 3 && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {index === 0 ? 'Hot' : index === 1 ? '10K' : '5K'}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="px-3 py-2 bg-card rounded-lg shadow-md">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-gray-100">
            Suggested For You
          </h2>
          <div className="space-y-2 p-2">
            {[
              { name: 'Alex Johnson', img: 'user1.jpg' },
              { name: 'Maria Garcia', img: 'user2.jpg' },
              { name: 'Sam Wilson', img: 'user3.jpg' },
              { name: 'Priya Patel', img: 'user4.jpg' },
              { name: 'David Kim', img: 'user5.jpg' },
            ].map((user) => (
              <div key={user.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-300">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-blue-600 text-white border-gray-700 hover:bg-white hover:text-black hover:border-transparent text-xs"
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>

      
      </div>
    </div>
  );
}
