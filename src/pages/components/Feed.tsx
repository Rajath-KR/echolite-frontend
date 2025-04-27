import { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Send,
  Camera,
  FileImage,
  Smile,
  MapPin,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfiles } from '@/redux/profileSlice';
import type { RootState, AppDispatch } from '@/redux/store';

import avatar1 from '../avatars/avatar1.jpg';
import avatar2 from '../avatars/avatar2.jpg';
import avatar3 from '../avatars/avatar3.jpg';
import movieImg from '../posts/movies.jpg';
import travelImg from '../posts/travel.avif';
import foodImg from '../posts/food.webp';

interface Post {
  id: number;
  user?: {
    name: string;
    username: string;
    avatar: string;
  };
  content?: string;
  desc?: string;
  location?: string;
  image?: string;
  postImg?: string;
  likes: number;
  comments: number;
  shares: number;
  timeAgo?: string;
  createdAt?: number;
  liked: boolean;
}

const initialPosts: Post[] = [
  {
    id: 1,
    user: {
      name: 'Vicky',
      username: 'vickyfilm',
      avatar: avatar1,
    },
    content: `Just watched the new sci-fi blockbuster and I'm blown away! Who else has seen it? Let's discuss!`,
    image: movieImg,
    likes: 78,
    comments: 12,
    shares: 5,
    timeAgo: '1h',
    liked: false,
  },
  {
    id: 2,
    user: {
      name: 'Skanda',
      username: 'skanda_travels',
      avatar: avatar2,
    },
    content: 'Exploring the serene beauty of Bali! #Wanderlust',
    image: travelImg,
    likes: 134,
    comments: 25,
    shares: 18,
    timeAgo: '3h',
    liked: true,
  },
  {
    id: 3,
    user: {
      name: 'Megha',
      username: 'foodiej',
      avatar: avatar3,
    },
    content:
      'Tried this new ramen place downtown… absolutely delicious! Highly recommend it!',
    image: foodImg,
    likes: 95,
    comments: 16,
    shares: 9,
    timeAgo: '5h',
    liked: false,
  },
];

