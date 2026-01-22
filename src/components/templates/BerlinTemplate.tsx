import React from 'react';
import { CVData, TemplateCustomization, defaultTemplateCustomization } from '@/types/cv';
import { Mail, Phone, MapPin, Github, Linkedin, Globe } from 'lucide-react';
import { Language } from '@/lib/translations';
import { fontFamilyMap } from '@/domain/entities/TemplateCustomization';

interface BerlinTemplateProps {
  data: CVData;
  language?: Language;
  t?: (key: string) => string;
  customization?: TemplateCustomization;
}

/**
 * BerlinTemplate - Tech/Startup focused CV template
 * Features:
 * - Single column layout for 100% ATS compatibility
 * - GitHub, LinkedIn, Portfolio links in header
 * - Skills displayed as tags (badge style)
 * - Monospace font option (JetBrains Mono)
 * - Color scheme: Navy + Teal accent
 */
const BerlinTemplate: React.FC<BerlinTemplateProps> = ({
  data,
  language = 'en',
  t = (key: string) => key,
  customization = defaultTemplateCustomization
}) => {
  const { personalInfo, summary, experience, education, skills, languages, certificates, sectionVisibility, sectionOrder } = data;

  // Date formatting based on customization
  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');

    if (customization.dateFormat === 'year-only') {
      return year;
    }

    const monthNames = language === 'tr'
      ? ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (customization.dateFormat === 'short') {
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }

    // Full format
    const fullMonthNames = language === 'tr'
      ? ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${fullMonthNames[parseInt(month) - 1]} ${year}`;
  };

  // Style calculations
  const fontSizeMap = {
    small: { base: '11px', heading: '22px', subheading: '13px', name: '26px' },
    medium: { base: '12px', heading: '24px', subheading: '14px', name: '28px' },
    large: { base: '14px', heading: '28px', subheading: '16px', name: '32px' },
  };

  const spacingMap = {
    compact: { section: '14px', item: '8px', padding: '24px' },
    normal: { section: '20px', item: '12px', padding: '32px' },
    relaxed: { section: '28px', item: '16px', padding: '40px' },
  };

  const styles = {
    fontFamily: fontFamilyMap[customization.fontFamily] || fontFamilyMap.inter,
    fontSize: fontSizeMap[customization.fontSize].base,
    backgroundColor: customization.backgroundColor,
    color: customization.textColor,
    padding: spacingMap[customization.spacing].padding,
    lineHeight: '1.5',
  };

  const nameStyles: React.CSSProperties = {
    fontSize: fontSizeMap[customization.fontSize].name,
    color: customization.primaryColor,
    fontWeight: 700,
    textTransform: customization.nameStyle === 'uppercase' ? 'uppercase' :
                   customization.nameStyle === 'small-caps' ? 'uppercase' : 'none',
    letterSpacing: customization.nameStyle === 'small-caps' ? '0.1em' :
                   customization.nameStyle === 'uppercase' ? '0.05em' : 'normal',
    marginBottom: '4px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: fontSizeMap[customization.fontSize].subheading,
    fontWeight: 600,
    color: customization.primaryColor,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: spacingMap[customization.spacing].item,
    paddingBottom: '6px',
    borderBottom: customization.sectionDivider === 'line' ? `2px solid ${customization.accentColor}` : 'none',
    borderLeft: customization.sectionDivider === 'border-left' ? `3px solid ${customization.accentColor}` : 'none',
    paddingLeft: customization.sectionDivider === 'border-left' ? '12px' : '0',
    backgroundColor: customization.sectionDivider === 'background' ? `${customization.primaryColor}10` : 'transparent',
    padding: customization.sectionDivider === 'background' ? '8px 12px' : undefined,
  };

  // Sort sections by order
  const sortedSections = [...(sectionOrder || [])].sort((a, b) => a.order - b.order);
  const visibility = sectionVisibility || {
    personalInfo: true, summary: true, experience: true,
    education: true, skills: true, languages: true, certificates: true
  };

  // Render skills based on skillDisplay setting
  const renderSkills = () => {
    if (!visibility.skills || skills.length === 0) return null;

    const skillContent = () => {
      switch (customization.skillDisplay) {
        case 'tags':
          return (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 rounded-md text-xs font-medium"
                  style={{
                    backgroundColor: `${customization.accentColor}20`,
                    color: customization.primaryColor,
                    border: `1px solid ${customization.accentColor}40`,
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          );
        case 'comma-list':
          return (
            <p style={{ color: customization.textColor }}>
              {skills.map(s => s.name).join(', ')}
            </p>
          );
        case 'bullets':
          return (
            <ul className="list-disc list-inside" style={{ columns: 2, columnGap: '24px' }}>
              {skills.map((skill) => (
                <li key={skill.id} style={{ color: customization.textColor }}>
                  {skill.name}
                </li>
              ))}
            </ul>
          );
        case 'rating-dots':
          return (
            <div className="grid grid-cols-2 gap-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between">
                  <span style={{ color: customization.textColor }}>{skill.name}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <span
                        key={dot}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: dot <= (skill.level === 'expert' ? 5 : skill.level === 'advanced' ? 4 : skill.level === 'intermediate' ? 3 : 2)
                            ? customization.accentColor
                            : `${customization.textColor}30`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <section style={{ marginBottom: spacingMap[customization.spacing].section }}>
        <h2 style={sectionTitleStyle}>{t('cv.skills')}</h2>
        {skillContent()}
      </section>
    );
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        if (!visibility.summary || !summary) return null;
        return (
          <section key="summary" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>{t('cv.summary')}</h2>
            <p className="leading-relaxed" style={{ color: customization.textColor }}>{summary}</p>
          </section>
        );

      case 'experience':
        if (!visibility.experience || experience.length === 0) return null;
        return (
          <section key="experience" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>{t('cv.experience')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacingMap[customization.spacing].item }}>
              {experience.map((exp) => (
                <div key={exp.id} style={{ paddingBottom: spacingMap[customization.spacing].item }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ color: customization.textColor, fontSize: fontSizeMap[customization.fontSize].subheading }}>
                        {exp.position || 'Position'}
                      </h3>
                      <p className="font-medium" style={{ color: customization.accentColor }}>
                        {exp.company || 'Company'}{exp.location ? ` • ${exp.location}` : ''}
                      </p>
                    </div>
                    <span
                      className="text-xs font-medium whitespace-nowrap"
                      style={{ color: `${customization.textColor}80` }}
                    >
                      {formatDate(exp.startDate)} – {exp.current ? t('cv.present') : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-2 whitespace-pre-line" style={{ color: `${customization.textColor}dd`, fontSize: fontSizeMap[customization.fontSize].base }}>
                      {exp.description}
                    </p>
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
            <h2 style={sectionTitleStyle}>{t('cv.education')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacingMap[customization.spacing].item }}>
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ color: customization.textColor }}>
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </h3>
                      <p style={{ color: customization.accentColor }}>{edu.institution}</p>
                    </div>
                    <span className="text-xs" style={{ color: `${customization.textColor}80` }}>
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-xs mt-1" style={{ color: `${customization.textColor}99` }}>
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        return <React.Fragment key="skills">{renderSkills()}</React.Fragment>;

      case 'languages':
        if (!visibility.languages || languages.length === 0) return null;
        return (
          <section key="languages" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>{t('cv.languages')}</h2>
            <div className="flex flex-wrap gap-4">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center gap-2">
                  <span className="font-medium" style={{ color: customization.textColor }}>{lang.name}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${customization.accentColor}20`,
                      color: customization.primaryColor
                    }}
                  >
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'certificates':
        if (!visibility.certificates || !certificates || certificates.length === 0) return null;
        return (
          <section key="certificates" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>{t('cv.certificates')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {certificates.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <span className="font-medium" style={{ color: customization.textColor }}>{cert.name}</span>
                    <span style={{ color: `${customization.textColor}80` }}> – {cert.issuer}</span>
                  </div>
                  {cert.date && (
                    <span className="text-xs" style={{ color: `${customization.textColor}60` }}>
                      {formatDate(cert.date)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // Header text alignment based on headerStyle
  const headerTextAlign = customization.headerStyle === 'centered' ? 'center' as const : 'left' as const;

  // Photo shape styles
  const getPhotoShapeStyle = (): React.CSSProperties => {
    switch (customization.photoShape) {
      case 'circle':
        return { borderRadius: '50%' };
      case 'rounded':
        return { borderRadius: '12px' };
      case 'square':
      default:
        return { borderRadius: '4px' };
    }
  };

  return (
    <div
      className="min-h-[1123px] w-[794px]"
      style={styles}
    >
      {/* Header - Dynamic style based on headerStyle setting */}
      <header
        style={{
          marginBottom: spacingMap[customization.spacing].section,
          textAlign: headerTextAlign,
        }}
      >
        {customization.headerStyle === 'split' ? (
          // Split layout: name/title on left, contact on right
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              {/* Photo for split layout - only show if photo exists */}
              {customization.showPhoto && personalInfo.photo && (
                <div
                  className="flex-shrink-0 overflow-hidden"
                  style={{
                    width: '64px',
                    height: '64px',
                    ...getPhotoShapeStyle(),
                    border: `2px solid ${customization.accentColor}40`,
                  }}
                >
                  <img
                    src={personalInfo.photo}
                    alt={personalInfo.fullName || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h1 style={nameStyles}>
                  {personalInfo.fullName || 'Your Name'}
                </h1>
                <p
                  className="font-medium"
                  style={{
                    color: customization.accentColor,
                    fontSize: fontSizeMap[customization.fontSize].subheading
                  }}
                >
                  {personalInfo.title || 'Professional Title'}
                </p>
              </div>
            </div>
            <div
              className="flex flex-col items-end gap-1 text-xs"
              style={{ color: `${customization.textColor}99` }}
            >
              {personalInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" style={{ color: customization.accentColor }} />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" style={{ color: customization.accentColor }} />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" style={{ color: customization.accentColor }} />
                  {personalInfo.location}
                </span>
              )}
              {(personalInfo.linkedin || personalInfo.website || personalInfo.github) && (
                <>
                  {personalInfo.linkedin && (
                    <span className="flex items-center gap-1">
                      <Linkedin className="w-3 h-3" style={{ color: customization.accentColor }} />
                      {personalInfo.linkedin}
                    </span>
                  )}
                  {personalInfo.website && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" style={{ color: customization.accentColor }} />
                      {personalInfo.website}
                    </span>
                  )}
                  {personalInfo.github && (
                    <span className="flex items-center gap-1">
                      <Github className="w-3 h-3" style={{ color: customization.accentColor }} />
                      {personalInfo.github}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          // Left-aligned or Centered layout
          <>
            <div className={`flex items-start gap-4 ${customization.headerStyle === 'centered' ? 'justify-center' : ''}`}>
              {/* Photo for left-aligned/centered layout - only show if photo exists */}
              {customization.showPhoto && personalInfo.photo && (
                <div
                  className="flex-shrink-0 overflow-hidden"
                  style={{
                    width: '72px',
                    height: '72px',
                    ...getPhotoShapeStyle(),
                    border: `2px solid ${customization.accentColor}40`,
                  }}
                >
                  <img
                    src={personalInfo.photo}
                    alt={personalInfo.fullName || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className={customization.headerStyle === 'centered' && !customization.showPhoto ? 'text-center' : ''}>
                <h1 style={nameStyles}>
                  {personalInfo.fullName || 'Your Name'}
                </h1>
                <p
                  className="font-medium mb-3"
                  style={{
                    color: customization.accentColor,
                    fontSize: fontSizeMap[customization.fontSize].subheading
                  }}
                >
                  {personalInfo.title || 'Professional Title'}
                </p>
              </div>
            </div>

            {/* Contact Info - Inline for ATS compatibility */}
            <div
              className={`flex flex-wrap gap-x-4 gap-y-1 text-xs mt-3 ${
                customization.headerStyle === 'centered' ? 'justify-center' : ''
              }`}
              style={{ color: `${customization.textColor}99` }}
            >
              {personalInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" style={{ color: customization.accentColor }} />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" style={{ color: customization.accentColor }} />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" style={{ color: customization.accentColor }} />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin className="w-3 h-3" style={{ color: customization.accentColor }} />
                  {personalInfo.linkedin}
                </span>
              )}
              {personalInfo.website && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" style={{ color: customization.accentColor }} />
                  {personalInfo.website}
                </span>
              )}
              {personalInfo.github && (
                <span className="flex items-center gap-1">
                  <Github className="w-3 h-3" style={{ color: customization.accentColor }} />
                  {personalInfo.github}
                </span>
              )}
            </div>
          </>
        )}
      </header>

      {/* Divider line under header */}
      <div
        style={{
          height: '2px',
          backgroundColor: customization.primaryColor,
          marginBottom: spacingMap[customization.spacing].section
        }}
      />

      {/* Content - Single column for ATS */}
      <div>
        {sortedSections.map(s => renderSection(s.id))}
      </div>
    </div>
  );
};

export default BerlinTemplate;
