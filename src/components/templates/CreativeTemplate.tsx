import { CVData, TemplateCustomization, defaultTemplateCustomization } from '@/types/cv';
import { Award } from 'lucide-react';
import { Language } from '@/lib/translations';

interface CreativeTemplateProps {
  data: CVData;
  language?: Language;
  t?: (key: string) => string;
  customization?: TemplateCustomization;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ 
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
      ? ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
    compact: '16px',
    normal: '24px',
    relaxed: '32px',
  };

  // Create gradient from primary to accent
  const gradientStyle = {
    background: `linear-gradient(to right, ${customization.primaryColor}, ${customization.accentColor})`,
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
      {/* Colorful Header */}
      <header className="text-white p-8" style={gradientStyle}>
        <h1 className="font-bold mb-2" style={{ fontSize: fontSizeMap[customization.fontSize].heading }}>
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
        <div className="text-white p-6 min-h-full" style={{ backgroundColor: customization.textColor }}>
          {/* Skills */}
          {visibility.skills && skills.length > 0 && (
            <section style={{ marginBottom: spacingMap[customization.spacing] }}>
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wider" style={{ color: customization.accentColor }}>
                {t('cv.skills')}
              </h2>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{skill.name}</span>
                      <span className="capitalize" style={{ color: customization.accentColor }}>{skill.level}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${customization.backgroundColor}30` }}>
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          ...gradientStyle,
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
            <section style={{ marginBottom: spacingMap[customization.spacing] }}>
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wider" style={{ color: customization.accentColor }}>
                {t('cv.languages')}
              </h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between text-xs">
                    <span>{lang.name}</span>
                    <span className="capitalize" style={{ color: customization.accentColor }}>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {visibility.education && education.length > 0 && (
            <section style={{ marginBottom: spacingMap[customization.spacing] }}>
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wider" style={{ color: customization.accentColor }}>
                {t('cv.education')}
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-bold text-white">{edu.degree}</p>
                    <p style={{ color: `${customization.backgroundColor}80` }}>{edu.field}</p>
                    <p style={{ color: customization.accentColor }}>{edu.institution}</p>
                    <p style={{ color: `${customization.backgroundColor}60` }}>{formatDate(edu.endDate)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certificates */}
          {visibility.certificates && certificates && certificates.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wider" style={{ color: customization.accentColor }}>
                {t('cv.certificates')}
              </h2>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="text-xs">
                    <div className="flex items-start gap-2">
                      <Award className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: customization.accentColor }} />
                      <div>
                        <p className="font-medium text-white">{cert.name}</p>
                        <p style={{ color: `${customization.backgroundColor}60` }}>{cert.issuer}</p>
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
            <section style={{ marginBottom: spacingMap[customization.spacing] }}>
              <h2 className="text-lg font-bold mb-3 uppercase tracking-wider" style={{ color: customization.primaryColor }}>
                {t('cv.summary')}
              </h2>
              <p className="leading-relaxed" style={{ color: customization.textColor }}>{summary}</p>
            </section>
          )}

          {/* Experience */}
          {visibility.experience && experience.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wider" style={{ color: customization.primaryColor }}>
                {t('cv.experience')}
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div 
                    key={exp.id} 
                    className="relative pl-6"
                    style={{ borderLeftWidth: '2px', borderColor: `${customization.primaryColor}40` }}
                  >
                    <div 
                      className="absolute -left-2 top-0 w-4 h-4 rounded-full"
                      style={gradientStyle}
                    />
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold" style={{ color: customization.textColor }}>{exp.position || 'Position'}</h3>
                        <p className="font-medium" style={{ color: customization.primaryColor }}>{exp.company || 'Company'}</p>
                      </div>
                      <span 
                        className="text-xs px-2 py-1 rounded"
                        style={{ backgroundColor: `${customization.primaryColor}15`, color: customization.textColor }}
                      >
                        {formatDate(exp.startDate)} - {exp.current ? t('cv.present') : formatDate(exp.endDate)}
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
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