export function Feed() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const profileData = useSelector((state: RootState) => state.profiles.data);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCreatePost = async () => {
    if (!desc.trim() && !image) {
      return;
    }
    
    setIsLoading(true);
    
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
              likes: 0,
              comments: 0,
              shares: 0,
            },
            ...posts,
          ]);
          setDesc('');
          setLocation('');
          setImage(null);
        }
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/post');
        if (response.ok) {
          const result = await response.json();
          const data = result.data;

          if (Array.isArray(data) && data.length > 0) {
            const apiPosts = data.map((post) => ({
              ...post,
              id: post._id || post.id || Date.now() + Math.random(),
              createdAt: Date.now(),
              liked: false,
              likes: Math.floor(Math.random() * 100) + 10,
              comments: Math.floor(Math.random() * 30) + 5,
              shares: Math.floor(Math.random() * 15),
            }));
            
            setPosts([...apiPosts, ...initialPosts]);
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  return (
    <div className="space-y-4 fade-in">
      <div className="space-y-2">
        <h1 className="font-semibold text-lg text-card-foreground">Your Feed</h1>
        <h3 className="font-semibold text-md text-card-foreground">Stories</h3>
        <div className="flex items-center gap-4 py-2 overflow-x-auto no-scrollbar">
          <div className="space-y-1 flex-shrink-0">
            <Avatar className="w-16 h-16 border-2 border-dashed border-primary/50 bg-card cursor-pointer hover:bg-muted/70 transition duration-300">
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-2xl font-bold text-primary">+</span>
              </div>
            </Avatar>
            <h3 className="text-center text-xs text-muted-foreground">Add Story</h3>
          </div>
          <div className="space-y-1 flex-shrink-0">
            <Avatar className="w-16 h-16 border-2 border-primary ring-2 ring-offset-2 ring-offset-background ring-primary">
              <AvatarImage src={avatar1} alt="Vicky" />
              <AvatarFallback className="bg-blue-600/20">V</AvatarFallback>
            </Avatar>
            <h3 className="text-center text-xs text-muted-foreground">Vicky</h3>
          </div>
          <div className="space-y-1 flex-shrink-0">
            <Avatar className="w-16 h-16 border-2 border-primary ring-2 ring-offset-2 ring-offset-background ring-primary">
              <AvatarImage src={avatar2} alt="Skanda" />
              <AvatarFallback className="bg-blue-600/20">S</AvatarFallback>
            </Avatar>
            <h3 className="text-center text-xs text-muted-foreground">Skanda</h3>
          </div>
          <div className="space-y-1 flex-shrink-0">
            <Avatar className="w-16 h-16 border-2 border-primary ring-2 ring-offset-2 ring-offset-background ring-primary">
              <AvatarImage src={avatar3} alt="Megha" />
              <AvatarFallback className="bg-blue-600/20">M</AvatarFallback>
            </Avatar>
            <h3 className="text-center text-xs text-muted-foreground">Megha</h3>
          </div>
        </div>
      </div>

     <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card slide-up">
  <CardContent className="p-4">
    {profileData.length > 0 && profileData.map((profile, index) => (
      <div key={index} className="flex gap-4">
        <Avatar className="ring-2 ring-primary/20">
          <AvatarImage
            src={`http://localhost:8000/Images/${profile.profileImg}`}
            alt="Your avatar"
          />
          <AvatarFallback className="bg-blue-600/20 text-primary-foreground">
            {profile.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="What's on your mind?"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="resize-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-0 p-2 bg-card text-card-foreground border border-border"
          />
          
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full h-12 text-sm file:mr-4 file:py-0 file:px-4 file:rounded-md file:border file:text-sm file:font-semibold file:bg-blue-600/10 file:text-primary hover:file:bg-blue-600/20 cursor-pointer bg-card border border-border p-2 rounded-md mt-2"
          />
          
          {image && (
            <div className="mt-2 text-sm text-muted-foreground flex items-center">
              <FileImage className="h-4 w-4 mr-1" /> {image.name}
            </div>
          )}
        </div>
      </div>
    ))}
  </CardContent>

  <Separator className="mb-4" />

  <CardFooter className="p-3 bg-card relative z-10">
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-card-foreground hover:bg-muted"
        >
          <FileImage className="h-4 w-4" />
          <span className="hidden sm:inline">Photo</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-card-foreground hover:bg-muted"
        >
          <Camera className="h-4 w-4" />
          <span className="hidden sm:inline">Video</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-card-foreground hover:bg-muted"
        >
          <Smile className="h-4 w-4" />
          <span className="hidden sm:inline">Feeling</span>
        </Button>
      </div>

      {/* Ensuring the main Post button is visible and not covered */}
      <Button
        size="sm"
        onClick={handleCreatePost}
        disabled={isLoading || (!desc.trim() && !image)}
        className="bg-blue-600 hover:bg-blue-700 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg min-w-[120px] focus:outline-none focus:ring-2 focus:ring-primary/70 focus:ring-offset-0"
      >
        {isLoading ? 'Posting...' : 'Post'}
      </Button>
    </div>
  </CardFooter>
</Card>



      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map((post) => (
          <Card
            key={post.id}
            className="overflow-hidden max-h-[160vh] bg-card shadow-md hover:shadow-lg transition-shadow duration-300 slide-up"
          >
            <CardHeader className="flex flex-row items-center gap-4 p-4 bg-card">
              <Avatar className="ring-2 ring-primary/20">
                {post.user?.avatar ? (
                  <AvatarImage src={post.user.avatar} alt={post.user?.name || 'User'} />
                ) : (
                  <AvatarFallback className="bg-blue-600 text-primary-foreground">
                    {post.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold text-card-foreground">
                  {profileData.length > 0 && !post.user?.name 
                    ? profileData[0].username 
                    : post.user?.name || 'User'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {post.timeAgo ? `· ${post.timeAgo}` : '· just now'}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <MoreHorizontal className="h-4 w-4 text-card-foreground" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-card text-card-foreground border border-border"
                >
                  <DropdownMenuItem className="hover:bg-muted">
                    Save post
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-muted">
                    Hide post
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-muted">
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <p className="mb-3 text-card-foreground">{post.content || post.desc || ''}</p>
              {post.location && (
                <div className="flex items-center text-muted-foreground text-sm mb-3">
                  <MapPin className="h-3 w-3 mr-1" /> {post.location}
                </div>
              )}
              {(post.image || post.postImg) && (
                <div className="overflow-hidden rounded-md shadow-md">
                  <img
                    src={post.image || `http://localhost:8000/Images/${post.postImg}`}
                    alt="Post image"
                    className="aspect-video object-cover w-full max-h-80 hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
            </CardContent>

            <CardFooter className="p-4 pt-0 bg-card">
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1 text-card-foreground hover:bg-muted ${
                    post.liked ? 'text-destructive' : ''
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
                  className="gap-1 text-card-foreground hover:bg-muted"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-card-foreground hover:bg-muted"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{post.shares}</span>
                </Button>
              </div>
            </CardFooter>

            <Separator className="bg-border" />

            <div className="p-4">
              {profileData.length > 0 && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 ring-1 ring-primary/30">
                    <AvatarImage
                      src={`http://localhost:8000/Images/${profileData[0].profileImg}`}
                      alt="Your avatar"
                    />
                    <AvatarFallback className="bg-blue-600/20 text-primary-foreground">
                      {profileData[0].username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      placeholder="Write a comment..."
                      className="h-9 bg-muted text-card-foreground border border-border focus:ring-2 focus:ring-primary/50 rounded-full"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-card-foreground hover:bg-muted rounded-full"
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send comment</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))
      ) : (
        <Card className="bg-card p-8 text-center shadow-md">
          <div className="flex flex-col items-center justify-center py-6">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground mb-2">No Posts Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first post or follow friends to see their updates</p>
          </div>
        </Card>
      )}
    </div>
  );
}