import {
  Camera,
  FileImage,
  Smile,
  MapPin,
  Heart,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import avatar1 from '../avatars/avatar1.jpg';
import avatar2 from '../avatars/avatar2.jpg';
import avatar3 from '../avatars/avatar3.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfiles } from '@/redux/profileSlice';
import type { RootState, AppDispatch } from '@/redux/store';

interface Post {
  id: number;
  desc: string;
  location: string;
  postImg?: string;
  createdAt: number;
  liked: boolean;
  likes: number;
  comments: number;
  shares: number;
}

export function CreatePostCard() {
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const profileData = useSelector((state: RootState) => state.profiles.data);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append('desc', desc);
    formData.append('location', location);
    if (image) {
      formData.append('postImage', image);
    }

    try {
      const response = await fetch('http://localhost:8000/post', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const newPost = result.data;

        if (newPost) {
          setPosts([
            {
              ...newPost,
              id: Date.now(),
              createdAt: Date.now(),
              liked: false,
              likes: 100,
              comments: 25,
              shares: 10,
            },
            ...posts,
          ]);
          setDesc('');
          setLocation('');
          setImage(null);
        } else {
          console.error('Invalid post data returned');
        }
      } else {
        console.error('Post creation failed');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/post');
        if (response.ok) {
          const result = await response.json();
          const data = result.data;

          if (Array.isArray(data)) {
            const postsWithTime = data.map((post) => ({
              ...post,
              createdAt: Date.now(),
              liked: false,
              likes: 100,
              comments: 25,
              shares: 10,
            }));
            setPosts(postsWithTime);
          } else {
            console.error('Fetched data is not an array');
            setPosts([]);
          }
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => Date.now() - post.createdAt < 120000),
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLike = (id: number) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  return (
    <div className="space-y-4 text-gray-200">
      <div className="space-y-2">
        <h1 className="font-semibold text-lg text-gray-300">Feeds</h1>
        <h3 className="font-semibold text-md text-gray-300">Stories</h3>
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <Avatar className="w-14 h-14 border-2 border-dashed border-gray-500 bg-[#2a2a34] cursor-pointer hover:bg-[#383848]">
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-2xl font-bold text-gray-400">+</span>
              </div>
            </Avatar>
            <h3 className="text-center text-sm text-muted-foreground">New</h3>
          </div>
          <div className="space-y-1">
            <Avatar className="w-14 h-14 border-2 border-primary ring-2 ring-offset-2 ring-offset-[#1a1a27] ring-primary">
              <AvatarImage src={avatar1} alt="avatar1" />
            </Avatar>
            <h3 className="text-center text-sm text-muted-foreground">Vicky</h3>
          </div>
          <div className="space-y-1">
            <Avatar className="w-14 h-14 border-2 border-primary ring-2 ring-offset-2 ring-offset-[#1a1a27] ring-primary">
              <AvatarImage src={avatar2} alt="avatar2" />
            </Avatar>
            <h3 className="text-center text-sm text-muted-foreground">
              Skanda
            </h3>
          </div>
          <div className="space-y-1">
            <Avatar className="w-14 h-14 border-2 border-primary ring-2 ring-offset-2 ring-offset-[#1a1a27] ring-primary">
              <AvatarImage src={avatar3} alt="avatar3" />
            </Avatar>
            <h3 className="text-center text-sm text-muted-foreground">Megha</h3>
          </div>
        </div>
      </div>

      <Card className="bg-[#2a2a34]">
        <CardContent className="p-4">
          {profileData.map((profile, index) => (
            <div className="flex gap-4">
              <Avatar className="bg-[#3b3b47] border-2 border-gray-500">
                <AvatarImage
                  src={`http://localhost:8000/Images/${profile.profileImg}`}
                  alt="Your avatar"
                />
                <AvatarFallback>YA</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="What's on your mind?"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2 bg-[#2a2a34] text-gray-300 border border-gray-600"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 w-full text-sm  file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:text-sm file:font-semibold file:bg-[#2a2a34] file:text-primary hover:file:bg-muted/70 cursor-pointer border border-gray-600 p-2 rounded-md"
                />
              </div>
            </div>
          ))}
        </CardContent>
        <Separator />
        <CardFooter className="p-3 bg-[#2a2a34]">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-gray-300 hover:bg-[#383848]"
              >
                <FileImage className="h-4 w-4" />
                <span className="hidden sm:inline">Photo</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-gray-300 hover:bg-[#383848]"
              >
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Video</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-gray-300 hover:bg-[#383848]"
              >
                <Smile className="h-4 w-4" />
                <span className="hidden sm:inline">Feeling</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-gray-300 hover:bg-[#383848]"
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Location</span>
              </Button>
            </div>
            <Button
              size="sm"
              onClick={handleCreatePost}
              className="text-gray-200 bg-blue-600 hover:bg-blue-700"
            >
              Post
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="space-y-4 mt-4">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post, index) => (
            <Card key={index} className="bg-[#2a2a34] overflow-hidden">
              {profileData.map((profile, index) => (
                <CardHeader key={index} className="p-4">
                  <div className="flex gap-4 items-center">
                    <Avatar className="bg-[#3b3b47] border-2 border-gray-500">
                      <AvatarImage
                        src={`http://localhost:8000/Images/${profile.profileImg}`}
                        alt="Your avatar"
                      />
                      <AvatarFallback>{profile.username}</AvatarFallback>
                    </Avatar>
                    <div className="font-semibold text-gray-300">
                      {profile.username}
                    </div>
                  </div>
                </CardHeader>
              ))}
              <CardContent className="p-4 pt-0">
                <p className="mb-3 text-gray-200">{post.desc}</p>
                <p className="text-sm text-gray-500">{post.location}</p>
                {post.postImg && (
                  <div className="overflow-hidden rounded-md mt-2">
                    <img
                      src={`http://localhost:8000/Images/${post.postImg}`}
                      alt="Post image"
                      className="aspect-video object-cover w-full max-h-80"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 bg-[#2a2a34]">
                <div className="flex items-center justify-between w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1 text-gray-200 ${
                      post.liked ? 'text-red-500' : ''
                    }`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`}
                    />
                    <span>{post.likes}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-gray-200"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-gray-200"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>{post.shares}</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No posts available. Create one!
          </div>
        )}
      </div>
    </div>
  );
}
