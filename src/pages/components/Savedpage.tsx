import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

interface Post {
  id: number;
  desc: string;
  location: string;
  postImg?: string | null;
}

const SavedPage = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSavedPosts = () => {
      const savedData = localStorage.getItem('savedPosts');
      if (savedData) {
        setSavedPosts(JSON.parse(savedData));
      } else {
        console.log('No saved posts found.');
      }
    };

    fetchSavedPosts();
  }, []);

  const openPostDialog = (post: Post) => {
    setSelectedPost(post);
    setIsPostDialogOpen(true);
  };

  const closeDialog = () => {
    setIsPostDialogOpen(false);
  };

  const removeFromSaved = (postId: number) => {
    const updatedSavedPosts = savedPosts.filter(post => post.id !== postId);
    setSavedPosts(updatedSavedPosts);
    localStorage.setItem('savedPosts', JSON.stringify(updatedSavedPosts));
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 text-gray-200">
      <h1 className="text-2xl font-bold text-gray-100 mb-4">Saved Posts</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {savedPosts.length > 0 ? (
          savedPosts.map(post => (
            <motion.div
              key={post.id}
              whileHover={{ scale: 1.03 }}
              className="relative group cursor-pointer"
              onClick={() => openPostDialog(post)}
            >
              <Card className="shadow-lg">
                <CardContent>
                  {post.postImg && (
                    <img
                      src={`http://localhost:8000/Images/${post.postImg}`}
                      alt={post.desc}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <h3 className="text-lg text-gray-100 mt-2">{post.desc}</h3>
                  <p className="text-gray-400 text-sm mt-1">{post.location}</p>
                </CardContent>
                <Button
                  variant="outline"
                  className="absolute top-2 right-2 text-red-500 hover:bg-red-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromSaved(post.id);
                  }}
                >
                  Remove
                </Button>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400">
            <p>No saved posts yet.</p>
          </div>
        )}
      </div>

      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-card border-gray-700 p-0">
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
                <p className="text-gray-300 mb-4">{selectedPost.desc}</p>
                <p className="text-gray-400 text-xs">{selectedPost.location}</p>
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

export default SavedPage;
