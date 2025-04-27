import { useState, useEffect } from 'react';
import { Send, Trash2, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import type { RootState } from '../../redux/store';

interface CommentSectionProps {
  postId: string;
  onClose: () => void;
}

interface User {
  _id: string;
  username?: string;
  fullname?: string;
  profileImg?: string;
}

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  userId: User;
}

interface Profile {
  _id: string;
  username?: string;
  profileImg?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const profileData = useSelector((state: RootState) => state.profiles.data as Profile[]);
  const currentUserId = profileData[0]?._id;

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(`http://localhost:8000/comments/post/${postId}`);
      if (response.ok) {
        const result = await response.json();
        setComments(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !currentUserId) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          userId: currentUserId,
          text: commentText,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setComments([result.data, ...comments]);
        setCommentText('');
        
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(comments.filter(comment => comment._id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg max-h-[60vh] flex flex-col">
      <div className="p-3 border-b border-border flex justify-between items-center">
        <h3 className="font-semibold text-card-foreground">
          Comments {isRefreshing ? '(refreshing...)' : `(${comments.length})`}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3 group">
              <Avatar className="h-8 w-8 flex-shrink-0">
                {comment.userId?.profileImg ? (
                  <AvatarImage
                    src={`http://localhost:8000/Images/${comment.userId.profileImg}`}
                    alt={comment.userId.username || 'User'}
                  />
                ) : (
                  <AvatarFallback>
                    {comment.userId?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1">
                <div className="bg-muted p-2 rounded-lg">
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-card-foreground text-sm">
                      {comment.userId?.fullname || comment.userId?.username || 'User'}
                    </h4>
                    {comment.userId?._id === currentUserId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <p className="text-card-foreground text-sm mt-1">{comment.text}</p>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatTimestamp(comment.createdAt)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          {profileData[0]?.profileImg && (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`http://localhost:8000/Images/${profileData[0].profileImg}`}
                alt="Your avatar"
              />
              <AvatarFallback>
                {profileData[0]?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          )}

          <Input
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 bg-muted text-card-foreground"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSubmitComment}
            disabled={isLoading || !commentText.trim()}
            className="text-primary"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
