import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CVProvider } from '@/context/CVContext';
import TemplateSelector from '@/components/builder/TemplateSelector';

const TemplatesContent = () => {
  const navigate = useNavigate();

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
          <Button variant="accent" size="sm" onClick={() => navigate('/builder')} className="text-sm sm:text-base">
            Start Building
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-semibold mb-3 sm:mb-4">
            Choose Your Template
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Select from our professionally designed templates. Each one is ATS-friendly and optimized for success.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <TemplateSelector />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            variant="hero"
            onClick={() => navigate('/builder')}
            className="group"
          >
            Start Building Your CV
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

const Templates = () => {
  return (
    <CVProvider>
      <TemplatesContent />
    </CVProvider>
  );
};

export default Templates;
