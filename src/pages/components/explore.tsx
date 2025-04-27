import { useState, useEffect } from 'react';
import { Search, Filter, Compass, TrendingUp, Image as ImageIcon, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

interface Post {
  id: number;
  desc: string;
  location: string;
  postImg?: string | null;
}

const ExplorePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: <Compass className="w-4 h-4 mr-1" /> },
    { id: 'trending', label: 'Trending', icon: <TrendingUp className="w-4 h-4 mr-1" /> },
    { id: 'photos', label: 'Photos', icon: <ImageIcon className="w-4 h-4 mr-1" /> },
    { id: 'nearby', label: 'Nearby', icon: <MapPin className="w-4 h-4 mr-1" /> },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/post');
        if (response.ok) {
          const result = await response.json();
          setPosts(result.data);
          setFilteredPosts(result.data);
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts.filter(post =>
      post.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);

    let filtered = posts;

    if (filter === 'photos') {
      filtered = posts.filter(post => post.postImg);
    } else if (filter === 'nearby') {
      filtered = posts.filter(post => post.location);
    } else if (filter === 'trending') {
      filtered = posts.slice(0, 5);
    }

    setFilteredPosts(filtered);
  };

  const openPostDialog = (post: Post) => {
    setSelectedPost(post);
    setIsPostDialogOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-2 flex items-center">
          <Compass className="mr-2" /> Explore
        </h1>
        <p className="text-gray-400">Discover new content and creators</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search posts, locations, or topics..."
            className="pl-10 bg-card border-gray-700 text-gray-200 focus-visible:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="border-gray-700 text-gray-300 hover:bg-[#383848] hover:text-gray-100"
        >
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={handleFilterChange}>
        <TabsList className="bg-card border border-gray-700">
          {categories.map(category => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-[#383848] data-[state=active]:text-gray-100"
            >
              <div className="flex items-center">
                {category.icon}
                {category.label}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-4">
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
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    post.postImg && (
                      <motion.div
                        key={post.id || index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.03 }}
                        className="relative group cursor-pointer"
                        onClick={() => openPostDialog(post)}
                      >
                        <div className="aspect-square overflow-hidden rounded-lg shadow-md">
                          <img
                            src={`http://localhost:8000/Images/${post.postImg}`}
                            alt={post.desc || "Post image"}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 rounded-lg">
                          {post.desc && (
                            <p className="text-white text-sm font-medium truncate">{post.desc}</p>
                          )}
                          {post.location && (
                            <div className="flex items-center text-gray-300 text-xs mt-1">
                              <MapPin size={12} className="mr-1" />
                              <span>{post.location}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center h-64 bg-card rounded-lg">
                    <ImageIcon className="h-16 w-16 text-gray-500 mb-4" />
                    <h3 className="text-gray-300 text-lg font-medium">No results found</h3>
                    <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                  </div>
                )}
              </motion.div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-card border-gray-700 mb-8">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" /> Trending Hashtags
          </h2>
          <div className="flex flex-wrap gap-2">
            {['#Photography', '#Nature', '#Travel', '#FoodLovers', '#Fashion', '#Technology', 
              '#Fitness', '#Art', '#Music', '#Books'].map(tag => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="bg-[#383848] hover:bg-blue-600 cursor-pointer transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-[#2a2a34] border-gray-700 p-0 overflow-hidden">
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

export default ExplorePage;
