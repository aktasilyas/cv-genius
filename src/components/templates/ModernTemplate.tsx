import { CVData, SectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe, Award } from 'lucide-react';

interface ModernTemplateProps {
  data: CVData;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, languages, certificates, sectionVisibility, sectionOrder } = data;

  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  // Sort sections by order
  const sortedSections = [...(sectionOrder || [])].sort((a, b) => a.order - b.order);

  const renderSection = (sectionId: string) => {
    const visibility = sectionVisibility || { summary: true, experience: true, education: true, skills: true, languages: true, certificates: true };
    
    switch (sectionId) {
      case 'summary':
        if (!visibility.summary || !summary) return null;
        return (
          <section key="summary">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </section>
        );

      case 'experience':
        if (!visibility.experience || experience.length === 0) return null;
        return (
          <section key="experience">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.position || 'Position'}</h3>
                      <p className="text-teal-600 font-medium">{exp.company || 'Company'}</p>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-xs mt-2 whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!visibility.education || education.length === 0) return null;
        return (
          <section key="education">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                      <p className="text-teal-600">{edu.institution}</p>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.gpa && <p className="text-gray-600 text-xs mt-1">GPA: {edu.gpa}</p>}
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
          <section key="skills">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!visibility.languages || languages.length === 0) return null;
        return (
          <section key="languages">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Languages
            </h2>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between text-xs">
                  <span className="text-gray-900">{lang.name}</span>
                  <span className="text-gray-500 capitalize">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'certificates':
        if (!visibility.certificates || !certificates || certificates.length === 0) return null;
        return (
          <section key="certificates">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Certificates
            </h2>
            <div className="space-y-2">
              {certificates.map((cert) => (
                <div key={cert.id} className="text-xs">
                  <div className="flex items-start gap-1">
                    <Award className="w-3 h-3 text-teal-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{cert.name}</p>
                      <p className="text-gray-500">{cert.issuer}</p>
                      {cert.date && <p className="text-gray-400">{formatDate(cert.date)}</p>}
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
    <div className="bg-white text-gray-900 p-8 min-h-[1123px] font-sans text-sm">
      {/* Header */}
      <header className="border-b-2 border-teal-500 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-lg text-teal-600 font-medium mb-4">
          {personalInfo.title || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-4 text-gray-600 text-xs">
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
        <div className="col-span-2 space-y-6">
          {sortedSections
            .filter(s => mainSections.includes(s.id))
            .map(s => renderSection(s.id))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {sortedSections
            .filter(s => sidebarSections.includes(s.id))
            .map(s => renderSidebarSection(s.id))}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
