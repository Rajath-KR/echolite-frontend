import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Send,
  MapPin,
  Trash2,
  Bookmark, 
  Eye, 
  Flag
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CommentSection from './comments';

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

interface PostCardProps {
  post: Post;
  profileData: any[];
  onLike: (id: number) => void;
  onDeletePost: (postId: string) => void;
  onToggleComments: (postId: string | undefined) => void;
  activeCommentPostId: string | null;
  onCommentSectionClose: (postId: string) => void;
}

export function PostCard({
  post,
  profileData,
  onLike,
  onDeletePost,
  onToggleComments,
  activeCommentPostId,
  onCommentSectionClose
}: PostCardProps) {
  return (
    <div key={post.id || post._id} className="space-y-4">
      <Card className="overflow-hidden max-h-[160vh] bg-card shadow-md hover:shadow-lg transition-shadow duration-300 slide-up">
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
              className="bg-card text-card-foreground border border-border rounded-lg shadow-lg p-2"
            >
              {post._id && (
                <DropdownMenuItem 
                  className="hover:bg-muted text-destructive flex items-center rounded-md p-2"
                  onClick={() => onDeletePost(post._id || '')}
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  <span>Delete post</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="hover:bg-muted flex items-center rounded-md p-2">
                <Bookmark className="h-5 w-5 mr-2" />
                <span>Save post</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-muted flex items-center rounded-md p-2">
                <Eye className="h-5 w-5 mr-2" />
                <span>Hide post</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-muted flex items-center rounded-md p-2">
                <Flag className="h-5 w-5 mr-2" />
                <span>Report</span>
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
              onClick={() => onLike(post.id)}
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
              onClick={() => onToggleComments(post._id)}
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

        {!activeCommentPostId && (
          <>
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
                      onClick={() => onToggleComments(post._id)}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-card-foreground hover:bg-muted rounded-full"
                      onClick={() => onToggleComments(post._id)}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send comment</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </Card>

      {activeCommentPostId === post._id && (
        <div className="mt-2">
          <CommentSection 
            postId={post._id} 
            onClose={() => onCommentSectionClose(post._id || '')}
          />
        </div>
      )}
    </div>
  );
}