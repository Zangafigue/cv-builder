import { useCv } from '../../context/CvContext';
import FormatDate from './shared/FormatDate';
import SkillBar from './shared/SkillBar';
const ModernTemplate = () => {
  const { cvData } = useCv();
  const { personalInfo, experience, education, skills, languages, themeColor } = cvData;

  const sectionsOrder = cvData.sectionsOrder || ['experience', 'education', 'skills', 'languages'];

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div key="experience" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1.25rem', fontWeight: 600 }}>
          Expérience Professionnelle
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {experience.map(exp => (
            <div key={exp.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                <strong style={{ fontSize: '1rem', color: '#1f2937' }}>{exp.position}</strong>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  <FormatDate dateString={exp.startDate} /> - {exp.current ? 'Présent' : <FormatDate dateString={exp.endDate} />}
                </span>
              </div>
              <div style={{ color: themeColor, fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>{exp.company}</div>
              <ul style={{ color: '#4b5563', fontSize: '0.875rem', paddingLeft: '1.25rem', lineHeight: '1.5', margin: 0 }}>
                {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                  <li key={i}>{line.replace(/^- /, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    if (education.length === 0) return null;
    return (
      <div key="education" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1.25rem', fontWeight: 600 }}>
          Formation
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {education.map(edu => (
            <div key={edu.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                <strong style={{ fontSize: '1rem', color: '#1f2937' }}>{edu.degree} {edu.field ? `- ${edu.field}` : ''}</strong>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  <FormatDate dateString={edu.startDate} /> - {edu.current ? 'Présent' : <FormatDate dateString={edu.endDate} />}
                </span>
              </div>
              <div style={{ color: themeColor, fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>{edu.school}</div>
              {edu.description && (
                <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-line' }}>
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    if (skills.length === 0) return null;
    return (
      <div key="skills" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1.25rem', fontWeight: 600 }}>
          Compétences
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {skills.map(skill => (
            <div key={skill.id}>
              <SkillBar 
                name={skill.name} 
                level={skill.level} 
                color={themeColor} 
                bgColor="#e5e7eb"
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
      <div key="languages" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1.25rem', fontWeight: 600 }}>
          Langues
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {languages.map(lang => (
            <div key={lang.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '1em', color: '#1f2937', fontWeight: 500 }}>
                <span>{lang.name}</span>
                <span style={{ color: '#6b7280', fontSize: '0.85em' }}>{lang.level}</span>
              </div>
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
        padding: '2.5cm',
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        color: '#1f2937', // slate-800
        fontFamily: 'var(--cv-font-family)',
        fontSize: 'var(--cv-font-size)',
        lineHeight: 'var(--cv-line-height)'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: `2px solid ${themeColor}`, paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', color: themeColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
          {personalInfo.fullName || 'Votre Nom'}
        </h1>
        <h2 style={{ fontSize: '1.25rem', color: '#4b5563', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '2px' }}>
          {personalInfo.jobTitle || 'Titre Professionnel'}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {(personalInfo.email || personalInfo.phone) && personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>
      
      {/* Profil Summary */}
      {personalInfo.summary && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 600 }}>
            Profil
          </h3>
          <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {personalInfo.summary}
          </p>
        </div>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column (Main content) */}
        <div>
          {mainSections.map(id => sectionRenderers[id]())}
        </div>

        {/* Right Column (Sidebar) */}
        <div>
          {sidebarSections.map(id => sectionRenderers[id]())}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
