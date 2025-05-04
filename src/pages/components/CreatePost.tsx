import { useState } from 'react';
import {
  FileImage,
  Camera,
  Smile
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

interface CreatePostProps {
  profileData: any[];
  onCreatePost: (desc: string, location: string, image: File | null) => Promise<void>;
}

export function CreatePost({ profileData, onCreatePost }: CreatePostProps) {
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!desc.trim() && !image) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onCreatePost(desc, location, image);
      // Reset form after successful submission
      setDesc('');
      setLocation('');
      setImage(null);
    } catch (error) {
      console.error('Error in create post component:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="text"
                  placeholder="Add location (optional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-card border border-border p-2 rounded-md w-full"
                />
              </div>
              
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

          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isLoading || (!desc.trim() && !image)}
            className="bg-blue-600 hover:bg-blue-700 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg min-w-[120px] focus:outline-none focus:ring-2 focus:ring-primary/70 focus:ring-offset-0"
          >
            {isLoading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}