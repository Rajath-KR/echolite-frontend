import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Calendar, User, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface Post {
  _id: string;
  desc: string;
  location: string;
  postImg?: string | null;
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  followers: { username: string }[];
  following: { username: string }[];
  followerCount: number;
  followingCount: number;
  profile?: ProfileDetailsType;
}

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentUserId = 'mock_user_id'; 

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8443/follow/user/${username}?currentUserId=${currentUserId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      setUserData(result.user);
      setPosts(result.posts);
      setIsFollowing(result.isFollowing);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setErrorMessage('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await fetch(`http://localhost:8443/follow/follow/${userData?._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: currentUserId })
      });
      if (response.ok) {
        setIsFollowing(true);
        setUserData(prev => prev ? {
          ...prev,
          followerCount: prev.followerCount + 1,
          followers: [...prev.followers, { username: 'current_user' }]
        } : prev);
        setSuccessMessage('Successfully followed user');
      } else {
        throw new Error('Failed to follow user');
      }
    } catch (error) {
      console.error('Error following user:', error);
      setErrorMessage('Failed to follow user');
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`http://localhost:8443/follow/unfollow/${userData?._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: currentUserId })
      });
      if (response.ok) {
        setIsFollowing(false);
        setUserData(prev => prev ? {
          ...prev,
          followerCount: prev.followerCount - 1,
          followers: prev.followers.filter(f => f.username !== 'current_user')
        } : prev);
        setSuccessMessage('Successfully unfollowed user');
      } else {
        throw new Error('Failed to unfollow user');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setErrorMessage('Failed to unfollow user');
    }
  };

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  const getImageUrl = (imagePath: string) => {
    return `http://localhost:8443/Images/${imagePath}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 text-gray-200">
      {errorMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          {errorMessage}
        </motion.div>
      )}
      
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          {successMessage}
        </motion.div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-100">{userData?.username}'s Profile</h1>
        {userData && (
          <Button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`flex items-center gap-2 ${isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="rounded-full h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"
          ></motion.div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {userData ? (
            <motion.div variants={itemVariants}>
              <Card
                className="bg-card shadow-xl text-gray-200 rounded-xl overflow-hidden border-0"
              >
                <CardHeader className="p-0 relative">
                  <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  <div className="px-8 pb-6 relative">
                    <div className="flex flex-col md:flex-row md:items-end gap-6">
                      <div className="mt-[-50px]">
                        <Avatar className="h-32 w-32 border-4 border-[#2a2a34] ring-4 ring-blue-500 bg-[#3b3b47]">
                          {userData.profile?.profileImg ? (
                            <AvatarImage 
                              src={getImageUrl(userData.profile.profileImg)} 
                              alt="Profile"
                              className="object-cover"
                            />
                          ) : (
                            <User className="h-20 w-20 text-gray-400" />
                          )}
                        </Avatar>
                      </div>
                      <div className="flex-grow pt-4 md:pt-0">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                          <div>
                            <h2 className="text-3xl font-bold text-gray-100 mb-1">
                              {userData.profile?.fullname || userData.username}
                            </h2>
                            <p className="text-gray-400 mb-2">@{userData.username}</p>
                            <p className="text-gray-300 mb-4">{userData.profile?.bio || 'No bio available'}</p>
                            <div className="flex flex-wrap gap-4">
                              {userData.profile?.location && (
                                <div className="flex items-center text-gray-400">
                                  <MapPin size={16} className="mr-1" /> {userData.profile.location}
                                </div>
                              )}
                              {userData.profile?.dateofbirth && (
                                <div className="flex items-center text-gray-400">
                                  <Calendar size={16} className="mr-1" /> 
                                  {new Date(userData.profile.dateofbirth).toLocaleDateString()}
                                </div>
                              )}
                              {userData.profile?.gender && (
                                <div className="flex items-center text-gray-400">
                                  <User size={16} className="mr-1" /> {userData.profile.gender}
                                </div>
                              )}
                              <div className="flex items-center text-gray-400">
                                <User size={16} className="mr-1" /> 
                                {userData.followerCount} Followers
                              </div>
                              <div className="flex items-center text-gray-400">
                                <User size={16} className="mr-1" /> 
                                {userData.followingCount} Following
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
                      <Instagram className="mr-2" /> Posts <span className="ml-2 text-sm bg-blue-600 px-2 py-1 rounded-full">{posts.length}</span>
                    </h3>
                    {posts.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {posts.map((item) => (
                          <motion.div 
                            key={item._id}
                            whileHover={{ scale: 1.03 }}
                            className="relative overflow-hidden rounded-lg group cursor-pointer"
                          >
                            <img
                              src={`http://localhost:8443/Images/${item.postImg}`}
                              alt=""
                              className="rounded-lg object-cover w-full h-48 group-hover:brightness-75 transition-all duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3">
                              <p className="text-white text-sm truncate">{item.desc || "No description"}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-[#283848] rounded-lg p-12 text-center">
                        <InstagramPlaceholder className="mx-auto mb-4 text-gray-500" />
                        <p className="text-gray-400">No posts available yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              variants={itemVariants}
              className="bg-card rounded-xl shadow-md p-8 text-center"
            >
              <div className="flex flex-col items-center justify-center py-12">
                <User size={64} className="text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">User Not Found</h3>
                <p className="text-gray-400 mb-6">The user profile does not exist.</p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Back to Feed
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

const InstagramPlaceholder = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    width="48" 
    height="48" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default UserProfile;
