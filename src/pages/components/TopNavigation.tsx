import {
  Bell,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfiles } from '@/redux/profileSlice';
import type { RootState, AppDispatch } from '@/redux/store';

export function TopNavigation() {
  const dispatch = useDispatch<AppDispatch>();

  const profileData = useSelector((state: RootState) => state.profiles.data);

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav />
          </SheetContent>
        </Sheet>
        <NavLink to="/" className="mr-4 flex items-center space-x-2">
          <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-primary-foreground font-bold">E</span>
          </div>
          <span className="font-bold">Echolite</span>
        </NavLink>
        <div className="flex-1 md:grow-0 md:w-1/3">
          <form className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
        </div>
        <nav className="flex flex-1 items-center ml-100 justify-end space-x-1">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden md:flex"
          >
            <NavLink to="/">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </NavLink>
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <NavLink to="/profile">
            {profileData.map((profile, index) => (
              <Avatar className="h-8 w-8" key={index}>
                <AvatarImage
                  src={`http://localhost:8000/Images/${profile.profileImg}`}
                  alt="User"
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            ))}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <div className="flex flex-col space-y-4 py-4">
      <NavLink
        to="/"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
      >
        <Home className="h-5 w-5" />
        Home
      </NavLink>
      <NavLink
        to="/profile"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
      >
        <User className="h-5 w-5" />
        Profile
      </NavLink>
      <NavLink
        to="/messages"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
      >
        <MessageSquare className="h-5 w-5" />
        Messages
      </NavLink>
    </div>
  );
}
