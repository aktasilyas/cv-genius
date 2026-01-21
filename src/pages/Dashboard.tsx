import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, Navigate } from 'react-router-dom';
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
import SettingsSidebar from '@/components/settings/SettingsSidebar';

const Dashboard = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { t } = useSettings();
  const navigate = useNavigate();
  const [cvs, setCvs] = useState<SavedCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

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
    localStorage.removeItem('cv-title');
    navigate('/builder');
  };

  const handleEdit = (cv: SavedCV) => {
    localStorage.setItem('cv-data', JSON.stringify(cv.cv_data));
    localStorage.setItem('editing-cv-id', cv.id);
    localStorage.setItem('selected-template', cv.selected_template);
    localStorage.setItem('cv-title', cv.title);
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-accent flex items-center justify-center">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-display font-semibold hidden xs:inline">CVCraft</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="w-8 h-8 sm:w-9 sm:h-9">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <AuthButton />
          </div>
        </div>
      </header>

      <SettingsSidebar isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">
              {t('dashboard.title') || 'My CVs'}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {t('dashboard.subtitle') || 'Manage and edit your resumes'}
            </p>
          </div>
          <Button variant="accent" onClick={handleCreateNew} className="gap-2 w-full sm:w-auto">
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
            className="text-center py-12 sm:py-20"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              {t('dashboard.empty') || 'No CVs yet'}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">
              {t('dashboard.emptyDesc') || 'Create your first CV to get started'}
            </p>
            <Button variant="accent" onClick={handleCreateNew} className="gap-2">
              <Plus className="w-4 h-4" />
              {t('dashboard.createFirst') || 'Create Your First CV'}
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {cvs.map((cv, index) => (
              <motion.div
                key={cv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="group hover:shadow-lg transition-all hover:border-accent/50 cursor-pointer"
                  onClick={() => handleEdit(cv)}
                >
                  <CardContent className="p-3">
                    {/* Mini CV Preview */}
                    <div className="aspect-[210/297] bg-white dark:bg-zinc-900 rounded border border-border overflow-hidden mb-2 relative">
                      <div className="p-2 scale-[0.35] origin-top-left w-[286%] h-[286%] text-[10px] leading-tight">
                        {/* Header */}
                        <div className="text-center mb-2 border-b pb-1">
                          <div className="font-bold text-[14px] text-foreground truncate">
                            {cv.cv_data.personalInfo?.fullName || 'Name'}
                          </div>
                          {cv.cv_data.personalInfo?.title && (
                            <div className="text-muted-foreground text-[10px]">{cv.cv_data.personalInfo.title}</div>
                          )}
                          <div className="text-muted-foreground text-[8px] flex items-center justify-center gap-1 flex-wrap">
                            {cv.cv_data.personalInfo?.email && <span>{cv.cv_data.personalInfo.email}</span>}
                            {cv.cv_data.personalInfo?.phone && <span>• {cv.cv_data.personalInfo.phone}</span>}
                          </div>
                        </div>

                        {/* Summary */}
                        {cv.cv_data.summary && (
                          <div className="mb-2">
                            <div className="font-semibold text-[9px] text-accent mb-0.5">Summary</div>
                            <div className="text-[8px] text-muted-foreground line-clamp-2">{cv.cv_data.summary}</div>
                          </div>
                        )}

                        {/* Experience */}
                        {cv.cv_data.experience && cv.cv_data.experience.length > 0 && (
                          <div className="mb-2">
                            <div className="font-semibold text-[9px] text-accent mb-0.5">Experience</div>
                            {cv.cv_data.experience.slice(0, 2).map((exp, i) => (
                              <div key={i} className="text-[8px] mb-0.5">
                                <span className="font-medium text-foreground">{exp.position}</span>
                                {exp.company && <span className="text-muted-foreground"> at {exp.company}</span>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Skills */}
                        {cv.cv_data.skills && cv.cv_data.skills.length > 0 && (
                          <div>
                            <div className="font-semibold text-[9px] text-accent mb-0.5">Skills</div>
                            <div className="flex flex-wrap gap-0.5">
                              {cv.cv_data.skills.slice(0, 6).map((skill, i) => (
                                <span key={i} className="text-[7px] bg-secondary px-1 rounded text-foreground">
                                  {skill.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Template badge */}
                      <div className="absolute bottom-1 right-1 text-[8px] bg-accent/10 text-accent px-1 rounded capitalize">
                        {cv.selected_template}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium truncate">{cv.title || t('dashboard.unnamed') || 'Unnamed'}</span>
                          {cv.is_default && (
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {formatDate(cv.updated_at)}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border shadow-lg z-50">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(cv); }}>
                            <Edit className="w-4 h-4 mr-2" />
                            {t('dashboard.edit') || 'Edit'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicate(cv.id); }}>
                            <Copy className="w-4 h-4 mr-2" />
                            {t('dashboard.duplicate') || 'Duplicate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSetDefault(cv.id); }}>
                            <Star className="w-4 h-4 mr-2" />
                            {t('dashboard.setDefault') || 'Set as Default'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); setDeleteId(cv.id); }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t('dashboard.delete') || 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
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
