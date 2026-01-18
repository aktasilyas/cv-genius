import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, Trash2, Copy, Edit, MoreVertical, Star, Loader2, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/context/SettingsContext';
import { cvService, SavedCV } from '@/services/cvService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import AuthButton from '@/components/auth/AuthButton';
import SettingsModal from '@/components/settings/SettingsModal';

const Dashboard = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { t } = useSettings();
  const navigate = useNavigate();
  const [cvs, setCvs] = useState<SavedCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCVs();
    }
  }, [isAuthenticated]);

  const loadCVs = async () => {
    try {
      setLoading(true);
      const data = await cvService.getUserCVs();
      setCvs(data);
    } catch (error) {
      console.error('Error loading CVs:', error);
      toast.error(t('dashboard.loadError') || 'Failed to load CVs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    // Clear localStorage and navigate to builder
    localStorage.removeItem('cv-data');
    localStorage.removeItem('editing-cv-id');
    navigate('/builder');
  };

  const handleEdit = (cv: SavedCV) => {
    localStorage.setItem('cv-data', JSON.stringify(cv.cv_data));
    localStorage.setItem('editing-cv-id', cv.id);
    localStorage.setItem('selected-template', cv.selected_template);
    navigate('/builder');
  };

  const handleDuplicate = async (id: string) => {
    try {
      await cvService.duplicateCV(id);
      toast.success(t('dashboard.duplicateSuccess') || 'CV duplicated successfully');
      loadCVs();
    } catch (error) {
      console.error('Error duplicating CV:', error);
      toast.error(t('dashboard.duplicateError') || 'Failed to duplicate CV');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await cvService.deleteCV(deleteId);
      toast.success(t('dashboard.deleteSuccess') || 'CV deleted successfully');
      setCvs(cvs.filter(cv => cv.id !== deleteId));
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast.error(t('dashboard.deleteError') || 'Failed to delete CV');
    } finally {
      setDeleteId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await cvService.setDefaultCV(id);
      toast.success(t('dashboard.defaultSuccess') || 'Default CV updated');
      loadCVs();
    } catch (error) {
      console.error('Error setting default:', error);
      toast.error(t('dashboard.defaultError') || 'Failed to set default CV');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-display font-semibold">CVCraft</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="w-5 h-5" />
            </Button>
            <AuthButton />
          </div>
        </div>
      </header>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">
              {t('dashboard.title') || 'My CVs'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('dashboard.subtitle') || 'Manage and edit your resumes'}
            </p>
          </div>
          <Button variant="accent" onClick={handleCreateNew} className="gap-2">
            <Plus className="w-4 h-4" />
            {t('dashboard.createNew') || 'Create New CV'}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : cvs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {t('dashboard.empty') || 'No CVs yet'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('dashboard.emptyDesc') || 'Create your first CV to get started'}
            </p>
            <Button variant="accent" onClick={handleCreateNew} className="gap-2">
              <Plus className="w-4 h-4" />
              {t('dashboard.createFirst') || 'Create Your First CV'}
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cvs.map((cv, index) => (
              <motion.div
                key={cv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {cv.title}
                        {cv.is_default && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border shadow-lg">
                          <DropdownMenuItem onClick={() => handleEdit(cv)}>
                            <Edit className="w-4 h-4 mr-2" />
                            {t('dashboard.edit') || 'Edit'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(cv.id)}>
                            <Copy className="w-4 h-4 mr-2" />
                            {t('dashboard.duplicate') || 'Duplicate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSetDefault(cv.id)}>
                            <Star className="w-4 h-4 mr-2" />
                            {t('dashboard.setDefault') || 'Set as Default'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteId(cv.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t('dashboard.delete') || 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="aspect-[210/297] bg-secondary rounded-lg overflow-hidden mb-3 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <FileText className="w-12 h-12" />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{cv.cv_data.personalInfo?.fullName || t('dashboard.unnamed') || 'Unnamed'}</p>
                      <p className="capitalize">{cv.selected_template} {t('dashboard.template') || 'template'}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {t('dashboard.updated') || 'Updated'}: {formatDate(cv.updated_at)}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(cv)}>
                      {t('dashboard.open') || 'Open'}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.deleteTitle') || 'Delete CV?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.deleteDesc') || 'This action cannot be undone. This will permanently delete your CV.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('btn.cancel') || 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('btn.delete') || 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
