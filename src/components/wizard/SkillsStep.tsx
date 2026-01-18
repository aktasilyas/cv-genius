import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SkillsStep = () => {
  const { cvData, addSkill, updateSkill, removeSkill, addLanguage, updateLanguage, removeLanguage } = useCVContext();

  const skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ];

  const languageProficiencies = [
    { value: 'basic', label: 'Basic' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'professional', label: 'Professional' },
    { value: 'native', label: 'Native' },
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
            <h2 className="text-2xl font-display font-semibold mb-2">Skills</h2>
            <p className="text-muted-foreground">Add your technical and soft skills</p>
          </div>
          <Button variant="outline" onClick={addSkill} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Skill
          </Button>
        </div>

        {cvData.skills.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground mb-4">No skills added yet</p>
            <Button variant="accent" onClick={addSkill}>
              Add Your First Skill
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
                  placeholder="e.g., JavaScript"
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
                        {level.label}
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

      {/* Languages Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-display font-semibold mb-2">Languages</h2>
            <p className="text-muted-foreground">Add languages you speak</p>
          </div>
          <Button variant="outline" onClick={addLanguage} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Language
          </Button>
        </div>

        {cvData.languages.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground mb-4">No languages added yet</p>
            <Button variant="accent" onClick={addLanguage}>
              Add Your First Language
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {cvData.languages.map((lang) => (
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
              >
                <Input
                  placeholder="e.g., English"
                  value={lang.name}
                  onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={lang.proficiency}
                  onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languageProficiencies.map((prof) => (
                      <SelectItem key={prof.value} value={prof.value}>
                        {prof.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLanguage(lang.id)}
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
