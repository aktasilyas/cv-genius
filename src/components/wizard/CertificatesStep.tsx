import { motion } from 'framer-motion';
import { Plus, Trash2, Award, Link, Calendar } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CertificatesStep = () => {
  const { cvData, addCertificate, updateCertificate, removeCertificate } = useCVContext();
  const { t } = useSettings();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2">
          {t('builder.certificates') || 'Certificates'}
        </h2>
        <p className="text-muted-foreground">
          {t('builder.certificatesDesc') || 'Add your professional certifications and credentials'}
        </p>
      </div>

      <div className="space-y-6">
        {(cvData.certificates || []).map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-secondary/30 rounded-xl border border-border relative group"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
              onClick={() => removeCertificate(cert.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor={`cert-name-${cert.id}`} className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  {t('field.certName') || 'Certificate Name'}
                </Label>
                <Input
                  id={`cert-name-${cert.id}`}
                  value={cert.name}
                  onChange={(e) => updateCertificate(cert.id, 'name', e.target.value)}
                  placeholder="AWS Solutions Architect"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor={`cert-issuer-${cert.id}`}>
                  {t('field.issuer') || 'Issuing Organization'}
                </Label>
                <Input
                  id={`cert-issuer-${cert.id}`}
                  value={cert.issuer}
                  onChange={(e) => updateCertificate(cert.id, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor={`cert-date-${cert.id}`} className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('field.issueDate') || 'Issue Date'}
                </Label>
                <Input
                  id={`cert-date-${cert.id}`}
                  type="month"
                  value={cert.date}
                  onChange={(e) => updateCertificate(cert.id, 'date', e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor={`cert-url-${cert.id}`} className="flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  {t('field.certUrl') || 'Certificate URL (Optional)'}
                </Label>
                <Input
                  id={`cert-url-${cert.id}`}
                  type="url"
                  value={cert.url || ''}
                  onChange={(e) => updateCertificate(cert.id, 'url', e.target.value)}
                  placeholder="https://www.credly.com/..."
                  className="mt-1.5"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={addCertificate}
        className="w-full border-dashed"
      >
        <Plus className="w-4 h-4" />
        {t('btn.addCertificate') || 'Add Certificate'}
      </Button>
    </motion.div>
  );
};

export default CertificatesStep;
