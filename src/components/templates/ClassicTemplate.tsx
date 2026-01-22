import { CVData, TemplateCustomization, defaultTemplateCustomization } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe, Award, User } from 'lucide-react';
import { Language } from '@/lib/translations';

interface ClassicTemplateProps {
  data: CVData;
  language?: Language;
  t?: (key: string) => string;
  customization?: TemplateCustomization;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ 
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
    small: { base: '12px', heading: '28px', section: '16px' },
    medium: { base: '14px', heading: '32px', section: '18px' },
    large: { base: '16px', heading: '36px', section: '20px' },
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
      <header
        className="text-center pb-6 mb-6"
        style={{
          borderBottomWidth: borderMap[customization.borderStyle],
          borderColor: customization.textColor
        }}
      >
        {/* Photo - only show if photo exists */}
        {customization.showPhoto && personalInfo.photo && (
          <div
            className="mx-auto mb-4"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: customization.photoShape === 'circle' ? '50%' :
                           customization.photoShape === 'rounded' ? '8px' : '0',
              overflow: 'hidden',
              border: `2px solid ${customization.textColor}40`,
            }}
          >
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName || 'Profile'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        <h1
          className="font-bold tracking-wide mb-2"
          style={{ fontSize: fontSizeMap[customization.fontSize].heading, color: customization.textColor }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="italic mb-4" style={{ fontSize: fontSizeMap[customization.fontSize].section, color: `${customization.textColor}99` }}>
          {personalInfo.title || 'Professional Title'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs" style={{ color: `${customization.textColor}99` }}>
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

      {/* Summary */}
      {visibility.summary && summary && (
        <section style={{ marginBottom: spacingMap[customization.spacing] }}>
          <h2 
            className="font-bold uppercase tracking-wider mb-3"
            style={{ fontSize: fontSizeMap[customization.fontSize].section, color: customization.textColor }}
          >
            {t('cv.summary')}
          </h2>
          <p className="leading-relaxed" style={{ color: `${customization.textColor}cc` }}>{summary}</p>
        </section>
      )}

      {/* Experience */}
      {visibility.experience && experience.length > 0 && (
        <section style={{ marginBottom: spacingMap[customization.spacing] }}>
          <h2 
            className="font-bold uppercase tracking-wider mb-3"
            style={{ fontSize: fontSizeMap[customization.fontSize].section, color: customization.textColor }}
          >
            {t('cv.experience')}
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold" style={{ color: customization.textColor }}>{exp.position || 'Position'}</h3>
                  <span className="text-xs italic" style={{ color: `${customization.textColor}80` }}>
                    {formatDate(exp.startDate)} — {exp.current ? t('cv.present') : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="italic mb-2" style={{ color: customization.primaryColor }}>{exp.company || 'Company'}</p>
                {exp.description && (
                  <p className="text-xs whitespace-pre-line" style={{ color: `${customization.textColor}cc` }}>{exp.description}</p>
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
            className="font-bold uppercase tracking-wider mb-3"
            style={{ fontSize: fontSizeMap[customization.fontSize].section, color: customization.textColor }}
          >
            {t('cv.education')}
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold" style={{ color: customization.textColor }}>{edu.institution}</h3>
                  <span className="text-xs italic" style={{ color: `${customization.textColor}80` }}>
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="italic" style={{ color: customization.primaryColor }}>
                  {edu.degree} in {edu.field}
                  {edu.gpa && `, GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Skills */}
        {visibility.skills && skills.length > 0 && (
          <section>
            <h2 
              className="font-bold uppercase tracking-wider mb-3"
              style={{ fontSize: fontSizeMap[customization.fontSize].section, color: customization.textColor }}
            >
              {t('cv.skills')}
            </h2>
            <ul className="list-disc list-inside text-xs space-y-1" style={{ color: `${customization.textColor}cc` }}>
              {skills.map((skill) => (
                <li key={skill.id}>
                  {skill.name} <span style={{ color: `${customization.textColor}80` }}>({skill.level})</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages */}
        {visibility.languages && languages.length > 0 && (
          <section>
            <h2 
              className="font-bold uppercase tracking-wider mb-3"
              style={{ fontSize: fontSizeMap[customization.fontSize].section, color: customization.textColor }}
            >
              {t('cv.languages')}
            </h2>
            <ul className="list-disc list-inside text-xs space-y-1" style={{ color: `${customization.textColor}cc` }}>
              {languages.map((lang) => (
                <li key={lang.id}>
                  {lang.name} <span style={{ color: `${customization.textColor}80` }}>({lang.proficiency})</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Certificates */}
      {visibility.certificates && certificates && certificates.length > 0 && (
        <section style={{ marginTop: spacingMap[customization.spacing] }}>
          <h2 
            className="font-bold uppercase tracking-wider mb-3"
            style={{ fontSize: fontSizeMap[customization.fontSize].section, color: customization.textColor }}
          >
            {t('cv.certificates')}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-start gap-2 text-xs">
                <Award className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: customization.primaryColor }} />
                <div>
                  <p className="font-medium" style={{ color: customization.textColor }}>{cert.name}</p>
                  <p style={{ color: `${customization.textColor}80` }}>{cert.issuer} • {formatDate(cert.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;
