import { CVData, TemplateCustomization, defaultTemplateCustomization } from '@/types/cv';
import { Award, User } from 'lucide-react';
import { Language } from '@/lib/translations';

interface MinimalTemplateProps {
  data: CVData;
  language?: Language;
  t?: (key: string) => string;
  customization?: TemplateCustomization;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ 
  data, 
  language = 'en', 
  t = (key: string) => key,
  customization = defaultTemplateCustomization
}) => {
  const { personalInfo, summary, experience, education, skills, languages, certificates, sectionVisibility } = data;

  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    return `${month}/${year}`;
  };

  const visibility = sectionVisibility || { summary: true, experience: true, education: true, skills: true, languages: true, certificates: true };

  // Style calculations
  const fontFamilyMap: Record<string, string> = {
    inter: "'Inter', sans-serif",
    playfair: "'Playfair Display', serif",
    roboto: "'Roboto', sans-serif",
    opensans: "'Open Sans', sans-serif",
    lato: "'Lato', sans-serif",
    montserrat: "'Montserrat', sans-serif",
  };

  const fontSizeMap = {
    small: { base: '12px', heading: '28px', section: '10px' },
    medium: { base: '14px', heading: '32px', section: '12px' },
    large: { base: '16px', heading: '36px', section: '14px' },
  };

  const spacingMap = {
    compact: '24px',
    normal: '32px',
    relaxed: '40px',
  };

  return (
    <div 
      className="min-h-[1123px]"
      style={{
        fontFamily: fontFamilyMap[customization.fontFamily],
        fontSize: fontSizeMap[customization.fontSize].base,
        backgroundColor: customization.backgroundColor,
        color: customization.textColor,
        padding: spacingMap[customization.spacing],
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: spacingMap[customization.spacing] }}>
        <div className="flex items-start gap-4">
          {/* Photo - only show if photo exists */}
          {customization.showPhoto && personalInfo.photo && (
            <div
              className="flex-shrink-0"
              style={{
                width: '70px',
                height: '70px',
                borderRadius: customization.photoShape === 'circle' ? '50%' :
                             customization.photoShape === 'rounded' ? '6px' : '0',
                overflow: 'hidden',
                border: `1px solid ${customization.textColor}20`,
              }}
            >
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName || 'Profile'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
          <div className="flex-1">
            <h1
              className="font-light tracking-tight mb-1"
              style={{ fontSize: fontSizeMap[customization.fontSize].heading, color: customization.textColor }}
            >
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="mb-4" style={{ fontSize: '16px', color: `${customization.textColor}80` }}>
              {personalInfo.title || 'Professional Title'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs" style={{ color: `${customization.textColor}80` }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex gap-4 text-xs mt-1" style={{ color: `${customization.textColor}80` }}>
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>•</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {visibility.summary && summary && (
        <section style={{ marginBottom: spacingMap[customization.spacing] }}>
          <p 
            className="leading-relaxed pl-4"
            style={{ 
              color: `${customization.textColor}cc`,
              borderLeftWidth: '2px',
              borderColor: `${customization.primaryColor}40`
            }}
          >
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {visibility.experience && experience.length > 0 && (
        <section style={{ marginBottom: spacingMap[customization.spacing] }}>
          <h2 
            className="font-bold uppercase tracking-widest mb-4"
            style={{ fontSize: fontSizeMap[customization.fontSize].section, color: `${customization.textColor}80` }}
          >
            {t('cv.experience')}
          </h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <span className="font-medium" style={{ color: customization.textColor }}>{exp.position || 'Position'}</span>
                    <span className="mx-2" style={{ color: `${customization.textColor}60` }}>{language === 'tr' ? '-' : 'at'}</span>
                    <span style={{ color: customization.primaryColor }}>{exp.company || 'Company'}</span>
                  </div>
                  <span className="text-xs" style={{ color: `${customization.textColor}60` }}>
                    {formatDate(exp.startDate)} – {exp.current ? t('cv.present') : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs mt-2 whitespace-pre-line" style={{ color: `${customization.textColor}99` }}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {visibility.education && education.length > 0 && (
        <section style={{ marginBottom: spacingMap[customization.spacing] }}>
          <h2 
            className="font-bold uppercase tracking-widest mb-4"
            style={{ fontSize: fontSizeMap[customization.fontSize].section, color: `${customization.textColor}80` }}
          >
            {t('cv.education')}
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-medium" style={{ color: customization.textColor }}>{edu.degree}</span>
                  <span className="mx-1" style={{ color: `${customization.textColor}60` }}>{language === 'tr' ? '-' : 'in'}</span>
                  <span style={{ color: customization.primaryColor }}>{edu.field}</span>
                  <span className="mx-2" style={{ color: `${customization.textColor}60` }}>—</span>
                  <span style={{ color: `${customization.textColor}99` }}>{edu.institution}</span>
                  {edu.gpa && <span className="ml-2" style={{ color: `${customization.textColor}60` }}>({edu.gpa})</span>}
                </div>
                <span className="text-xs" style={{ color: `${customization.textColor}60` }}>{formatDate(edu.endDate)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {/* Skills */}
        {visibility.skills && skills.length > 0 && (
          <section>
            <h2 
              className="font-bold uppercase tracking-widest mb-4"
              style={{ fontSize: fontSizeMap[customization.fontSize].section, color: `${customization.textColor}80` }}
            >
              {t('cv.skills')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={skill.id} className="text-xs" style={{ color: customization.primaryColor }}>
                  {skill.name}{index < skills.length - 1 ? ' •' : ''}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {visibility.languages && languages.length > 0 && (
          <section>
            <h2 
              className="font-bold uppercase tracking-widest mb-4"
              style={{ fontSize: fontSizeMap[customization.fontSize].section, color: `${customization.textColor}80` }}
            >
              {t('cv.languages')}
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {languages.map((lang) => (
                <span key={lang.id} className="text-xs" style={{ color: customization.textColor }}>
                  {lang.name} <span style={{ color: `${customization.textColor}60` }}>({lang.proficiency})</span>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Certificates */}
      {visibility.certificates && certificates && certificates.length > 0 && (
        <section style={{ marginTop: spacingMap[customization.spacing] }}>
          <h2 
            className="font-bold uppercase tracking-widest mb-4"
            style={{ fontSize: fontSizeMap[customization.fontSize].section, color: `${customization.textColor}80` }}
          >
            {t('cv.certificates')}
          </h2>
          <div className="flex flex-wrap gap-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center gap-2 text-xs">
                <Award className="w-3 h-3" style={{ color: customization.primaryColor }} />
                <span style={{ color: customization.textColor }}>{cert.name}</span>
                <span style={{ color: `${customization.textColor}60` }}>({cert.issuer})</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
