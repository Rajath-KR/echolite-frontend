import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, UserCheck, X, MessageCircle, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  mutualFriends: number;
  isOnline: boolean;
  lastActive?: string;
}

interface FriendRequest {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  mutualFriends: number;
  requestTime: string;
}

const Friends = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [suggestions, setSuggestions] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFriends([
        {
          id: '1',
          name: 'Alex Johnson',
          username: 'alexj',
          avatar: undefined,
          mutualFriends: 12,
          isOnline: true
        },
        {
          id: '2',
          name: 'Maria Garcia',
          username: 'mariag',
          avatar: undefined,
          mutualFriends: 8,
          isOnline: false,
          lastActive: '3 hours ago'
        },
        {
          id: '3',
          name: 'Sam Wilson',
          username: 'samw',
          avatar: undefined,
          mutualFriends: 5,
          isOnline: true
        },
        {
          id: '4',
          name: 'Priya Patel',
          username: 'priyap',
          avatar: undefined,
          mutualFriends: 15,
          isOnline: false,
          lastActive: '1 day ago'
        },
        {
          id: '5',
          name: 'David Kim',
          username: 'davidk',
          avatar: undefined,
          mutualFriends: 3,
          isOnline: true
        }
      ]);

      setRequests([
        {
          id: '6',
          name: 'James Lee',
          username: 'jameslee',
          avatar: undefined,
          mutualFriends: 4,
          requestTime: '2 days ago'
        },
        {
          id: '7',
          name: 'Sophie Taylor',
          username: 'sophiet',
          avatar: undefined,
          mutualFriends: 7,
          requestTime: '5 hours ago'
        }
      ]);

      setSuggestions([
        {
          id: '8',
          name: 'Michael Brown',
          username: 'michaelb',
          avatar: undefined,
          mutualFriends: 10,
          isOnline: true
        },
        {
          id: '9',
          name: 'Emma Wilson',
          username: 'emmaw',
          avatar: undefined,
          mutualFriends: 6,
          isOnline: false,
          lastActive: '2 days ago'
        },
        {
          id: '10',
          name: 'Ryan Miller',
          username: 'ryanm',
          avatar: undefined,
          mutualFriends: 8,
          isOnline: true
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggestions = suggestions.filter(suggestion => 
    suggestion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    suggestion.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriend = (id: string) => {
    const newFriend = suggestions.find(suggestion => suggestion.id === id);
    if (newFriend) {
      setSuggestions(suggestions.filter(suggestion => suggestion.id !== id));
      setRequests([...requests, {
        ...newFriend,
        requestTime: 'Just now'
      } as FriendRequest]);
    }
  };

  const handleAcceptRequest = (id: string) => {
    const acceptedRequest = requests.find(request => request.id === id);
    if (acceptedRequest) {
      setRequests(requests.filter(request => request.id !== id));
      setFriends([...friends, {
        ...acceptedRequest,
        isOnline: Math.random() > 0.5,
      } as Friend]);
    }
  };

  const handleDeclineRequest = (id: string) => {
    setRequests(requests.filter(request => request.id !== id));
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Friends</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="relative bg-gray-600 text-white hover:bg-gray-700">
            <Bell size={18} />
            <Badge className="absolute -top-1 -right-1 bg-blue-600 text-xs w-5 h-5 flex items-center justify-center p-0">
              {requests.length}
            </Badge>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <UserPlus size={16} className="mr-2" /> Add Friends
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input 
            placeholder="Search friends..." 
            className="pl-10 bg-[#283848] border-gray-700 text-gray-200 focus-visible:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="friends" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6 bg-card">
          <TabsTrigger value="friends" className="data-[state=active]:bg-[#283848]">
            Friends ({friends.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-[#283848]">
            Requests {requests.length > 0 && `(${requests.length})`}
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-[#283848]">
            Suggestions
          </TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="rounded-full h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"
            ></motion.div>
          </div>
        ) : (
          <>
            <TabsContent value="friends">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4"
              >
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((friend) => (
                    <motion.div key={friend.id} variants={itemVariants}>
                      <Card className="bg-card border-0 shadow-md overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <Avatar className="h-12 w-12 border bg-[#3b3b47]">
                                  {friend.avatar ? (
                                    <AvatarImage src={friend.avatar} alt={friend.name} />
                                  ) : (
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                                      {friend.name.charAt(0)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                {friend.isOnline && (
                                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-[#2a2a34]"></span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-100">{friend.name}</p>
                                <p className="text-sm text-gray-400">@{friend.username}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="border-gray-700 text-gray-400">
                                {friend.mutualFriends} mutual friends
                              </Badge>
                              <div className="flex">
                                <Button size="sm" variant="ghost" className="bg-gray-600 text-white hover:bg-gray-700">
                                  <MessageCircle size={18} />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-gray-300 hover:bg-gray-700 hover:text-red-500">
                                  <X size={18} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-card rounded-lg">
                    <UserCheck size={48} className="mx-auto mb-4 text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-300">No friends found</h3>
                    <p className="text-gray-400 mt-2">
                      {searchQuery ? "Try a different search term" : "Add some friends to get started"}
                    </p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="requests">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4"
              >
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <motion.div key={request.id} variants={itemVariants}>
                      <Card className="bg-card border-0 shadow-md overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12 border bg-[#3b3b47]">
                                {request.avatar ? (
                                  <AvatarImage src={request.avatar} alt={request.name} />
                                ) : (
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                                    {request.name.charAt(0)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-100">{request.name}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-gray-400">@{request.username}</p>
                                  <span className="text-xs text-gray-500">{request.requestTime}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="border-gray-700 text-gray-400">
                                {request.mutualFriends} mutual friends
                              </Badge>
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={() => handleAcceptRequest(request.id)} className="bg-blue-600 hover:bg-blue-700">
                                  Accept
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDeclineRequest(request.id)} className="bg-gray-600 text-white hover:bg-gray-700">
                                  Decline
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-card rounded-lg">
                    <Bell size={48} className="mx-auto mb-4 text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-300">No pending requests</h3>
                    <p className="text-gray-400 mt-2">You're all caught up!</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="suggestions">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((suggestion) => (
                    <motion.div key={suggestion.id} variants={itemVariants}>
                      <Card className="bg-card border-0 shadow-md overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <Avatar className="h-12 w-12 border bg-[#3b3b47]">
                                  {suggestion.avatar ? (
                                    <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                                  ) : (
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                                      {suggestion.name.charAt(0)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                {suggestion.isOnline && (
                                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-[#2a2a34]"></span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-100">{suggestion.name}</p>
                                <p className="text-sm text-gray-400">@{suggestion.username}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="border-gray-700 text-gray-400">
                                {suggestion.mutualFriends} mutual friends
                              </Badge>
                              <Button 
                                size="sm" 
                                onClick={() => handleAddFriend(suggestion.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <UserPlus size={16} className="mr-1" /> Add
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-card rounded-lg col-span-2">
                    <UserPlus size={48} className="mx-auto mb-4 text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-300">No suggestions available</h3>
                    <p className="text-gray-400 mt-2">Check back later for new friend suggestions</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Friends;