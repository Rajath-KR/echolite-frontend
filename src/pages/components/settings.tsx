import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LogOut, User, Bell, Lock, Sun, AlertCircle } from 'lucide-react';

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
  email?: string;
}

const Settings = () => {
  const [profileData, setProfileData] = useState<ProfileDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    newMessage: true,
    friendRequests: true,
    mentions: true,
    comments: false,
    likes: false,
    newFollower: true,
    updates: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    messagePermission: "friends",
    showOnlineStatus: true,
    showActivity: true,
    twoFactorAuth: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/profile');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          setProfileData({
            ...result.data[0],
            email: 'user@example.com' 
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePrivacyChange = (setting: keyof typeof privacySettings, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveSettings = (settingType: string) => {
    console.log(`Saving ${settingType} settings:`, 
      settingType === 'notification' ? notificationSettings : 
      settingType === 'privacy' ? privacySettings : 
      'account settings');
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Settings</h1>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64">
            <TabsList className="flex flex-col h-auto bg-card p-2 space-y-1">
              <TabsTrigger value="account" className="justify-start w-full px-3 py-2 data-[state=active]:bg-[#283848]">
                <User size={16} className="mr-2" /> Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="justify-start w-full px-3 py-2 data-[state=active]:bg-[#283848]">
                <Bell size={16} className="mr-2" /> Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="justify-start w-full px-3 py-2 data-[state=active]:bg-[#283848]">
                <Lock size={16} className="mr-2" /> Privacy & Security
              </TabsTrigger>
              <TabsTrigger value="appearance" className="justify-start w-full px-3 py-2 data-[state=active]:bg-[#283848]">
                <Sun size={16} className="mr-2" /> Appearance
              </TabsTrigger>
              <TabsTrigger value="help" className="justify-start w-full px-3 py-2 data-[state=active]:bg-[#283848]">
                <AlertCircle size={16} className="mr-2" /> Help & Support
              </TabsTrigger>
            </TabsList>
            <Button variant="destructive" className="w-full mt-6 flex items-center justify-start opacity-90 hover:opacity-100">
              <LogOut size={16} className="mr-2" /> Log Out
            </Button>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="rounded-full h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
              </div>
            ) : (
              <>
                <TabsContent value="account">
                  <Card className="bg-card border-0 shadow-md mb-6">
                    <CardHeader>
                      <CardTitle className="text-gray-100">Profile Information</CardTitle>
                      <CardDescription>Manage your personal information and account settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center md:items-start">
                          <Avatar className="h-24 w-24 mb-4 bg-[#3b3b47] border-2 border-gray-600">
                            {profileData?.profileImg ? (
                              <img src={`http://localhost:8000/Images/${profileData.profileImg}`} alt={profileData.fullname} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-2xl text-white rounded-full h-full w-full flex items-center justify-center">{profileData?.fullname.charAt(0)}</div>
                            )}
                          </Avatar>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white mb-2">
                            Change Avatar
                          </Button>
                          <Button variant="outline" className="bg-gray-700 border-gray-700 text-white hover:bg-gray-800">
                            Remove
                          </Button>
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="fullname">Full Name</Label>
                              <Input id="fullname" defaultValue={profileData?.fullname} className="bg-[#283848] border-gray-700 text-gray-200" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="username">Username</Label>
                              <Input id="username" defaultValue={profileData?.username} className="bg-[#283848] border-gray-700 text-gray-200" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" defaultValue={profileData?.email} className="bg-[#283848] border-gray-700 text-gray-200" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mobile">Mobile Number</Label>
                              <Input id="mobile" defaultValue={profileData?.mobilenumber} className="bg-[#283848] border-gray-700 text-gray-200" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" defaultValue={profileData?.bio} className="bg-[#283848] border-gray-700 text-gray-200" rows={3} />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="gender">Gender</Label>
                              <Select defaultValue={profileData?.gender}>
                                <SelectTrigger className="bg-[#283848] border-gray-700 text-gray-200">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#283848] border-gray-700 text-gray-200">
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="location">Location</Label>
                              <Input id="location" defaultValue={profileData?.location} className="bg-[#283848] border-gray-700 text-gray-200" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dateofbirth">Date of Birth</Label>
                            <Input id="dateofbirth" type="date" defaultValue={profileData?.dateofbirth} className="bg-[#283848] border-gray-700 text-gray-200" />
                          </div>

                          <div className="flex justify-end pt-4">
                            <Button onClick={() => saveSettings("account")} className="bg-blue-600 hover:bg-blue-700">
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications">
                  <Card className="bg-card border-0 shadow-md mb-6">
                    <CardHeader>
                      <CardTitle className="text-gray-100">Notifications</CardTitle>
                      <CardDescription>Customize when and how we notify you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(notificationSettings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label className="capitalize text-gray-200">{key.replace(/([A-Z])/g, ' $1')}</Label>
                          <Switch checked={value} onCheckedChange={() => handleNotificationToggle(key as keyof typeof notificationSettings)} />
                        </div>
                      ))}
                      <div className="flex justify-end pt-4">
                        <Button onClick={() => saveSettings("notification")} className="bg-blue-600 hover:bg-blue-700">
                          Save Notifications
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="privacy">
                  <Card className="bg-card border-0 shadow-md mb-6">
                    <CardHeader>
                      <CardTitle className="text-gray-100">Privacy & Security</CardTitle>
                      <CardDescription>Control what people see and how secure your account is</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Profile Visibility</Label>
                        <Select defaultValue={privacySettings.profileVisibility} onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}>
                          <SelectTrigger className="bg-[#283848] border-gray-700 text-gray-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Who can message you?</Label>
                        <Select defaultValue={privacySettings.messagePermission} onValueChange={(value) => handlePrivacyChange("messagePermission", value)}>
                          <SelectTrigger className="bg-[#283848] border-gray-700 text-gray-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="friends">Friends</SelectItem>
                            <SelectItem value="noone">No one</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Show Online Status</Label>
                        <Switch checked={privacySettings.showOnlineStatus} onCheckedChange={(val) => handlePrivacyChange("showOnlineStatus", val)} />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Show Activity</Label>
                        <Switch checked={privacySettings.showActivity} onCheckedChange={(val) => handlePrivacyChange("showActivity", val)} />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Two-Factor Authentication</Label>
                        <Switch checked={privacySettings.twoFactorAuth} onCheckedChange={(val) => handlePrivacyChange("twoFactorAuth", val)} />
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button onClick={() => saveSettings("privacy")} className="bg-blue-600 hover:bg-blue-700">
                          Save Privacy Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="appearance">
                  <Card className="bg-card border-0 shadow-md mb-6">
                    <CardHeader>
                      <CardTitle className="text-gray-100">Appearance</CardTitle>
                      <CardDescription>Adjust the look and feel of the application</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end pt-4">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Save Appearance Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="help">
                  <Card className="bg-card border-0 shadow-md mb-6">
                    <CardHeader>
                      <CardTitle className="text-gray-100">Help & Support</CardTitle>
                      <CardDescription>Find answers to your questions or contact support</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Frequently Asked Questions</Label>
                        <Button className="w-full">Visit FAQ</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;