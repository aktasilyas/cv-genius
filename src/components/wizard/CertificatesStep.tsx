import { motion } from 'framer-motion';
import { Plus, Trash2, Award, Link, Calendar } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormValidation } from '@/hooks/useFormValidation';

const CertificatesStep = () => {
  const { cvData, addCertificate, updateCertificate, removeCertificate } = useCVContext();
  const { t } = useSettings();
  const { validateField, markTouched, isTouched } = useFormValidation();

  const handleBlur = (fieldId: string) => {
    markTouched(fieldId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-semibold mb-1">
            {t('builder.certificates') || 'Certificates'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('builder.certificatesDesc') || 'Add your professional certifications'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={addCertificate} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('btn.add') || 'Add'}
        </Button>
      </div>

      {(cvData.certificates || []).length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-border/50 rounded-xl bg-secondary/20">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            {t('empty.certificates') || 'No certificates added yet'}
          </p>
          <Button variant="accent" size="sm" onClick={addCertificate}>
            {t('empty.addFirstCertificate') || 'Add Your First Certificate'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {(cvData.certificates || []).map((cert, index) => {
            const nameError = validateField(cert.name, { required: true });
            const issuerError = validateField(cert.issuer, { required: true });
            const dateError = validateField(cert.date, { date: true });
            
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-border/40 bg-card/50 p-5 shadow-sm group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Award className="w-4 h-4 text-amber-600" />
                    </div>
                    <h3 className="font-medium text-sm">
                      {cert.name || `${t('builder.certificate') || 'Certificate'} ${index + 1}`}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeCertificate(cert.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t('field.certName') || 'Certificate Name'} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={cert.name}
                      onChange={(e) => updateCertificate(cert.id, 'name', e.target.value)}
                      onBlur={() => handleBlur(`${cert.id}-name`)}
                      placeholder="AWS Solutions Architect"
                      error={nameError || undefined}
                      touched={isTouched(`${cert.id}-name`)}
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t('field.issuer') || 'Issuing Organization'} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={cert.issuer}
                      onChange={(e) => updateCertificate(cert.id, 'issuer', e.target.value)}
                      onBlur={() => handleBlur(`${cert.id}-issuer`)}
                      placeholder="Amazon Web Services"
                      error={issuerError || undefined}
                      touched={isTouched(`${cert.id}-issuer`)}
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {t('field.issueDate') || 'Issue Date'}
                    </Label>
                    <Input
                      type="month"
                      value={cert.date}
                      onChange={(e) => updateCertificate(cert.id, 'date', e.target.value)}
                      onBlur={() => handleBlur(`${cert.id}-date`)}
                      placeholder="2024-01"
                      error={dateError || undefined}
                      touched={isTouched(`${cert.id}-date`)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Link className="w-3.5 h-3.5" />
                      {t('field.certUrl') || 'Certificate URL'} 
                      <span className="text-muted-foreground/60 text-[10px]">({t('field.optional') || 'Optional'})</span>
                    </Label>
                    <Input
                      type="url"
                      value={cert.url || ''}
                      onChange={(e) => updateCertificate(cert.id, 'url', e.target.value)}
                      placeholder="https://www.credly.com/..."
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default CertificatesStep;
