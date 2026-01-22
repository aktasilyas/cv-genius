import React from 'react';
import { CVData, TemplateCustomization, defaultTemplateCustomization } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe, BookOpen, Award } from 'lucide-react';
import { Language } from '@/lib/translations';
import { fontFamilyMap } from '@/domain/entities/TemplateCustomization';

interface TokyoTemplateProps {
  data: CVData;
  language?: Language;
  t?: (key: string) => string;
  customization?: TemplateCustomization;
}

/**
 * TokyoTemplate - Academic/Research focused CV template
 * Features:
 * - Single column, detailed layout
 * - Publications section
 * - Conferences section
 * - Research interests
 * - Traditional serif typography
 * - Color scheme: Navy + Gold accent
 */
const TokyoTemplate: React.FC<TokyoTemplateProps> = ({
  data,
  language = 'en',
  t = (key: string) => key,
  customization = defaultTemplateCustomization
}) => {
  const { personalInfo, summary, experience, education, skills, languages, certificates, sectionVisibility, sectionOrder } = data;

  // Date formatting
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
    compact: { section: '16px', item: '10px', padding: '32px 40px' },
    normal: { section: '22px', item: '14px', padding: '40px 48px' },
    relaxed: { section: '28px', item: '18px', padding: '48px 56px' },
  };

  const styles: React.CSSProperties = {
    fontFamily: fontFamilyMap[customization.fontFamily] || fontFamilyMap.merriweather,
    fontSize: fontSizeMap[customization.fontSize].base,
    backgroundColor: customization.backgroundColor,
    color: customization.textColor,
    padding: spacingMap[customization.spacing].padding,
    lineHeight: '1.7',
  };

  const nameStyles: React.CSSProperties = {
    fontSize: fontSizeMap[customization.fontSize].name,
    color: customization.primaryColor,
    fontWeight: 700,
    textTransform: customization.nameStyle === 'uppercase' ? 'uppercase' :
                   customization.nameStyle === 'small-caps' ? 'uppercase' : 'none',
    letterSpacing: customization.nameStyle === 'small-caps' ? '0.12em' : '0.02em',
    marginBottom: '4px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: fontSizeMap[customization.fontSize].subheading,
    fontWeight: 700,
    color: customization.primaryColor,
    letterSpacing: '0.05em',
    marginBottom: spacingMap[customization.spacing].item,
    paddingBottom: '8px',
    borderBottom: customization.sectionDivider === 'line' ? `2px solid ${customization.accentColor}` : 'none',
    borderLeft: customization.sectionDivider === 'border-left' ? `4px solid ${customization.accentColor}` : 'none',
    paddingLeft: customization.sectionDivider === 'border-left' ? '16px' : '0',
    backgroundColor: customization.sectionDivider === 'background' ? `${customization.accentColor}10` : 'transparent',
    padding: customization.sectionDivider === 'background' ? '10px 16px' : undefined,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  // Visibility
  const visibility = sectionVisibility || {
    personalInfo: true, summary: true, experience: true,
    education: true, skills: true, languages: true, certificates: true
  };

  // Sort sections
  const sortedSections = [...(sectionOrder || [])].sort((a, b) => a.order - b.order);

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

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        // Research Interests / Summary
        if (!visibility.summary || !summary) return null;
        return (
          <section key="summary" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>
              <BookOpen className="w-4 h-4" style={{ color: customization.accentColor }} />
              {language === 'tr' ? 'Araştırma İlgi Alanları' : 'Research Interests'}
            </h2>
            <p
              className="leading-relaxed"
              style={{
                color: customization.textColor,
                textAlign: 'justify',
                textIndent: '2em',
              }}
            >
              {summary}
            </p>
          </section>
        );

      case 'education':
        // Education is prioritized in academic CVs
        if (!visibility.education || education.length === 0) return null;
        return (
          <section key="education" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>
              <Award className="w-4 h-4" style={{ color: customization.accentColor }} />
              {t('cv.education')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacingMap[customization.spacing].item }}>
              {education.map((edu) => (
                <div
                  key={edu.id}
                  style={{
                    paddingLeft: '16px',
                    borderLeft: `2px solid ${customization.accentColor}30`,
                  }}
                >
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold" style={{ color: customization.textColor }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </h3>
                    <span
                      className="text-xs font-medium"
                      style={{ color: `${customization.textColor}80` }}
                    >
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </span>
                  </div>
                  <p style={{ color: customization.accentColor, fontStyle: 'italic' }}>
                    {edu.institution}
                  </p>
                  {edu.gpa && (
                    <p className="text-sm mt-1" style={{ color: `${customization.textColor}99` }}>
                      GPA: <strong>{edu.gpa}</strong>
                    </p>
                  )}
                  {edu.thesis && (
                    <p className="text-sm mt-1" style={{ color: `${customization.textColor}cc` }}>
                      <em>Thesis:</em> {edu.thesis}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'experience':
        // Academic positions / Work experience
        if (!visibility.experience || experience.length === 0) return null;
        return (
          <section key="experience" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>
              {language === 'tr' ? 'Akademik Pozisyonlar' : 'Academic Positions'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacingMap[customization.spacing].item }}>
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    paddingLeft: '16px',
                    borderLeft: `2px solid ${customization.accentColor}30`,
                  }}
                >
                  <div className="flex justify-between items-baseline">
                    <h3
                      className="font-bold"
                      style={{
                        color: customization.textColor,
                        fontSize: fontSizeMap[customization.fontSize].subheading
                      }}
                    >
                      {exp.position || 'Position'}
                    </h3>
                    <span
                      className="text-xs"
                      style={{ color: `${customization.textColor}80` }}
                    >
                      {formatDate(exp.startDate)} – {exp.current ? t('cv.present') : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p style={{ color: customization.accentColor, fontStyle: 'italic' }}>
                    {exp.company || 'Institution'}{exp.location ? `, ${exp.location}` : ''}
                  </p>
                  {exp.description && (
                    <p
                      className="mt-2 whitespace-pre-line"
                      style={{
                        color: `${customization.textColor}dd`,
                        fontSize: fontSizeMap[customization.fontSize].base,
                        textAlign: 'justify',
                      }}
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'certificates':
        // Publications / Certificates section repurposed
        if (!visibility.certificates || !certificates || certificates.length === 0) return null;
        return (
          <section key="certificates" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>
              <BookOpen className="w-4 h-4" style={{ color: customization.accentColor }} />
              {language === 'tr' ? 'Yayınlar & Sertifikalar' : 'Publications & Certifications'}
            </h2>
            <ol
              style={{
                listStyleType: 'decimal',
                paddingLeft: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {certificates.map((cert, index) => (
                <li
                  key={cert.id}
                  style={{
                    color: customization.textColor,
                    textAlign: 'justify',
                  }}
                >
                  <span className="font-medium">{cert.name}</span>
                  {cert.issuer && (
                    <span style={{ color: `${customization.textColor}99` }}>
                      . <em>{cert.issuer}</em>
                    </span>
                  )}
                  {cert.date && (
                    <span style={{ color: `${customization.textColor}80` }}>
                      {' '}({formatDate(cert.date)})
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </section>
        );

      case 'skills':
        // Research skills / Technical skills
        if (!visibility.skills || skills.length === 0) return null;
        return (
          <section key="skills" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>
              {language === 'tr' ? 'Teknik Beceriler' : 'Technical Skills'}
            </h2>
            {customization.skillDisplay === 'tags' ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 text-xs"
                    style={{
                      backgroundColor: `${customization.accentColor}15`,
                      color: customization.primaryColor,
                      border: `1px solid ${customization.accentColor}40`,
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : customization.skillDisplay === 'comma-list' ? (
              <p style={{ color: customization.textColor }}>
                {skills.map(s => s.name).join('; ')}
              </p>
            ) : (
              <ul className="list-disc list-inside" style={{ columns: 2, columnGap: '32px' }}>
                {skills.map((skill) => (
                  <li key={skill.id} style={{ color: customization.textColor, marginBottom: '4px' }}>
                    {skill.name}
                  </li>
                ))}
              </ul>
            )}
          </section>
        );

      case 'languages':
        if (!visibility.languages || languages.length === 0) return null;
        return (
          <section key="languages" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>
              {t('cv.languages')}
            </h2>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {languages.map((lang) => (
                <div key={lang.id}>
                  <span className="font-medium" style={{ color: customization.textColor }}>
                    {lang.name}
                  </span>
                  <span style={{ color: `${customization.textColor}80` }}>
                    {' '}– {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-[1123px] w-[794px]"
      style={styles}
    >
      {/* Header - Academic style with headerStyle support */}
      <header
        style={{
          marginBottom: spacingMap[customization.spacing].section,
          textAlign: customization.headerStyle === 'left-aligned' ? 'left' : 'center',
          paddingBottom: spacingMap[customization.spacing].item,
        }}
      >
        {customization.headerStyle === 'split' ? (
          // Split layout for academic CV
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
                    border: `2px solid ${customization.accentColor}30`,
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
                <h1 style={{ ...nameStyles, textAlign: 'left' }}>
                  {personalInfo.fullName || 'Your Name'}
                </h1>
                <p
                  style={{
                    color: customization.accentColor,
                    fontSize: fontSizeMap[customization.fontSize].subheading,
                    fontStyle: 'italic',
                  }}
                >
                  {personalInfo.title || 'Academic Title / Position'}
                </p>
              </div>
            </div>
            <div
              className="flex flex-col items-end gap-1 text-xs"
              style={{ color: `${customization.textColor}99` }}
            >
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
          </div>
        ) : (
          // Left-aligned or Centered layout
          <>
            <div className={`flex items-start gap-4 ${customization.headerStyle !== 'left-aligned' ? 'justify-center' : ''}`}>
              {/* Photo for left-aligned/centered layout - only show if photo exists */}
              {customization.showPhoto && personalInfo.photo && (
                <div
                  className="flex-shrink-0 overflow-hidden"
                  style={{
                    width: '72px',
                    height: '72px',
                    ...getPhotoShapeStyle(),
                    border: `2px solid ${customization.accentColor}30`,
                  }}
                >
                  <img
                    src={personalInfo.photo}
                    alt={personalInfo.fullName || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className={customization.headerStyle !== 'left-aligned' && !customization.showPhoto ? 'text-center' : ''}>
                <h1 style={nameStyles}>
                  {personalInfo.fullName || 'Your Name'}
                </h1>
                <p
                  style={{
                    color: customization.accentColor,
                    fontSize: fontSizeMap[customization.fontSize].subheading,
                    fontStyle: 'italic',
                    marginBottom: '12px',
                  }}
                >
                  {personalInfo.title || 'Academic Title / Position'}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div
              className={`flex flex-wrap gap-x-4 gap-y-1 text-xs mt-2 ${
                customization.headerStyle === 'left-aligned' ? '' : 'justify-center'
              }`}
              style={{ color: `${customization.textColor}99` }}
            >
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
          </>
        )}

        {/* Decorative line */}
        <div
          style={{
            marginTop: '16px',
            height: '2px',
            background: customization.headerStyle === 'left-aligned'
              ? customization.accentColor
              : `linear-gradient(90deg, transparent, ${customization.accentColor}, transparent)`,
          }}
        />
      </header>

      {/* Content - Academic order: Education first */}
      <div>
        {sortedSections.map(s => renderSection(s.id))}
      </div>
    </div>
  );
};

export default TokyoTemplate;
