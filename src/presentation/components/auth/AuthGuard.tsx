import { FC, ReactNode, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: 'modal' | 'redirect' | 'inline';
  feature?: string;
}

export const AuthGuard: FC<AuthGuardProps> = ({
  children,
  fallback = 'modal',
  feature = 'this feature'
}) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (fallback === 'redirect') {
    navigate('/login');
    return null;
  }

  if (fallback === 'inline') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/50">
        <Lock className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Sign in Required</h3>
        <p className="text-muted-foreground mb-4">
          Please sign in to use {feature}
        </p>
        <Button onClick={() => navigate('/login')}>
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </div>
    );
  }

  // Modal fallback
  return (
    <>
      <div onClick={() => setShowModal(true)}>
        {children}
      </div>
      <AuthRequiredModal
        open={showModal}
        onOpenChange={setShowModal}
        feature={feature}
      />
    </>
  );
};

interface AuthRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

export const AuthRequiredModal: FC<AuthRequiredModalProps> = ({
  open,
  onOpenChange,
  feature = 'this feature'
}) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    onOpenChange(false);
    navigate('/login');
  };

  const handleSignUp = () => {
    onOpenChange(false);
    navigate('/signup');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-accent" />
          </div>
          <DialogTitle className="text-center">Sign In Required</DialogTitle>
          <DialogDescription className="text-center">
            Create a free account or sign in to use {feature}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={handleSignIn} className="w-full">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
          <Button variant="outline" onClick={handleSignUp} className="w-full">
            Create Free Account
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-4">
          Free accounts get 5 AI analyses, 10 CV parses per day
        </p>
      </DialogContent>
    </Dialog>
  );
};
