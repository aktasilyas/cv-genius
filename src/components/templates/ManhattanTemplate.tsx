import React from 'react';
import { CVData, TemplateCustomization, defaultTemplateCustomization } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Award } from 'lucide-react';
import { Language } from '@/lib/translations';
import { fontFamilyMap } from '@/domain/entities/TemplateCustomization';

interface ManhattanTemplateProps {
  data: CVData;
  language?: Language;
  t?: (key: string) => string;
  customization?: TemplateCustomization;
}

/**
 * ManhattanTemplate - Finance/Corporate focused CV template
 * Features:
 * - Single column, ultra conservative layout
 * - Metrics displayed in bold (e.g., "Revenue increased 45%")
 * - Georgia or Times serif font recommendation
 * - Color scheme: Charcoal + Burgundy accent
 * - Strong emphasis on certifications section
 */
const ManhattanTemplate: React.FC<ManhattanTemplateProps> = ({
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

    const fullMonthNames = language === 'tr'
      ? ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${fullMonthNames[parseInt(month) - 1]} ${year}`;
  };

  // Highlight metrics in text (numbers with % or $ or numbers followed by keywords)
  const highlightMetrics = (text: string) => {
    // Regex to find metrics: percentages, dollar amounts, large numbers
    const metricPattern = /(\$[\d,]+(?:\.\d+)?[KMB]?|\d+(?:\.\d+)?%|\d{1,3}(?:,\d{3})+|\d+[KMB]\+?)/g;
    const parts = text.split(metricPattern);

    return parts.map((part, index) => {
      if (metricPattern.test(part)) {
        return (
          <strong key={index} style={{ color: customization.primaryColor, fontWeight: 700 }}>
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  // Style calculations
  const fontSizeMap = {
    small: { base: '11px', heading: '20px', subheading: '13px', name: '24px' },
    medium: { base: '12px', heading: '22px', subheading: '14px', name: '26px' },
    large: { base: '14px', heading: '26px', subheading: '16px', name: '30px' },
  };

  const spacingMap = {
    compact: { section: '16px', item: '10px', padding: '28px 36px' },
    normal: { section: '22px', item: '14px', padding: '36px 44px' },
    relaxed: { section: '28px', item: '18px', padding: '44px 52px' },
  };

  const styles: React.CSSProperties = {
    fontFamily: fontFamilyMap[customization.fontFamily] || fontFamilyMap.georgia,
    fontSize: fontSizeMap[customization.fontSize].base,
    backgroundColor: customization.backgroundColor,
    color: customization.textColor,
    padding: spacingMap[customization.spacing].padding,
    lineHeight: '1.6',
  };

  const nameStyles: React.CSSProperties = {
    fontSize: fontSizeMap[customization.fontSize].name,
    color: customization.primaryColor,
    fontWeight: 700,
    textTransform: customization.nameStyle === 'uppercase' ? 'uppercase' :
                   customization.nameStyle === 'small-caps' ? 'uppercase' : 'none',
    letterSpacing: customization.nameStyle === 'small-caps' ? '0.15em' :
                   customization.nameStyle === 'uppercase' ? '0.08em' : '0.02em',
    marginBottom: '2px',
    textAlign: customization.headerStyle === 'centered' ? 'center' : 'left',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: fontSizeMap[customization.fontSize].subheading,
    fontWeight: 700,
    color: customization.primaryColor,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: spacingMap[customization.spacing].item,
    paddingBottom: '8px',
    borderBottom: customization.sectionDivider === 'line' ? `1px solid ${customization.primaryColor}` : 'none',
    borderLeft: customization.sectionDivider === 'border-left' ? `4px solid ${customization.accentColor}` : 'none',
    paddingLeft: customization.sectionDivider === 'border-left' ? '12px' : '0',
    backgroundColor: customization.sectionDivider === 'background' ? `${customization.primaryColor}08` : 'transparent',
    padding: customization.sectionDivider === 'background' ? '8px 12px' : undefined,
  };

  // Sort sections
  const sortedSections = [...(sectionOrder || [])].sort((a, b) => a.order - b.order);
  const visibility = sectionVisibility || {
    personalInfo: true, summary: true, experience: true,
    education: true, skills: true, languages: true, certificates: true
  };

  // Photo shape styles
  const getPhotoShapeStyle = (): React.CSSProperties => {
    switch (customization.photoShape) {
      case 'circle':
        return { borderRadius: '50%' };
      case 'rounded':
        return { borderRadius: '8px' };
      case 'square':
      default:
        return { borderRadius: '2px' };
    }
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        if (!visibility.summary || !summary) return null;
        return (
          <section key="summary" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>{t('cv.summary')}</h2>
            <p className="leading-relaxed" style={{ color: customization.textColor, textAlign: 'justify' }}>
              {highlightMetrics(summary)}
            </p>
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
                  <div className="flex justify-between items-baseline">
                    <h3
                      className="font-bold"
                      style={{
                        color: customization.textColor,
                        fontSize: fontSizeMap[customization.fontSize].subheading,
                        fontWeight: 700
                      }}
                    >
                      {exp.position || 'Position'}
                    </h3>
                    <span
                      className="text-xs"
                      style={{ color: `${customization.textColor}80`, fontStyle: 'italic' }}
                    >
                      {formatDate(exp.startDate)} – {exp.current ? t('cv.present') : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p
                    className="font-medium"
                    style={{ color: customization.accentColor, marginTop: '2px' }}
                  >
                    {exp.company || 'Company'}{exp.location ? `, ${exp.location}` : ''}
                  </p>
                  {exp.description && (
                    <p
                      className="mt-2 whitespace-pre-line"
                      style={{
                        color: `${customization.textColor}dd`,
                        fontSize: fontSizeMap[customization.fontSize].base,
                        textAlign: 'justify'
                      }}
                    >
                      {highlightMetrics(exp.description)}
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
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold" style={{ color: customization.textColor }}>
                      {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                    </h3>
                    <span
                      className="text-xs"
                      style={{ color: `${customization.textColor}80`, fontStyle: 'italic' }}
                    >
                      {formatDate(edu.endDate)}
                    </span>
                  </div>
                  <p style={{ color: customization.accentColor }}>{edu.institution}</p>
                  {edu.gpa && (
                    <p className="text-xs mt-1" style={{ color: `${customization.textColor}99` }}>
                      GPA: <strong>{edu.gpa}</strong>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'certificates':
        // Certificates section is emphasized in Manhattan template
        if (!visibility.certificates || !certificates || certificates.length === 0) return null;
        return (
          <section key="certificates" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>{t('cv.certificates')}</h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '16px',
                backgroundColor: `${customization.primaryColor}05`,
                border: `1px solid ${customization.primaryColor}20`,
              }}
            >
              {certificates.map((cert) => (
                <div key={cert.id} className="flex items-start gap-3">
                  <Award
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    style={{ color: customization.accentColor }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold" style={{ color: customization.textColor }}>
                        {cert.name}
                      </span>
                      {cert.date && (
                        <span className="text-xs" style={{ color: `${customization.textColor}60` }}>
                          {formatDate(cert.date)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: `${customization.textColor}80` }}>
                      {cert.issuer}
                    </p>
                    {cert.credentialId && (
                      <p className="text-xs mt-1" style={{ color: `${customization.textColor}60` }}>
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!visibility.skills || skills.length === 0) return null;
        return (
          <section key="skills" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>{t('cv.skills')}</h2>
            {customization.skillDisplay === 'tags' ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 text-xs"
                    style={{
                      backgroundColor: `${customization.primaryColor}10`,
                      color: customization.primaryColor,
                      border: `1px solid ${customization.primaryColor}30`,
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : customization.skillDisplay === 'comma-list' ? (
              <p style={{ color: customization.textColor }}>
                {skills.map(s => s.name).join(' • ')}
              </p>
            ) : (
              <ul className="list-none" style={{ columns: 2, columnGap: '32px' }}>
                {skills.map((skill) => (
                  <li key={skill.id} className="mb-1" style={{ color: customization.textColor }}>
                    • {skill.name}
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
            <h2 style={sectionTitleStyle}>{t('cv.languages')}</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
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
      {/* Header - Conservative, traditional */}
      <header
        style={{
          marginBottom: spacingMap[customization.spacing].section,
          textAlign: customization.headerStyle === 'centered' ? 'center' : 'left',
          borderBottom: `2px solid ${customization.primaryColor}`,
          paddingBottom: spacingMap[customization.spacing].item,
        }}
      >
        <div className={`flex items-start gap-4 ${customization.headerStyle === 'centered' ? 'justify-center' : ''}`}>
          {/* Photo - only show if photo exists */}
          {customization.showPhoto && personalInfo.photo && (
            <div
              className="flex-shrink-0 overflow-hidden"
              style={{
                width: '64px',
                height: '64px',
                ...getPhotoShapeStyle(),
                border: `2px solid ${customization.primaryColor}30`,
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
              className="font-medium"
              style={{
                color: customization.accentColor,
                fontSize: fontSizeMap[customization.fontSize].subheading,
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              {personalInfo.title || 'Professional Title'}
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div
          className="flex flex-wrap gap-x-6 gap-y-1 text-xs mt-2"
          style={{
            color: `${customization.textColor}99`,
            justifyContent: customization.headerStyle === 'centered' ? 'center' : 'flex-start'
          }}
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
        </div>
      </header>

      {/* Content */}
      <div>
        {sortedSections.map(s => renderSection(s.id))}
      </div>
    </div>
  );
};

export default ManhattanTemplate;
