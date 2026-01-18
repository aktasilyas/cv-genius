import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-display font-semibold">CVCraft</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm">
              Build professional, ATS-optimized resumes with AI assistance.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/templates" className="hover:text-primary-foreground transition-colors">Templates</Link></li>
              <li><Link to="/builder" className="hover:text-primary-foreground transition-colors">CV Builder</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">AI Features</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">CV Examples</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Career Tips</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">About</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Privacy</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} CVCraft. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
