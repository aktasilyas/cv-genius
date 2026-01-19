import { CVData, TemplateCustomization, defaultTemplateCustomization } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe, Award } from 'lucide-react';
import { Language } from '@/lib/translations';

interface ModernTemplateProps {
  data: CVData;
  language?: Language;
  t?: (key: string) => string;
  customization?: TemplateCustomization;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ 
  data, 
  language = 'en', 
  t = (key: string) => key,
  customization = defaultTemplateCustomization
}) => {
  const { personalInfo, summary, experience, education, skills, languages, certificates, sectionVisibility, sectionOrder } = data;

  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = language === 'tr' 
      ? ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  // Style calculations based on customization
  const fontFamilyMap: Record<string, string> = {
    inter: "'Inter', sans-serif",
    playfair: "'Playfair Display', serif",
    roboto: "'Roboto', sans-serif",
    opensans: "'Open Sans', sans-serif",
    lato: "'Lato', sans-serif",
    montserrat: "'Montserrat', sans-serif",
  };

  const fontSizeMap = {
    small: { base: '12px', heading: '24px', subheading: '14px' },
    medium: { base: '14px', heading: '28px', subheading: '16px' },
    large: { base: '16px', heading: '32px', subheading: '18px' },
  };

  const spacingMap = {
    compact: { section: '16px', item: '8px', padding: '24px' },
    normal: { section: '24px', item: '12px', padding: '32px' },
    relaxed: { section: '32px', item: '16px', padding: '40px' },
  };

  const borderMap = {
    none: '0px',
    subtle: '2px',
    bold: '4px',
  };

  const styles = {
    fontFamily: fontFamilyMap[customization.fontFamily],
    fontSize: fontSizeMap[customization.fontSize].base,
    backgroundColor: customization.backgroundColor,
    color: customization.textColor,
    padding: spacingMap[customization.spacing].padding,
  };

  const headingStyle = {
    fontSize: fontSizeMap[customization.fontSize].heading,
    color: customization.textColor,
  };

  const accentStyle = {
    color: customization.primaryColor,
  };

  const borderStyle = {
    borderBottomWidth: borderMap[customization.borderStyle],
    borderColor: customization.primaryColor,
  };

  // Sort sections by order
  const sortedSections = [...(sectionOrder || [])].sort((a, b) => a.order - b.order);

  const renderSection = (sectionId: string) => {
    const visibility = sectionVisibility || { summary: true, experience: true, education: true, skills: true, languages: true, certificates: true };
    
    switch (sectionId) {
      case 'summary':
        if (!visibility.summary || !summary) return null;
        return (
          <section key="summary" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 
              className="font-bold pb-2 mb-3" 
              style={{ 
                fontSize: fontSizeMap[customization.fontSize].subheading,
                borderBottomWidth: '1px',
                borderColor: `${customization.primaryColor}40`
              }}
            >
              {t('cv.summary')}
            </h2>
            <p className="leading-relaxed" style={{ color: customization.textColor }}>{summary}</p>
          </section>
        );

      case 'experience':
        if (!visibility.experience || experience.length === 0) return null;
        return (
          <section key="experience" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 
              className="font-bold pb-2 mb-3"
              style={{ 
                fontSize: fontSizeMap[customization.fontSize].subheading,
                borderBottomWidth: '1px',
                borderColor: `${customization.primaryColor}40`
              }}
            >
              {t('cv.experience')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacingMap[customization.spacing].item }}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold" style={{ color: customization.textColor }}>{exp.position || 'Position'}</h3>
                      <p className="font-medium" style={accentStyle}>{exp.company || 'Company'}</p>
                    </div>
                    <span className="text-xs" style={{ color: `${customization.textColor}80` }}>
                      {formatDate(exp.startDate)} - {exp.current ? t('cv.present') : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-xs mt-2 whitespace-pre-line" style={{ color: `${customization.textColor}cc` }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!visibility.education || education.length === 0) return null;
        return (
          <section key="education" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 
              className="font-bold pb-2 mb-3"
              style={{ 
                fontSize: fontSizeMap[customization.fontSize].subheading,
                borderBottomWidth: '1px',
                borderColor: `${customization.primaryColor}40`
              }}
            >
              {t('cv.education')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacingMap[customization.spacing].item }}>
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ color: customization.textColor }}>{edu.degree} in {edu.field}</h3>
                      <p style={accentStyle}>{edu.institution}</p>
                    </div>
                    <span className="text-xs" style={{ color: `${customization.textColor}80` }}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.gpa && <p className="text-xs mt-1" style={{ color: `${customization.textColor}99` }}>GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const renderSidebarSection = (sectionId: string) => {
    const visibility = sectionVisibility || { skills: true, languages: true, certificates: true };

    switch (sectionId) {
      case 'skills':
        if (!visibility.skills || skills.length === 0) return null;
        return (
          <section key="skills" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 
              className="font-bold pb-2 mb-3"
              style={{ 
                fontSize: fontSizeMap[customization.fontSize].subheading,
                borderBottomWidth: '1px',
                borderColor: `${customization.primaryColor}40`
              }}
            >
              {t('cv.skills')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span 
                  key={skill.id} 
                  className="px-2 py-1 rounded text-xs"
                  style={{ 
                    backgroundColor: `${customization.primaryColor}15`,
                    color: customization.primaryColor
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!visibility.languages || languages.length === 0) return null;
        return (
          <section key="languages" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 
              className="font-bold pb-2 mb-3"
              style={{ 
                fontSize: fontSizeMap[customization.fontSize].subheading,
                borderBottomWidth: '1px',
                borderColor: `${customization.primaryColor}40`
              }}
            >
              {t('cv.languages')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between text-xs">
                  <span style={{ color: customization.textColor }}>{lang.name}</span>
                  <span className="capitalize" style={{ color: `${customization.textColor}80` }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'certificates':
        if (!visibility.certificates || !certificates || certificates.length === 0) return null;
        return (
          <section key="certificates" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 
              className="font-bold pb-2 mb-3"
              style={{ 
                fontSize: fontSizeMap[customization.fontSize].subheading,
                borderBottomWidth: '1px',
                borderColor: `${customization.primaryColor}40`
              }}
            >
              {t('cv.certificates')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {certificates.map((cert) => (
                <div key={cert.id} className="text-xs">
                  <div className="flex items-start gap-1">
                    <Award className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: customization.primaryColor }} />
                    <div>
                      <p className="font-medium" style={{ color: customization.textColor }}>{cert.name}</p>
                      <p style={{ color: `${customization.textColor}80` }}>{cert.issuer}</p>
                      {cert.date && <p style={{ color: `${customization.textColor}60` }}>{formatDate(cert.date)}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const mainSections = ['summary', 'experience', 'education'];
  const sidebarSections = ['skills', 'languages', 'certificates'];

  return (
    <div 
      className="min-h-[1123px]"
      style={styles}
    >
      {/* Header */}
      <header 
        className="pb-6 mb-6"
        style={borderStyle}
      >
        <h1 className="font-bold mb-1" style={headingStyle}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="font-medium mb-4" style={{ ...accentStyle, fontSize: fontSizeMap[customization.fontSize].subheading }}>
          {personalInfo.title || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-4 text-xs" style={{ color: `${customization.textColor}99` }}>
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

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2">
          {sortedSections
            .filter(s => mainSections.includes(s.id))
            .map(s => renderSection(s.id))}
        </div>

        {/* Sidebar */}
        <div>
          {sortedSections
            .filter(s => sidebarSections.includes(s.id))
            .map(s => renderSidebarSection(s.id))}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
