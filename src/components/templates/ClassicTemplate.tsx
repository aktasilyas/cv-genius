import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe, Award } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface ClassicTemplateProps {
  data: CVData;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, languages, certificates, sectionVisibility, sectionOrder } = data;
  const { t, language } = useSettings();

  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = language === 'tr' 
      ? ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const visibility = sectionVisibility || { summary: true, experience: true, education: true, skills: true, languages: true, certificates: true };

  return (
    <div className="bg-white text-gray-900 p-8 min-h-[1123px] font-serif text-sm">
      {/* Header */}
      <header className="text-center border-b-2 border-gray-800 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-lg text-gray-600 italic mb-4">
          {personalInfo.title || 'Professional Title'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-gray-600 text-xs">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {personalInfo.website}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {visibility.summary && summary && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider mb-3">{t('cv.summary')}</h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {visibility.experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider mb-3">{t('cv.experience')}</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{exp.position || 'Position'}</h3>
                  <span className="text-gray-500 text-xs italic">
                    {formatDate(exp.startDate)} — {exp.current ? t('cv.present') : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="text-gray-600 italic mb-2">{exp.company || 'Company'}</p>
                {exp.description && (
                  <p className="text-gray-700 text-xs whitespace-pre-line">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {visibility.education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider mb-3">{t('cv.education')}</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                  <span className="text-gray-500 text-xs italic">
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="text-gray-600 italic">
                  {edu.degree} in {edu.field}
                  {edu.gpa && `, GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Skills */}
        {visibility.skills && skills.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider mb-3">{t('cv.skills')}</h2>
            <ul className="list-disc list-inside text-gray-700 text-xs space-y-1">
              {skills.map((skill) => (
                <li key={skill.id}>
                  {skill.name} <span className="text-gray-500">({skill.level})</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages */}
        {visibility.languages && languages.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider mb-3">{t('cv.languages')}</h2>
            <ul className="list-disc list-inside text-gray-700 text-xs space-y-1">
              {languages.map((lang) => (
                <li key={lang.id}>
                  {lang.name} <span className="text-gray-500">({lang.proficiency})</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Certificates */}
      {visibility.certificates && certificates && certificates.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider mb-3">{t('cv.certificates')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-start gap-2 text-xs">
                <Award className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-gray-500">{cert.issuer} • {formatDate(cert.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;