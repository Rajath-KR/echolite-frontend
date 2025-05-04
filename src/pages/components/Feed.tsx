import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfiles } from '@/redux/profileSlice';
import type { RootState, AppDispatch } from '@/redux/store';

import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';

import avatar1 from '../avatars/avatar1.jpg';
import avatar2 from '../avatars/avatar2.jpg';
import avatar3 from '../avatars/avatar3.jpg';
import movieImg from '../posts/movies.jpg';
import travelImg from '../posts/travel.avif';
import foodImg from '../posts/food.webp';

interface Post {
  id: number;
  _id?: string;
  user?: {
    name: string;
    username: string;
    avatar: string;
  };
  userId?: string;
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
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
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

  const handleToggleComments = (postId: string | undefined) => {
    if (!postId) return;
    
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null); 
    } else {
      setActiveCommentPostId(postId); 
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!postId) return;

    try {
      const response = await fetch(`http://localhost:8000/post/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted post from state
        setPosts(posts.filter(post => post._id !== postId));
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCreatePost = async (desc: string, location: string, image: File | null) => {
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
              _id: newPost._id,
              createdAt: Date.now(),
              liked: false,
              likes: 0,
              comments: 0,
              shares: 0,
            },
            ...posts,
          ]);
          return Promise.resolve();
        }
      }
      return Promise.reject('Failed to create post');
    } catch (error) {
      console.error('Error creating post:', error);
      return Promise.reject(error);
    }
  };

  const fetchCommentCount = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/comments/post/${postId}`);
      if (response.ok) {
        const result = await response.json();
        return result.data ? result.data.length : 0;
      }
    } catch (error) {
      console.error('Error fetching comment count:', error);
      return 0;
    }
  };

  const updateCommentCount = async (postId: string) => {
    const count = await fetchCommentCount(postId);
    setPosts(posts.map(post => 
      post._id === postId ? { ...post, comments: count } : post
    ));
  };

  const handleCommentSectionClose = async (postId: string) => {
    setActiveCommentPostId(null);
    await updateCommentCount(postId);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/post');
        if (response.ok) {
          const result = await response.json();
          const data = result.data;

          if (Array.isArray(data) && data.length > 0) {
            const apiPostsPromises = data.map(async (post) => {
              // Fetch comment count for each post
              const commentCount = await fetchCommentCount(post._id);
              
              return {
                ...post,
                id: post._id || post.id || Date.now() + Math.random(),
                _id: post._id,
                createdAt: post.createdAt || Date.now(),
                liked: false,
                likes: Math.floor(Math.random() * 100) + 10,
                comments: commentCount,
                shares: Math.floor(Math.random() * 15),
              };
            });
            
            const apiPosts = await Promise.all(apiPostsPromises);
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

      <CreatePost 
        profileData={profileData} 
        onCreatePost={handleCreatePost} 
      />

      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map((post) => (
          <PostCard 
            key={post.id || post._id}
            post={post}
            profileData={profileData}
            onLike={handleLike}
            onDeletePost={handleDeletePost}
            onToggleComments={handleToggleComments}
            activeCommentPostId={activeCommentPostId}
            onCommentSectionClose={handleCommentSectionClose}
          />
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