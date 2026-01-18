import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const ExperienceStep = () => {
  const { cvData, addExperience, updateExperience, removeExperience } = useCVContext();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold mb-2">Work Experience</h2>
          <p className="text-muted-foreground">Add your professional experience</p>
        </div>
        <Button variant="outline" onClick={addExperience} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </div>

      {cvData.experience.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-4">No experience added yet</p>
          <Button variant="accent" onClick={addExperience}>
            Add Your First Experience
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Experience {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExperience(exp.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Job Title</Label>
                  <Input
                    placeholder="Software Engineer"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    placeholder="Google"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                    className="mt-1.5"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Checkbox
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked)}
                    />
                    <Label htmlFor={`current-${exp.id}`} className="text-sm text-muted-foreground cursor-pointer">
                      I currently work here
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Description & Achievements</Label>
                <Textarea
                  placeholder="Describe your responsibilities and achievements. Use bullet points for better readability."
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  className="mt-1.5 min-h-[120px]"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ExperienceStep;
