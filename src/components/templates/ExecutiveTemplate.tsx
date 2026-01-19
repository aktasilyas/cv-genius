import { CVData, TemplateCustomization, defaultTemplateCustomization } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe, Award } from 'lucide-react';
import { Language } from '@/lib/translations';

interface ExecutiveTemplateProps {
  data: CVData;
  language?: Language;
  t?: (key: string) => string;
  customization?: TemplateCustomization;
}

const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({ 
  data, 
  language = 'en', 
  t = (key: string) => key,
  customization = defaultTemplateCustomization
}) => {
  const { personalInfo, summary, experience, education, skills, languages, certificates, sectionVisibility } = data;

  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = language === 'tr' 
      ? ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
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
    small: { base: '12px', heading: '28px' },
    medium: { base: '14px', heading: '32px' },
    large: { base: '16px', heading: '36px' },
  };

  const spacingMap = {
    compact: '24px',
    normal: '40px',
    relaxed: '48px',
  };

  return (
    <div 
      className="min-h-[1123px]"
      style={{
        fontFamily: fontFamilyMap[customization.fontFamily],
        fontSize: fontSizeMap[customization.fontSize].base,
        backgroundColor: customization.backgroundColor,
      }}
    >
      {/* Sophisticated Header */}
      <header className="text-white p-10" style={{ backgroundColor: customization.textColor }}>
        <div className="max-w-3xl mx-auto text-center">
          <h1 
            className="font-light tracking-widest uppercase mb-2"
            style={{ fontSize: fontSizeMap[customization.fontSize].heading }}
          >
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="w-24 h-0.5 mx-auto my-4" style={{ backgroundColor: customization.accentColor }} />
          <p className="text-lg tracking-wide mb-6" style={{ color: customization.accentColor }}>
            {personalInfo.title || 'Professional Title'}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs" style={{ color: `${customization.backgroundColor}cc` }}>
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
          </div>
        </div>
      </header>

      <div className="p-10 max-w-4xl mx-auto">
        {/* Executive Summary */}
        {visibility.summary && summary && (
          <section className="text-center" style={{ marginBottom: spacingMap[customization.spacing] }}>
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-4" style={{ color: customization.textColor }}>
              {t('cv.summary')}
            </h2>
            <p className="leading-relaxed italic" style={{ color: `${customization.textColor}99` }}>{summary}</p>
          </section>
        )}

        <div className="w-full h-px my-8" style={{ backgroundColor: `${customization.textColor}30` }} />

        {/* Experience */}
        {visibility.experience && experience.length > 0 && (
          <section style={{ marginBottom: spacingMap[customization.spacing] }}>
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-6 text-center" style={{ color: customization.textColor }}>
              {t('cv.experience')}
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div 
                  key={exp.id} 
                  className="pl-6"
                  style={{ borderLeftWidth: '2px', borderColor: customization.accentColor }}
                >
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: customization.textColor }}>{exp.position || 'Position'}</h3>
                      <p style={{ color: customization.primaryColor }}>{exp.company || 'Company'}</p>
                    </div>
                    <span className="text-xs" style={{ color: `${customization.textColor}80` }}>
                      {formatDate(exp.startDate)} — {exp.current ? t('cv.present') : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-xs whitespace-pre-line" style={{ color: `${customization.textColor}99` }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-10">
          {/* Education */}
          {visibility.education && education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-4" style={{ color: customization.textColor }}>
                {t('cv.education')}
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-semibold" style={{ color: customization.textColor }}>{edu.institution}</h3>
                    <p className="text-xs" style={{ color: customization.primaryColor }}>{edu.degree} in {edu.field}</p>
                    <p className="text-xs" style={{ color: `${customization.textColor}80` }}>{formatDate(edu.endDate)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="space-y-8">
            {/* Core Competencies */}
            {visibility.skills && skills.length > 0 && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-4" style={{ color: customization.textColor }}>
                  {t('cv.skills')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span 
                      key={skill.id} 
                      className="px-3 py-1 text-xs border"
                      style={{ 
                        backgroundColor: `${customization.primaryColor}10`,
                        borderColor: `${customization.primaryColor}30`,
                        color: customization.textColor
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {visibility.languages && languages.length > 0 && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-4" style={{ color: customization.textColor }}>
                  {t('cv.languages')}
                </h2>
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between text-xs">
                      <span style={{ color: customization.textColor }}>{lang.name}</span>
                      <span className="capitalize" style={{ color: customization.primaryColor }}>{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Certificates */}
        {visibility.certificates && certificates && certificates.length > 0 && (
          <section style={{ marginTop: spacingMap[customization.spacing] }}>
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-4 text-center" style={{ color: customization.textColor }}>
              {t('cv.certificates')}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {certificates.map((cert) => (
                <div 
                  key={cert.id} 
                  className="flex items-center gap-2 px-4 py-2 border text-xs"
                  style={{ 
                    backgroundColor: `${customization.primaryColor}05`,
                    borderColor: `${customization.primaryColor}30`
                  }}
                >
                  <Award className="w-4 h-4" style={{ color: customization.accentColor }} />
                  <div>
                    <span className="font-medium" style={{ color: customization.textColor }}>{cert.name}</span>
                    <span className="ml-2" style={{ color: `${customization.textColor}80` }}>{cert.issuer}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
