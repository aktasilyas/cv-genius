import { motion } from 'framer-motion';
import { useCVContext } from '@/context/CVContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const SummaryStep = () => {
  const { cvData, updateSummary } = useCVContext();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2">Professional Summary</h2>
        <p className="text-muted-foreground">
          Write a compelling summary that highlights your key qualifications and career goals
        </p>
      </div>

      <div>
        <Label htmlFor="summary" className="text-sm font-medium">
          Summary
        </Label>
        <Textarea
          id="summary"
          placeholder="Passionate software engineer with 5+ years of experience in building scalable web applications. Skilled in React, Node.js, and cloud technologies. Proven track record of delivering high-quality solutions and leading cross-functional teams..."
          value={cvData.summary}
          onChange={(e) => updateSummary(e.target.value)}
          className="mt-1.5 min-h-[200px]"
        />
        <p className="text-sm text-muted-foreground mt-2">
          {cvData.summary.length} / 500 characters recommended
        </p>
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
        <h4 className="font-medium text-accent mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Keep it concise (3-4 sentences)</li>
          <li>• Include your years of experience</li>
          <li>• Mention your key skills and achievements</li>
          <li>• Tailor it to the job you're applying for</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default SummaryStep;
