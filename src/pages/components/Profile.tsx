import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Pencil, Plus, Trash, MapPin, Calendar, User, Instagram } from 'lucide-react';
import ProfileForm from './ProfileForm';
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
  id: number;
  desc: string;
  location: string;
  postImg?: string | null;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileDetailsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentProfileId, setCurrentProfileId] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageVersion, setImageVersion] = useState<number>(0);
  const [postLists, setPostLists] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState<boolean>(false);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/profile');

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setProfileData(result.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setErrorMessage('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/post');
        if (response.ok) {
          const result = await response.json();
          const data = result.data;
          setPostLists(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handleDeleteProfile = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/profile/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      fetchProfiles();
      setIsDeleteDialogOpen(false);
      setSuccessMessage('Profile deleted successfully');
    } catch (error) {
      console.error('Error deleting profile:', error);
      setErrorMessage('Failed to delete profile');
    }
  };

  const openDeleteDialog = (id: string) => {
    setProfileToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (profileToDelete) {
      handleDeleteProfile(profileToDelete);
    }
  };

  const editProfile = (profile: ProfileDetailsType) => {
    setIsEditing(true);
    setCurrentProfileId(profile._id);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setIsEditing(false);
    setIsFormOpen(true);
    setCurrentProfileId('');
  };

  const handleFormSubmissionResult = (success: boolean, message: string) => {
    if (success) {
      setSuccessMessage(message);
      setIsFormOpen(false);
      fetchProfiles();
      setImageVersion((prev) => prev + 1);
    } else {
      setErrorMessage(message);
    }
  };

  const getImageUrl = (imagePath: string) => {
    return `http://localhost:8000/Images/${imagePath}?v=${imageVersion}`;
  };

  const openPostDialog = (post: Post) => {
    setSelectedPost(post);
    setIsPostDialogOpen(true);
  };

  // Animation variants
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
        <h1 className="text-2xl font-bold text-gray-100">My Profile</h1>

        {profileData.length === 0 ? (
          <Button
            onClick={openCreateForm}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus size={16} /> Create Profile
          </Button>
        ) : (
          <Button
            onClick={() => editProfile(profileData[0])}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Pencil size={16} /> Edit Profile
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
          {profileData.length > 0 ? (
            <motion.div variants={itemVariants}>
              {profileData.map((profile) => (
                <Card
                  key={profile._id}
                  className="bg-card shadow-xl text-gray-200 rounded-xl overflow-hidden border-0"
                >
                  <CardHeader className="p-0 relative">
                    <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    
                    <div className="px-8 pb-6 relative">
                      <div className="flex flex-col md:flex-row md:items-end gap-6">
                        <div className="mt-[-50px]">
                          <Avatar className="h-32 w-32 border-4 border-[#2a2a34] ring-4 ring-blue-500 bg-[#3b3b47]">
                            {profile.profileImg ? (
                              <AvatarImage 
                                src={getImageUrl(profile.profileImg)} 
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
                                {profile.fullname}
                              </h2>
                              <p className="text-gray-400 mb-2">@{profile.username}</p>
                              <p className="text-gray-300 mb-4">{profile.bio}</p>
                              
                              <div className="flex flex-wrap gap-4">
                                {profile.location && (
                                  <div className="flex items-center text-gray-400">
                                    <MapPin size={16} className="mr-1" /> {profile.location}
                                  </div>
                                )}
                                {profile.dateofbirth && (
                                  <div className="flex items-center text-gray-400">
                                    <Calendar size={16} className="mr-1" /> 
                                    {new Date(profile.dateofbirth).toLocaleDateString()}
                                  </div>
                                )}
                                {profile.gender && (
                                  <div className="flex items-center text-gray-400">
                                    <User size={16} className="mr-1" /> {profile.gender}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <Button
                              variant="destructive"
                              size="icon"
                              className="mt-4 md:mt-0"
                              onClick={() => openDeleteDialog(profile._id)}
                            >
                              <Trash size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 pt-0">
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
                        <Instagram className="mr-2" /> Posts <span className="ml-2 text-sm bg-blue-600 px-2 py-1 rounded-full">{postLists.length}</span>
                      </h3>
                      
                      {postLists.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {postLists.map(
                            (item, index) =>
                              item.postImg && (
                                <motion.div 
                                  key={index}
                                  whileHover={{ scale: 1.03 }}
                                  className="relative overflow-hidden rounded-lg group cursor-pointer"
                                  onClick={() => openPostDialog(item)}
                                >
                                  <img
                                    src={`http://localhost:8000/Images/${item.postImg}`}
                                    alt=""
                                    className="rounded-lg object-cover w-full h-48 group-hover:brightness-75 transition-all duration-300"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3">
                                    <p className="text-white text-sm truncate">{item.desc || "No description"}</p>
                                  </div>
                                </motion.div>
                              ),
                          )}
                        </div>
                      ) : (
                        <div className="bg-[#283848] rounded-lg p-12 text-center">
                          <InstagramPlaceholder className="mx-auto mb-4 text-gray-500" />
                          <p className="text-gray-400">No posts available yet.</p>
                          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Create Your First Post</Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              variants={itemVariants}
              className="bg-card rounded-xl shadow-md p-8 text-center"
            >
              <div className="flex flex-col items-center justify-center py-12">
                <User size={64} className="text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Profile Created</h3>
                <p className="text-gray-400 mb-6">Create your profile to get started</p>
                <Button 
                  onClick={openCreateForm}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus size={16} className="mr-2" /> Create Profile
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-100 text-xl">
              {isEditing ? 'Edit Profile' : 'Create Profile'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {isEditing
                ? 'Update your profile information below'
                : 'Fill in your profile details below'}
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            isEditing={isEditing}
            profileId={currentProfileId}
            initialData={profileData.find((p) => p._id === currentProfileId)}
            onCancel={() => setIsFormOpen(false)}
            onSubmissionResult={handleFormSubmissionResult}
            imageVersion={imageVersion}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-card border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-100">
              Delete Profile
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              This action cannot be undone. All profile data will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:text-gray-100 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-card border-gray-700 p-0 overflow-hidden">
          {selectedPost && (
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 h-96 bg-black flex items-center justify-center">
                {selectedPost.postImg && (
                  <img
                    src={`http://localhost:8000/Images/${selectedPost.postImg}`}
                    alt="Post"
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
              <div className="md:w-1/3 p-4">
                <h3 className="font-semibold text-gray-100 mb-2">Description</h3>
                <p className="text-gray-300 mb-4">{selectedPost.desc || "No description"}</p>
                
                {selectedPost.location && (
                  <div className="flex items-center text-gray-400 mb-4">
                    <MapPin size={16} className="mr-2" /> {selectedPost.location}
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Like</Button>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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

export default Profile;