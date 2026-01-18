import { CVData } from '@/types/cv';
import { Award } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface CreativeTemplateProps {
  data: CVData;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, languages, certificates, sectionVisibility } = data;
  const { t, language } = useSettings();

  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = language === 'tr' 
      ? ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const visibility = sectionVisibility || { summary: true, experience: true, education: true, skills: true, languages: true, certificates: true };

  return (
    <div className="bg-white text-gray-900 min-h-[1123px] font-sans text-sm">
      {/* Colorful Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-xl text-white/90 mb-4">
          {personalInfo.title || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-4 text-white/80 text-xs">
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>☎ {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>💼 {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
        </div>
      </header>

      <div className="grid grid-cols-3">
        {/* Sidebar */}
        <div className="bg-gray-900 text-white p-6 min-h-full">
          {/* Skills */}
          {visibility.skills && skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-pink-400 mb-4 uppercase tracking-wider">{t('cv.skills')}</h2>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{skill.name}</span>
                      <span className="text-pink-400 capitalize">{skill.level}</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ 
                          width: skill.level === 'expert' ? '100%' : 
                                 skill.level === 'advanced' ? '80%' :
                                 skill.level === 'intermediate' ? '60%' : '40%'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {visibility.languages && languages.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-pink-400 mb-4 uppercase tracking-wider">{t('cv.languages')}</h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between text-xs">
                    <span>{lang.name}</span>
                    <span className="text-pink-400 capitalize">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {visibility.education && education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-pink-400 mb-4 uppercase tracking-wider">{t('cv.education')}</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-bold text-white">{edu.degree}</p>
                    <p className="text-gray-400">{edu.field}</p>
                    <p className="text-pink-400">{edu.institution}</p>
                    <p className="text-gray-500">{formatDate(edu.endDate)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certificates */}
          {visibility.certificates && certificates && certificates.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-pink-400 mb-4 uppercase tracking-wider">{t('cv.certificates')}</h2>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="text-xs">
                    <div className="flex items-start gap-2">
                      <Award className="w-3 h-3 text-pink-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">{cert.name}</p>
                        <p className="text-gray-400">{cert.issuer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-2 p-8">
          {/* Summary */}
          {visibility.summary && summary && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-purple-600 mb-3 uppercase tracking-wider">{t('cv.summary')}</h2>
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {visibility.experience && experience.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-purple-600 mb-4 uppercase tracking-wider">{t('cv.experience')}</h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-purple-200">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900">{exp.position || 'Position'}</h3>
                        <p className="text-purple-600 font-medium">{exp.company || 'Company'}</p>
                      </div>
                      <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                        {formatDate(exp.startDate)} - {exp.current ? t('cv.present') : formatDate(exp.endDate)}
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
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;