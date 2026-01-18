import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe, Award } from 'lucide-react';

interface ExecutiveTemplateProps {
  data: CVData;
}

const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, languages, certificates, sectionVisibility } = data;

  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const visibility = sectionVisibility || { summary: true, experience: true, education: true, skills: true, languages: true, certificates: true };

  return (
    <div className="bg-white text-gray-900 min-h-[1123px] font-serif text-sm">
      {/* Sophisticated Header */}
      <header className="bg-slate-800 text-white p-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-light tracking-widest uppercase mb-2">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="w-24 h-0.5 bg-amber-500 mx-auto my-4" />
          <p className="text-lg text-amber-400 tracking-wide mb-6">
            {personalInfo.title || 'Professional Title'}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-slate-300 text-xs">
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
          <section className="mb-10 text-center">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-[0.3em] mb-4">Executive Summary</h2>
            <p className="text-gray-600 leading-relaxed italic">{summary}</p>
          </section>
        )}

        <div className="w-full h-px bg-slate-200 my-8" />

        {/* Experience */}
        {visibility.experience && experience.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-[0.3em] mb-6 text-center">Professional Experience</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-amber-500 pl-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{exp.position || 'Position'}</h3>
                      <p className="text-amber-600">{exp.company || 'Company'}</p>
                    </div>
                    <span className="text-slate-500 text-xs">
                      {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 text-xs whitespace-pre-line">{exp.description}</p>
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
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-[0.3em] mb-4">Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-semibold text-slate-800">{edu.institution}</h3>
                    <p className="text-amber-600 text-xs">{edu.degree} in {edu.field}</p>
                    <p className="text-slate-500 text-xs">{formatDate(edu.endDate)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="space-y-8">
            {/* Core Competencies */}
            {visibility.skills && skills.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-[0.3em] mb-4">Core Competencies</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill.id} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs border border-slate-200">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {visibility.languages && languages.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-[0.3em] mb-4">Languages</h2>
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between text-xs">
                      <span className="text-slate-700">{lang.name}</span>
                      <span className="text-amber-600 capitalize">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Certificates */}
        {visibility.certificates && certificates && certificates.length > 0 && (
          <section className="mt-10">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-[0.3em] mb-4 text-center">Certifications & Credentials</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-xs">
                  <Award className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="font-medium text-slate-800">{cert.name}</span>
                    <span className="text-slate-500 ml-2">{cert.issuer}</span>
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
