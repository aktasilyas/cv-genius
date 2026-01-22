import React from 'react';
import { CVData, TemplateCustomization, defaultTemplateCustomization } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, GraduationCap, Briefcase, Code, Heart } from 'lucide-react';
import { Language } from '@/lib/translations';
import { fontFamilyMap } from '@/domain/entities/TemplateCustomization';

interface DublinTemplateProps {
  data: CVData;
  language?: Language;
  t?: (key: string) => string;
  customization?: TemplateCustomization;
}

/**
 * DublinTemplate - Entry-Level/Graduate focused CV template
 * Features:
 * - Single column, education-first layout
 * - Projects section (personal projects)
 * - Coursework highlights
 * - Volunteer/extracurricular section
 * - Color scheme: Fresh blue + green
 * - Clean, energetic design suitable for new graduates
 */
const DublinTemplate: React.FC<DublinTemplateProps> = ({
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
    compact: { section: '14px', item: '8px', padding: '28px 32px' },
    normal: { section: '20px', item: '12px', padding: '36px 40px' },
    relaxed: { section: '26px', item: '16px', padding: '44px 48px' },
  };

  const styles: React.CSSProperties = {
    fontFamily: fontFamilyMap[customization.fontFamily] || fontFamilyMap.poppins,
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
    letterSpacing: customization.nameStyle === 'small-caps' ? '0.1em' : '0',
    marginBottom: '4px',
    textAlign: customization.headerStyle === 'centered' ? 'center' : 'left',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: fontSizeMap[customization.fontSize].subheading,
    fontWeight: 600,
    color: customization.primaryColor,
    marginBottom: spacingMap[customization.spacing].item,
    paddingBottom: '8px',
    borderBottom: customization.sectionDivider === 'line' ? `2px solid ${customization.accentColor}` : 'none',
    borderLeft: customization.sectionDivider === 'border-left' ? `4px solid ${customization.accentColor}` : 'none',
    paddingLeft: customization.sectionDivider === 'border-left' ? '12px' : '0',
    backgroundColor: customization.sectionDivider === 'background' ? `${customization.accentColor}10` : 'transparent',
    padding: customization.sectionDivider === 'background' ? '8px 12px' : undefined,
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
        // Objective / Career Goal for entry-level
        if (!visibility.summary || !summary) return null;
        return (
          <section key="summary" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>
              {language === 'tr' ? 'Kariyer Hedefi' : 'Career Objective'}
            </h2>
            <p
              className="leading-relaxed"
              style={{
                color: customization.textColor,
                backgroundColor: `${customization.accentColor}08`,
                padding: '12px 16px',
                borderRadius: '8px',
                borderLeft: `3px solid ${customization.accentColor}`,
              }}
            >
              {summary}
            </p>
          </section>
        );

      case 'education':
        // Education-first for graduates
        if (!visibility.education || education.length === 0) return null;
        return (
          <section key="education" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>
              <GraduationCap className="w-4 h-4" style={{ color: customization.accentColor }} />
              {t('cv.education')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacingMap[customization.spacing].item }}>
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: `${customization.primaryColor}05`,
                    border: `1px solid ${customization.primaryColor}15`,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ color: customization.textColor }}>
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </h3>
                      <p style={{ color: customization.accentColor, fontWeight: 500 }}>
                        {edu.institution}
                      </p>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${customization.accentColor}20`,
                        color: customization.primaryColor,
                        fontWeight: 500,
                      }}
                    >
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm mt-2" style={{ color: `${customization.textColor}99` }}>
                      <strong>GPA:</strong> {edu.gpa}
                    </p>
                  )}
                  {edu.coursework && (
                    <div className="mt-2">
                      <p className="text-xs font-medium mb-1" style={{ color: `${customization.textColor}80` }}>
                        {language === 'tr' ? 'İlgili Dersler:' : 'Relevant Coursework:'}
                      </p>
                      <p className="text-xs" style={{ color: `${customization.textColor}99` }}>
                        {edu.coursework}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'experience':
        // Internships / Part-time work
        if (!visibility.experience || experience.length === 0) return null;
        return (
          <section key="experience" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>
              <Briefcase className="w-4 h-4" style={{ color: customization.accentColor }} />
              {language === 'tr' ? 'Deneyim & Stajlar' : 'Experience & Internships'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacingMap[customization.spacing].item }}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="font-semibold"
                        style={{
                          color: customization.textColor,
                          fontSize: fontSizeMap[customization.fontSize].subheading
                        }}
                      >
                        {exp.position || 'Position'}
                      </h3>
                      <p style={{ color: customization.accentColor }}>
                        {exp.company || 'Company'}{exp.location ? ` • ${exp.location}` : ''}
                      </p>
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: `${customization.textColor}80` }}
                    >
                      {formatDate(exp.startDate)} – {exp.current ? t('cv.present') : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <ul
                      className="mt-2 pl-4"
                      style={{
                        listStyleType: 'disc',
                        color: `${customization.textColor}dd`,
                        fontSize: fontSizeMap[customization.fontSize].base,
                      }}
                    >
                      {exp.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                        <li key={idx} className="mb-1">{line.replace(/^[-•]\s*/, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        // Skills with categorization for students
        if (!visibility.skills || skills.length === 0) return null;
        return (
          <section key="skills" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>
              <Code className="w-4 h-4" style={{ color: customization.accentColor }} />
              {t('cv.skills')}
            </h2>
            {customization.skillDisplay === 'tags' ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: `${customization.accentColor}15`,
                      color: customization.primaryColor,
                      border: `1px solid ${customization.accentColor}30`,
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
            ) : customization.skillDisplay === 'rating-dots' ? (
              <div className="grid grid-cols-2 gap-3">
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
                              : `${customization.textColor}20`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="list-disc list-inside" style={{ columns: 2, columnGap: '24px' }}>
                {skills.map((skill) => (
                  <li key={skill.id} style={{ color: customization.textColor, marginBottom: '4px' }}>
                    {skill.name}
                  </li>
                ))}
              </ul>
            )}
          </section>
        );

      case 'certificates':
        // Projects / Certificates for students
        if (!visibility.certificates || !certificates || certificates.length === 0) return null;
        return (
          <section key="certificates" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>
              <Heart className="w-4 h-4" style={{ color: customization.accentColor }} />
              {language === 'tr' ? 'Projeler & Sertifikalar' : 'Projects & Certifications'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: `${customization.accentColor}08`,
                    borderLeft: `3px solid ${customization.accentColor}`,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold" style={{ color: customization.textColor }}>
                        {cert.name}
                      </h4>
                      <p className="text-sm" style={{ color: `${customization.textColor}80` }}>
                        {cert.issuer}
                      </p>
                    </div>
                    {cert.date && (
                      <span className="text-xs" style={{ color: `${customization.textColor}60` }}>
                        {formatDate(cert.date)}
                      </span>
                    )}
                  </div>
                  {cert.url && (
                    <p className="text-xs mt-1" style={{ color: customization.accentColor }}>
                      {cert.url}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!visibility.languages || languages.length === 0) return null;
        return (
          <section key="languages" style={{ marginBottom: spacingMap[customization.spacing].section }}>
            <h2 style={sectionTitleStyle}>
              {t('cv.languages')}
            </h2>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang) => (
                <div
                  key={lang.id}
                  className="px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: `${customization.primaryColor}08`,
                    border: `1px solid ${customization.primaryColor}20`,
                  }}
                >
                  <span className="font-medium" style={{ color: customization.textColor }}>
                    {lang.name}
                  </span>
                  <span
                    className="ml-2 text-xs"
                    style={{ color: `${customization.textColor}80` }}
                  >
                    {lang.proficiency}
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
      {/* Header - Fresh, energetic design with headerStyle support */}
      <header
        style={{
          marginBottom: spacingMap[customization.spacing].section,
          background: `linear-gradient(135deg, ${customization.primaryColor}08 0%, ${customization.accentColor}08 100%)`,
          padding: '24px',
          borderRadius: '12px',
          border: `1px solid ${customization.primaryColor}15`,
          textAlign: customization.headerStyle === 'centered' ? 'center' : 'left',
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
                <h1 style={{ ...nameStyles, textAlign: 'left' }}>
                  {personalInfo.fullName || 'Your Name'}
                </h1>
                <p
                  className="font-medium"
                  style={{
                    color: customization.accentColor,
                    fontSize: fontSizeMap[customization.fontSize].subheading,
                  }}
                >
                  {personalInfo.title || 'Recent Graduate / Student'}
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
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin className="w-3 h-3" style={{ color: customization.accentColor }} />
                  {personalInfo.linkedin}
                </span>
              )}
              {personalInfo.github && (
                <span className="flex items-center gap-1">
                  <Github className="w-3 h-3" style={{ color: customization.accentColor }} />
                  {personalInfo.github}
                </span>
              )}
              {personalInfo.website && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" style={{ color: customization.accentColor }} />
                  {personalInfo.website}
                </span>
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
                  className="font-medium mb-4"
                  style={{
                    color: customization.accentColor,
                    fontSize: fontSizeMap[customization.fontSize].subheading,
                  }}
                >
                  {personalInfo.title || 'Recent Graduate / Student'}
                </p>
              </div>
            </div>

            {/* Contact Info - Modern inline style */}
            <div
              className={`flex flex-wrap gap-x-4 gap-y-2 text-xs mt-2 ${
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
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <Github className="w-3 h-3" style={{ color: customization.accentColor }} />
              {personalInfo.github}
            </span>
          )}
              {personalInfo.website && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" style={{ color: customization.accentColor }} />
                  {personalInfo.website}
                </span>
              )}
            </div>
          </>
        )}
      </header>

      {/* Content */}
      <div>
        {sortedSections.map(s => renderSection(s.id))}
      </div>
    </div>
  );
};

export default DublinTemplate;
