import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, FileText, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Login = () => {
  const { signInWithEmail, signInWithGoogle, isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useSettings();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = t('auth.emailRequired') || 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('auth.invalidEmail') || 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = t('auth.passwordRequired') || 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = t('auth.passwordMinLength') || 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/builder');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await signInWithEmail(email, password);
      if (result?.user) {
        toast.success(t('auth.loginSuccess') || 'Welcome back!');
        navigate('/builder');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || t('auth.loginError') || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
      setIsGoogleLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                <FileText className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary-foreground">CVCraft</span>
            </Link>
            
            <h1 className="text-4xl xl:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              {t('auth.loginTitle') || 'Welcome back to your professional journey'}
            </h1>
            
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-md">
              {t('auth.loginSubtitle') || 'Continue crafting your perfect CV with AI-powered tools and professional templates.'}
            </p>

            <div className="flex items-center gap-4 text-primary-foreground/60">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-primary-foreground/20 border-2 border-primary flex items-center justify-center text-xs font-medium text-primary-foreground"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm">
                {t('auth.usersJoined') || '10,000+ professionals trust us'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-primary px-4 py-6 safe-area-inset-top">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">CVCraft</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-primary-foreground">
            {t('auth.signIn') || 'Sign in'}
          </h1>
          <p className="mt-1 text-primary-foreground/70 text-sm">
            {t('auth.loginSubtitle') || 'Continue crafting your perfect CV'}
          </p>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md"
          >

            {/* Desktop Title */}
            <div className="mb-6 lg:mb-8 hidden lg:block">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {t('auth.signIn') || 'Sign in'}
              </h2>
              <p className="text-muted-foreground">
                {t('auth.noAccount') || "Don't have an account?"}{' '}
                <Link to="/signup" className="text-primary font-medium hover:underline">
                  {t('auth.signUpLink') || 'Sign up'}
                </Link>
              </p>
            </div>

            {/* Mobile subtitle */}
            <div className="mb-6 lg:hidden">
              <p className="text-muted-foreground text-sm">
                {t('auth.noAccount') || "Don't have an account?"}{' '}
                <Link to="/signup" className="text-primary font-medium hover:underline">
                  {t('auth.signUpLink') || 'Sign up'}
                </Link>
              </p>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 sm:h-12 mb-4 sm:mb-6 gap-2 sm:gap-3 text-sm sm:text-base"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {t('auth.continueWithGoogle') || 'Continue with Google'}
          </Button>

            {/* Divider */}
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-3 sm:px-4 bg-background text-muted-foreground">
                  {t('auth.orContinueWith') || 'or continue with email'}
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                  {t('auth.email') || 'Email'}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    className="h-10 sm:h-12 pl-10 sm:pl-11 text-sm sm:text-base"
                    error={errors.email}
                    touched={!!errors.email}
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs sm:text-sm font-medium">
                    {t('auth.password') || 'Password'}
                  </Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs sm:text-sm text-primary hover:underline"
                  >
                    {t('auth.forgotPassword') || 'Forgot password?'}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    className="h-10 sm:h-12 pl-10 sm:pl-11 pr-10 sm:pr-11 text-sm sm:text-base"
                    error={errors.password}
                    touched={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-12 text-sm sm:text-base gap-2"
                disabled={isLoading}
              >
              {isLoading ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <>
                    {t('auth.signIn') || 'Sign in'}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground">
              {t('auth.termsText') || 'By signing in, you agree to our'}{' '}
              <Link to="/terms" className="text-primary hover:underline">
                {t('auth.terms') || 'Terms of Service'}
              </Link>{' '}
              {t('auth.and') || 'and'}{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                {t('auth.privacy') || 'Privacy Policy'}
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;