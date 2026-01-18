import { CVData } from '@/types/cv';

interface TechnicalTemplateProps {
  data: CVData;
}

const TechnicalTemplate: React.FC<TechnicalTemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;

  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    return `${month}/${year}`;
  };

  const getSkillLevel = (level: string) => {
    switch (level) {
      case 'expert': return 5;
      case 'advanced': return 4;
      case 'intermediate': return 3;
      case 'beginner': return 2;
      default: return 3;
    }
  };

  return (
    <div className="bg-white text-gray-900 p-8 min-h-[1123px] font-mono text-sm">
      {/* Header */}
      <header className="mb-6 pb-4 border-b-2 border-blue-600">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-lg text-blue-600 font-medium">
              {personalInfo.title || 'Professional Title'}
            </p>
          </div>
          <div className="text-right text-xs text-gray-600 space-y-1">
            {personalInfo.email && <div className="font-mono">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div className="text-blue-600">{personalInfo.linkedin}</div>}
            {personalInfo.website && <div className="text-blue-600">{personalInfo.website}</div>}
          </div>
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="text-gray-400">&gt;</span> Summary
          </h2>
          <p className="text-gray-700 leading-relaxed pl-4 border-l-2 border-gray-200">{summary}</p>
        </section>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-gray-400">&gt;</span> Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{exp.position || 'Position'}</h3>
                        <p className="text-blue-600 text-xs">{exp.company || 'Company'}</p>
                      </div>
                      <code className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                        {formatDate(exp.startDate)} → {exp.current ? 'present' : formatDate(exp.endDate)}
                      </code>
                    </div>
                    {exp.description && (
                      <p className="text-gray-600 text-xs whitespace-pre-line font-sans">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-gray-400">&gt;</span> Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start bg-gray-50 p-3 rounded-lg">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                      <p className="text-blue-600 text-xs">{edu.institution}</p>
                    </div>
                    <div className="text-right">
                      <code className="text-xs text-gray-500">{formatDate(edu.endDate)}</code>
                      {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Technical Skills */}
          {skills.length > 0 && (
            <section className="bg-gray-900 text-white p-4 rounded-lg">
              <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">
                // Tech Stack
              </h2>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{skill.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded ${
                            level <= getSkillLevel(skill.level) 
                              ? 'bg-blue-500' 
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">
                // Languages
              </h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between text-xs">
                    <span className="text-gray-700">{lang.name}</span>
                    <code className="text-blue-600">{lang.proficiency}</code>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalTemplate;
