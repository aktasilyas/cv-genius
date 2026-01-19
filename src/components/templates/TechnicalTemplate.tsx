import { CVData, TemplateCustomization, defaultTemplateCustomization } from '@/types/cv';
import { Award } from 'lucide-react';
import { Language } from '@/lib/translations';

interface TechnicalTemplateProps {
  data: CVData;
  language?: Language;
  t?: (key: string) => string;
  customization?: TemplateCustomization;
}

const TechnicalTemplate: React.FC<TechnicalTemplateProps> = ({ 
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

  const getSkillLevel = (level: string) => {
    switch (level) {
      case 'expert': return 5;
      case 'advanced': return 4;
      case 'intermediate': return 3;
      case 'beginner': return 2;
      default: return 3;
    }
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
    small: { base: '12px', heading: '24px' },
    medium: { base: '14px', heading: '28px' },
    large: { base: '16px', heading: '32px' },
  };

  const spacingMap = {
    compact: '16px',
    normal: '24px',
    relaxed: '32px',
  };

  const borderMap = {
    none: '0px',
    subtle: '2px',
    bold: '4px',
  };

  return (
    <div 
      className="min-h-[1123px] font-mono"
      style={{
        fontFamily: customization.fontFamily === 'inter' ? "'Fira Code', monospace" : fontFamilyMap[customization.fontFamily],
        fontSize: fontSizeMap[customization.fontSize].base,
        backgroundColor: customization.backgroundColor,
        color: customization.textColor,
        padding: spacingMap[customization.spacing],
      }}
    >
      {/* Header */}
      <header 
        className="mb-6 pb-4"
        style={{ 
          borderBottomWidth: borderMap[customization.borderStyle],
          borderColor: customization.primaryColor
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold" style={{ fontSize: fontSizeMap[customization.fontSize].heading, color: customization.textColor }}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-lg font-medium" style={{ color: customization.primaryColor }}>
              {personalInfo.title || 'Professional Title'}
            </p>
          </div>
          <div className="text-right text-xs space-y-1" style={{ color: `${customization.textColor}99` }}>
            {personalInfo.email && <div className="font-mono">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div style={{ color: customization.primaryColor }}>{personalInfo.linkedin}</div>}
            {personalInfo.website && <div style={{ color: customization.primaryColor }}>{personalInfo.website}</div>}
          </div>
        </div>
      </header>

      {/* Summary */}
      {visibility.summary && summary && (
        <section style={{ marginBottom: spacingMap[customization.spacing] }}>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: customization.primaryColor }}>
            <span style={{ color: `${customization.textColor}60` }}>&gt;</span> {t('cv.summary')}
          </h2>
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

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Experience */}
          {visibility.experience && experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: customization.primaryColor }}>
                <span style={{ color: `${customization.textColor}60` }}>&gt;</span> {t('cv.experience')}
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div 
                    key={exp.id} 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: `${customization.primaryColor}08` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold" style={{ color: customization.textColor }}>{exp.position || 'Position'}</h3>
                        <p className="text-xs" style={{ color: customization.primaryColor }}>{exp.company || 'Company'}</p>
                      </div>
                      <code 
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${customization.textColor}15`, color: `${customization.textColor}80` }}
                      >
                        {formatDate(exp.startDate)} → {exp.current ? t('cv.present').toLowerCase() : formatDate(exp.endDate)}
                      </code>
                    </div>
                    {exp.description && (
                      <p className="text-xs whitespace-pre-line font-sans" style={{ color: `${customization.textColor}99` }}>{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {visibility.education && education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: customization.primaryColor }}>
                <span style={{ color: `${customization.textColor}60` }}>&gt;</span> {t('cv.education')}
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div 
                    key={edu.id} 
                    className="flex justify-between items-start p-3 rounded-lg"
                    style={{ backgroundColor: `${customization.primaryColor}08` }}
                  >
                    <div>
                      <h3 className="font-bold" style={{ color: customization.textColor }}>{edu.degree} in {edu.field}</h3>
                      <p className="text-xs" style={{ color: customization.primaryColor }}>{edu.institution}</p>
                    </div>
                    <div className="text-right">
                      <code className="text-xs" style={{ color: `${customization.textColor}80` }}>{formatDate(edu.endDate)}</code>
                      {edu.gpa && <p className="text-xs" style={{ color: `${customization.textColor}60` }}>GPA: {edu.gpa}</p>}
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
          {visibility.skills && skills.length > 0 && (
            <section 
              className="text-white p-4 rounded-lg"
              style={{ backgroundColor: customization.textColor }}
            >
              <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: customization.primaryColor }}>
                // {t('cv.skills')}
              </h2>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: `${customization.backgroundColor}cc` }}>{skill.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className="h-1.5 flex-1 rounded"
                          style={{ 
                            backgroundColor: level <= getSkillLevel(skill.level) 
                              ? customization.primaryColor 
                              : `${customization.backgroundColor}30`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {visibility.languages && languages.length > 0 && (
            <section 
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${customization.primaryColor}15` }}
            >
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: customization.primaryColor }}>
                // {t('cv.languages')}
              </h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between text-xs">
                    <span style={{ color: customization.textColor }}>{lang.name}</span>
                    <code style={{ color: customization.primaryColor }}>{lang.proficiency}</code>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certificates */}
          {visibility.certificates && certificates && certificates.length > 0 && (
            <section 
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${customization.accentColor}15` }}
            >
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: customization.primaryColor }}>
                // {t('cv.certificates')}
              </h2>
              <div className="space-y-2">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-start gap-2 text-xs">
                    <Award className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: customization.primaryColor }} />
                    <div>
                      <p className="font-medium" style={{ color: customization.textColor }}>{cert.name}</p>
                      <p style={{ color: `${customization.textColor}80` }}>{cert.issuer}</p>
                    </div>
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
