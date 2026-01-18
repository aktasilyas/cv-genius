import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const AuthButton = () => {
  const { user, loading, signInWithGoogle, signOut, isAuthenticated } = useAuth();
  const { t } = useSettings();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t('auth.signOut') || 'Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  if (isAuthenticated && user) {
    const initials = user.user_metadata?.full_name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Avatar className="w-7 h-7">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="text-xs bg-accent text-accent-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline max-w-[100px] truncate">
              {user.user_metadata?.full_name || user.email}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-popover border shadow-lg">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{user.user_metadata?.full_name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" />
            {t('nav.signOut') || 'Sign Out'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignIn}
      disabled={isSigningIn}
      className="gap-2"
    >
      {isSigningIn ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {t('nav.signIn') || 'Sign In'}
        </>
      )}
    </Button>
  );
};

export default AuthButton;
