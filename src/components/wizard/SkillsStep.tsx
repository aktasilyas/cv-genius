import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SkillsStep = () => {
  const { cvData, addSkill, updateSkill, removeSkill } = useCVContext();
  const { t } = useSettings();

  const skillLevels = [
    { value: 'beginner', labelKey: 'skill.beginner' },
    { value: 'intermediate', labelKey: 'skill.intermediate' },
    { value: 'advanced', labelKey: 'skill.advanced' },
    { value: 'expert', labelKey: 'skill.expert' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Skills Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-display font-semibold mb-2">
              {t('builder.skills') || 'Skills'}
            </h2>
            <p className="text-muted-foreground">
              {t('builder.skillsDesc') || 'Add your technical and soft skills'}
            </p>
          </div>
          <Button variant="outline" onClick={addSkill} className="gap-2">
            <Plus className="w-4 h-4" />
            {t('btn.addSkill') || 'Add Skill'}
          </Button>
        </div>

        {cvData.skills.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground mb-4">
              {t('empty.skills') || 'No skills added yet'}
            </p>
            <Button variant="accent" onClick={addSkill}>
              {t('empty.addFirstSkill') || 'Add Your First Skill'}
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {cvData.skills.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
              >
                <Input
                  placeholder={t('placeholder.skill') || 'e.g., JavaScript'}
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={skill.level}
                  onValueChange={(value) => updateSkill(skill.id, 'level', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {t(level.labelKey) || level.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSkill(skill.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SkillsStep;
