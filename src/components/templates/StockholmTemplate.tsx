import React from 'react';
import { CVData, TemplateCustomization, defaultTemplateCustomization } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe, Dribbble, Instagram } from 'lucide-react';
import { Language } from '@/lib/translations';
import { fontFamilyMap } from '@/domain/entities/TemplateCustomization';

interface StockholmTemplateProps {
  data: CVData;
  language?: Language;
  t?: (key: string) => string;
  customization?: TemplateCustomization;
}

/**
 * StockholmTemplate - Creative/Design focused CV template
 * Features:
 * - Two column layout (sidebar left 30%, main 70%)
 * - Optional photo area
 * - Skills displayed as visual dots (●●●●○)
 * - Portfolio/Behance/Dribbble links
 * - Customizable gradient header option
 */
const StockholmTemplate: React.FC<StockholmTemplateProps> = ({
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

  // Render skill rating dots
  const renderSkillDots = (level: string) => {
    const levelMap: Record<string, number> = {
      beginner: 2,
      intermediate: 3,
      advanced: 4,
      expert: 5,
    };
    const filled = levelMap[level] || 3;

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((dot) => (
          <span
            key={dot}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: dot <= filled ? customization.accentColor : `${customization.backgroundColor}40`,
              display: 'inline-block',
            }}
          />
        ))}
      </div>
    );
  };

  // Style calculations
  const fontSizeMap = {
    small: { base: '10px', heading: '20px', subheading: '12px', name: '24px', sidebar: '10px' },
    medium: { base: '11px', heading: '22px', subheading: '13px', name: '26px', sidebar: '11px' },
    large: { base: '13px', heading: '26px', subheading: '15px', name: '30px', sidebar: '12px' },
  };

  const spacingMap = {
    compact: { section: '14px', item: '8px', padding: '0' },
    normal: { section: '18px', item: '10px', padding: '0' },
    relaxed: { section: '24px', item: '14px', padding: '0' },
  };

  // Visibility
  const visibility = sectionVisibility || {
    personalInfo: true, summary: true, experience: true,
    education: true, skills: true, languages: true, certificates: true
  };

  // Sidebar sections
  const renderSidebarSkills = () => {
    if (!visibility.skills || skills.length === 0) return null;

    return (
      <section style={{ marginBottom: spacingMap[customization.spacing].section }}>
        <h2
          className="font-bold uppercase tracking-wider mb-3"
          style={{
            fontSize: fontSizeMap[customization.fontSize].subheading,
            color: customization.backgroundColor,
            borderBottom: `1px solid ${customization.backgroundColor}40`,
            paddingBottom: '6px',
          }}
        >
          {t('cv.skills')}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {skills.map((skill) => (
            <div key={skill.id}>
              <div className="flex justify-between items-center mb-1">
                <span
                  style={{
                    color: customization.backgroundColor,
                    fontSize: fontSizeMap[customization.fontSize].sidebar
                  }}
                >
                  {skill.name}
                </span>
              </div>
              {customization.skillDisplay === 'rating-dots' && renderSkillDots(skill.level)}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSidebarLanguages = () => {
    if (!visibility.languages || languages.length === 0) return null;

    return (
      <section style={{ marginBottom: spacingMap[customization.spacing].section }}>
        <h2
          className="font-bold uppercase tracking-wider mb-3"
          style={{
            fontSize: fontSizeMap[customization.fontSize].subheading,
            color: customization.backgroundColor,
            borderBottom: `1px solid ${customization.backgroundColor}40`,
            paddingBottom: '6px',
          }}
        >
          {t('cv.languages')}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {languages.map((lang) => (
            <div key={lang.id} className="flex justify-between">
              <span style={{ color: customization.backgroundColor, fontSize: fontSizeMap[customization.fontSize].sidebar }}>
                {lang.name}
              </span>
              <span
                style={{
                  color: `${customization.backgroundColor}cc`,
                  fontSize: fontSizeMap[customization.fontSize].sidebar
                }}
              >
                {lang.proficiency}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSidebarCertificates = () => {
    if (!visibility.certificates || !certificates || certificates.length === 0) return null;

    return (
      <section style={{ marginBottom: spacingMap[customization.spacing].section }}>
        <h2
          className="font-bold uppercase tracking-wider mb-3"
          style={{
            fontSize: fontSizeMap[customization.fontSize].subheading,
            color: customization.backgroundColor,
            borderBottom: `1px solid ${customization.backgroundColor}40`,
            paddingBottom: '6px',
          }}
        >
          {t('cv.certificates')}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {certificates.map((cert) => (
            <div key={cert.id}>
              <p
                className="font-medium"
                style={{ color: customization.backgroundColor, fontSize: fontSizeMap[customization.fontSize].sidebar }}
              >
                {cert.name}
              </p>
              <p
                style={{
                  color: `${customization.backgroundColor}99`,
                  fontSize: `calc(${fontSizeMap[customization.fontSize].sidebar} - 1px)`
                }}
              >
                {cert.issuer}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Main content sections
  const renderMainSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        if (!visibility.summary || !summary) return null;
        return (
          <section key="summary" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2
              className="font-bold uppercase tracking-wider mb-3"
              style={{
                fontSize: fontSizeMap[customization.fontSize].subheading,
                color: customization.primaryColor,
                borderBottom: `2px solid ${customization.accentColor}`,
                paddingBottom: '6px',
              }}
            >
              {t('cv.summary')}
            </h2>
            <p
              className="leading-relaxed"
              style={{ color: customization.textColor, fontSize: fontSizeMap[customization.fontSize].base }}
            >
              {summary}
            </p>
          </section>
        );

      case 'experience':
        if (!visibility.experience || experience.length === 0) return null;
        return (
          <section key="experience" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2
              className="font-bold uppercase tracking-wider mb-3"
              style={{
                fontSize: fontSizeMap[customization.fontSize].subheading,
                color: customization.primaryColor,
                borderBottom: `2px solid ${customization.accentColor}`,
                paddingBottom: '6px',
              }}
            >
              {t('cv.experience')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacingMap[customization.spacing].item }}>
              {experience.map((exp) => (
                <div key={exp.id} style={{ paddingBottom: spacingMap[customization.spacing].item }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="font-bold"
                        style={{
                          color: customization.textColor,
                          fontSize: fontSizeMap[customization.fontSize].subheading
                        }}
                      >
                        {exp.position || 'Position'}
                      </h3>
                      <p style={{ color: customization.accentColor, fontWeight: 500 }}>
                        {exp.company || 'Company'}
                      </p>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${customization.accentColor}15`,
                        color: customization.primaryColor,
                        fontSize: fontSizeMap[customization.fontSize].sidebar
                      }}
                    >
                      {formatDate(exp.startDate)} – {exp.current ? t('cv.present') : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p
                      className="mt-2 whitespace-pre-line"
                      style={{
                        color: `${customization.textColor}dd`,
                        fontSize: fontSizeMap[customization.fontSize].base
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

      case 'education':
        if (!visibility.education || education.length === 0) return null;
        return (
          <section key="education" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2
              className="font-bold uppercase tracking-wider mb-3"
              style={{
                fontSize: fontSizeMap[customization.fontSize].subheading,
                color: customization.primaryColor,
                borderBottom: `2px solid ${customization.accentColor}`,
                paddingBottom: '6px',
              }}
            >
              {t('cv.education')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacingMap[customization.spacing].item }}>
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ color: customization.textColor }}>
                        {edu.degree}{edu.field ? ` – ${edu.field}` : ''}
                      </h3>
                      <p style={{ color: customization.accentColor }}>{edu.institution}</p>
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: `${customization.textColor}80`, fontSize: fontSizeMap[customization.fontSize].sidebar }}
                    >
                      {formatDate(edu.endDate)}
                    </span>
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

  // Sort sections
  const sortedSections = [...(sectionOrder || [])].sort((a, b) => a.order - b.order);
  const mainSections = ['summary', 'experience', 'education'];

  // Photo shape styles
  const getPhotoShapeStyle = (): React.CSSProperties => {
    switch (customization.photoShape) {
      case 'circle':
        return { borderRadius: '50%' };
      case 'rounded':
        return { borderRadius: '12px' };
      case 'square':
      default:
        return { borderRadius: '0' };
    }
  };

  return (
    <div
      className="min-h-[1123px] w-[794px] flex"
      style={{
        fontFamily: fontFamilyMap[customization.fontFamily] || fontFamilyMap.poppins,
        fontSize: fontSizeMap[customization.fontSize].base,
        backgroundColor: customization.backgroundColor,
        lineHeight: '1.5',
      }}
    >
      {/* Sidebar - 30% */}
      <aside
        className="w-[30%] p-6"
        style={{
          background: `linear-gradient(135deg, ${customization.primaryColor} 0%, ${customization.accentColor} 100%)`,
          color: customization.backgroundColor,
        }}
      >
        {/* Photo Area - only show if photo exists */}
        {customization.showPhoto && personalInfo.photo && (
          <div
            className="w-24 h-24 mx-auto mb-6 overflow-hidden"
            style={{
              ...getPhotoShapeStyle(),
              border: `3px solid ${customization.backgroundColor}40`,
            }}
          >
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName || 'Profile'}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Name & Title in sidebar */}
        <div className="text-center mb-6">
          <h1
            className="font-bold mb-1"
            style={{
              fontSize: fontSizeMap[customization.fontSize].name,
              color: customization.backgroundColor,
              textTransform: customization.nameStyle === 'uppercase' ? 'uppercase' :
                           customization.nameStyle === 'small-caps' ? 'uppercase' : 'none',
              letterSpacing: customization.nameStyle === 'small-caps' ? '0.1em' : '0.02em',
            }}
          >
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p
            style={{
              color: `${customization.backgroundColor}cc`,
              fontSize: fontSizeMap[customization.fontSize].subheading,
            }}
          >
            {personalInfo.title || 'Professional Title'}
          </p>
        </div>

        {/* Contact Info */}
        <div
          className="mb-6 pb-6"
          style={{ borderBottom: `1px solid ${customization.backgroundColor}30` }}
        >
          <div className="flex flex-col gap-2" style={{ fontSize: fontSizeMap[customization.fontSize].sidebar }}>
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" style={{ color: customization.backgroundColor }} />
                <span style={{ color: customization.backgroundColor, wordBreak: 'break-all' }}>
                  {personalInfo.email}
                </span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" style={{ color: customization.backgroundColor }} />
                <span style={{ color: customization.backgroundColor }}>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" style={{ color: customization.backgroundColor }} />
                <span style={{ color: customization.backgroundColor }}>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-3 h-3" style={{ color: customization.backgroundColor }} />
                <span style={{ color: customization.backgroundColor }}>{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3" style={{ color: customization.backgroundColor }} />
                <span style={{ color: customization.backgroundColor }}>{personalInfo.website}</span>
              </div>
            )}
            {personalInfo.dribbble && (
              <div className="flex items-center gap-2">
                <Dribbble className="w-3 h-3" style={{ color: customization.backgroundColor }} />
                <span style={{ color: customization.backgroundColor }}>{personalInfo.dribbble}</span>
              </div>
            )}
            {personalInfo.behance && (
              <div className="flex items-center gap-2">
                <Instagram className="w-3 h-3" style={{ color: customization.backgroundColor }} />
                <span style={{ color: customization.backgroundColor }}>{personalInfo.behance}</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Sections */}
        {renderSidebarSkills()}
        {renderSidebarLanguages()}
        {renderSidebarCertificates()}
      </aside>

      {/* Main Content - 70% */}
      <main
        className="w-[70%] p-8"
        style={{
          color: customization.textColor,
          backgroundColor: customization.backgroundColor,
        }}
      >
        {sortedSections
          .filter(s => mainSections.includes(s.id))
          .map(s => renderMainSection(s.id))}
      </main>
    </div>
  );
};

export default StockholmTemplate;
