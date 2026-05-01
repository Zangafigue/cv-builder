import { useCv } from '../../context/CvContext';
import FormatDate from './shared/FormatDate';
import SkillBar from './shared/SkillBar';
const ClassicTemplate = () => {
  const { cvData } = useCv();
  const { personalInfo, experience, education, skills, languages, themeColor } = cvData;

  const accentColor = '#1e293b'; // Dark slate
  const sectionsOrder = cvData.sectionsOrder || ['experience', 'education', 'skills', 'languages'];

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div key="experience">
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: accentColor, borderBottom: '2px solid', borderColor: themeColor, paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          Expérience Professionnelle
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {experience.map(exp => (
            <div key={exp.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0 1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: themeColor, flexShrink: 0 }} />
                <div style={{ width: '1px', backgroundColor: '#e2e8f0', flex: 1, marginTop: '4px' }} />
              </div>
              <div>
                <strong style={{ fontSize: '1rem', color: '#111827' }}>{exp.position}</strong>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', margin: '0.15rem 0' }}>
                  <span style={{ color: themeColor, fontSize: '0.875rem', fontWeight: 500 }}>{exp.company}</span>
                    <FormatDate dateString={exp.startDate} /> - {exp.current ? 'Présent' : <FormatDate dateString={exp.endDate} />}
                </div>
                <ul style={{ color: '#4b5563', fontSize: '0.875rem', paddingLeft: '1.25rem', lineHeight: '1.5', margin: '0.5rem 0 0 0' }}>
                  {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                    <li key={i}>{line.replace(/^- /, '')}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    if (education.length === 0) return null;
    return (
      <div key="education">
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: accentColor, borderBottom: '2px solid', borderColor: themeColor, paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          Formation
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {education.map(edu => (
            <div key={edu.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0 1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: themeColor, flexShrink: 0 }} />
                <div style={{ width: '1px', backgroundColor: '#e2e8f0', flex: 1, marginTop: '4px' }} />
              </div>
              <div>
                <strong style={{ fontSize: '1rem', color: '#111827' }}>{edu.degree} {edu.field ? `- ${edu.field}` : ''}</strong>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', margin: '0.15rem 0' }}>
                  <span style={{ color: themeColor, fontSize: '0.875rem', fontWeight: 500 }}>{edu.school}</span>
                    <FormatDate dateString={edu.startDate} /> - {edu.current ? 'Présent' : <FormatDate dateString={edu.endDate} />}
                </div>
                {edu.description && (
                  <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.5', margin: '0.5rem 0 0', whiteSpace: 'pre-line' }}>{edu.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    if (skills.length === 0) return null;
    return (
      <div key="skills">
        <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#93c5fd', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 600 }}>
          Compétences
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {skills.map(skill => (
            <div key={skill.id}>
              <SkillBar 
                name={skill.name} 
                level={skill.level} 
                color="#60a5fa" 
                bgColor="rgba(255,255,255,0.15)"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguages = () => {
    if (languages.length === 0) return null;
    return (
      <div key="languages">
        <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#93c5fd', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 600 }}>
          Langues
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
          {languages.map(lang => (
            <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 500 }}>{lang.name}</span>
              <span style={{ color: '#93c5fd', fontSize: '0.75rem' }}>{lang.level}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const sectionRenderers = {
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    languages: renderLanguages
  };

  const mainSections = sectionsOrder.filter(id => ['experience', 'education'].includes(id));
  const sidebarSections = sectionsOrder.filter(id => ['skills', 'languages'].includes(id));

  return (
    <div
      className="cv-document animate-fade-in"
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: 'white',
        boxShadow: 'var(--shadow-xl)',
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: '1fr 2.5fr',
        color: '#1f2937',
        fontFamily: 'var(--cv-font-family)',
        fontSize: 'var(--cv-font-size)',
        lineHeight: 'var(--cv-line-height)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
      }}
    >
      {/* Left Sidebar */}
      <div style={{ backgroundColor: accentColor, color: 'white', padding: '2.5cm 1.5cm', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Contact */}
        <div>
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.25rem', lineHeight: 1.2, wordBreak: 'break-word' }}>
            {personalInfo.fullName || 'Votre Nom'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#93c5fd', fontWeight: 500, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {personalInfo.jobTitle || 'Titre Professionnel'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
            {personalInfo.email && <p style={{ wordBreak: 'break-all' }}>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
          </div>
        </div>

        {sidebarSections.map(id => sectionRenderers[id]())}
      </div>

      {/* Right Main Content */}
      <div style={{ padding: '2.5cm 1.5cm', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Profil Summary */}
        {personalInfo.summary && (
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: accentColor, borderBottom: '2px solid', borderColor: themeColor, paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              Profil
            </h3>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {mainSections.map(id => sectionRenderers[id]())}
      </div>
    </div>
  );
};

export default ClassicTemplate;
