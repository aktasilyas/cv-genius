import { CVData } from '@/types/cv';
import { Award } from 'lucide-react';
import { Language } from '@/lib/translations';

interface MinimalTemplateProps {
  data: CVData;
  language?: Language;
  t?: (key: string) => string;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data, language = 'en', t = (key: string) => key }) => {
  const { personalInfo, summary, experience, education, skills, languages, certificates, sectionVisibility } = data;

  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    return `${month}/${year}`;
  };

  const visibility = sectionVisibility || { summary: true, experience: true, education: true, skills: true, languages: true, certificates: true };

  return (
    <div className="bg-white text-gray-900 p-10 min-h-[1123px] font-sans text-sm">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-light text-gray-900 tracking-tight mb-1">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-lg text-gray-500 mb-4">
          {personalInfo.title || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-4 text-gray-500 text-xs">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex gap-4 text-gray-500 text-xs mt-1">
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>•</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {visibility.summary && summary && (
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed border-l-2 border-gray-200 pl-4">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {visibility.experience && experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t('cv.experience')}</h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <span className="font-medium text-gray-900">{exp.position || 'Position'}</span>
                    <span className="text-gray-400 mx-2">{language === 'tr' ? '-' : 'at'}</span>
                    <span className="text-gray-700">{exp.company || 'Company'}</span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {formatDate(exp.startDate)} – {exp.current ? t('cv.present') : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-gray-600 text-xs mt-2 whitespace-pre-line">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {visibility.education && education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t('cv.education')}</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-medium text-gray-900">{edu.degree}</span>
                  <span className="text-gray-400 mx-1">{language === 'tr' ? '-' : 'in'}</span>
                  <span className="text-gray-700">{edu.field}</span>
                  <span className="text-gray-400 mx-2">—</span>
                  <span className="text-gray-600">{edu.institution}</span>
                  {edu.gpa && <span className="text-gray-400 ml-2">({edu.gpa})</span>}
                </div>
                <span className="text-gray-400 text-xs">{formatDate(edu.endDate)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {/* Skills */}
        {visibility.skills && skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t('cv.skills')}</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={skill.id} className="text-gray-700 text-xs">
                  {skill.name}{index < skills.length - 1 ? ' •' : ''}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {visibility.languages && languages.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t('cv.languages')}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {languages.map((lang) => (
                <span key={lang.id} className="text-gray-700 text-xs">
                  {lang.name} <span className="text-gray-400">({lang.proficiency})</span>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Certificates */}
      {visibility.certificates && certificates && certificates.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t('cv.certificates')}</h2>
          <div className="flex flex-wrap gap-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center gap-2 text-xs">
                <Award className="w-3 h-3 text-gray-400" />
                <span className="text-gray-700">{cert.name}</span>
                <span className="text-gray-400">({cert.issuer})</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;