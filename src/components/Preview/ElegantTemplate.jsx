import { useCv } from '../../context/CvContext';
import FormatDate from './shared/FormatDate';
import SkillBar from './shared/SkillBar';
const ElegantTemplate = () => {
  const { cvData } = useCv();
  const { personalInfo, experience, education, skills, languages, themeColor } = cvData;

  const sectionsOrder = cvData.sectionsOrder || ['experience', 'education', 'skills', 'languages'];

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div key="experience" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: 600 }}>Expérience</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {experience.map(exp => (
            <div key={exp.id}>
              <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', fontWeight: 600 }}>{exp.position}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Lato', sans-serif", fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                <span>{exp.company}</span>
                <span><FormatDate dateString={exp.startDate} /> — {exp.current ? 'Présent' : <FormatDate dateString={exp.endDate} />}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontFamily: "'Lato', sans-serif", fontSize: '0.9rem', color: '#374151' }}>
                {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                  <li key={i} style={{ marginBottom: '0.3rem' }}>{line.replace(/^- /, '')}</li>
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
      <div key="education" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: 600 }}>Formation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {education.map(edu => (
            <div key={edu.id}>
              <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0', fontWeight: 600 }}>{edu.degree} {edu.field ? `- ${edu.field}` : ''}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Lato', sans-serif", fontSize: '0.85rem', color: '#6b7280', fontStyle: 'italic' }}>
                <span>{edu.school}</span>
                <span><FormatDate dateString={edu.startDate} /> — {edu.current ? 'Présent' : <FormatDate dateString={edu.endDate} />}</span>
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
      <div key="skills" style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: 600 }}>Compétences</h3>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontFamily: "'Lato', sans-serif", fontSize: '0.9rem', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {skills.map(skill => (
            <li key={skill.id} style={{ borderBottom: '1px dashed #e5e7eb', paddingBottom: '0.6rem' }}>
              <SkillBar 
                name={skill.name} 
                level={skill.level} 
                color={themeColor} 
                bgColor="#e5e7eb"
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderLanguages = () => {
    if (languages.length === 0) return null;
    return (
      <div key="languages">
        <h3 style={{ fontSize: '1rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: 600 }}>Langues</h3>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontFamily: "'Lato', sans-serif", fontSize: '0.9rem', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {languages.map(lang => (
            <li key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#1f2937' }}>{lang.name}</span>
              <span style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>{lang.level}</span>
            </li>
          ))}
        </ul>
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
        backgroundColor: '#fdfbfb',
        boxSizing: 'border-box',
        color: '#333333',
        fontFamily: 'var(--cv-font-family)',
        padding: '2.5cm 2cm',
        fontSize: 'var(--cv-font-size)',
        lineHeight: 'var(--cv-line-height)'
      }}
    >
      {/* Header Centralisé avec lignes fines */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          margin: '0 0 0.5rem 0', 
          fontWeight: 400, 
          letterSpacing: '3px',
          color: themeColor,
          textTransform: 'uppercase'
        }}>
          {personalInfo.fullName || 'Votre Nom'}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1rem 0' }}>
          <div style={{ height: '1px', width: '40px', backgroundColor: '#d1d5db' }}></div>
          <h2 style={{ 
            fontSize: '1rem', 
            margin: '0 1rem', 
            fontWeight: 400, 
            letterSpacing: '2px', 
            textTransform: 'uppercase',
            color: '#6b7280'
          }}>
            {personalInfo.jobTitle || 'Titre Professionnel'}
          </h2>
          <div style={{ height: '1px', width: '40px', backgroundColor: '#d1d5db' }}></div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem', fontFamily: "'Lato', sans-serif", fontSize: '0.85rem', color: '#4b5563', marginTop: '1.5rem' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 220px', gap: '3rem' }}>
        {/* Main Column */}
        <div>
          {/* Summary */}
          {personalInfo.summary && (
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem', fontWeight: 600 }}>Profil</h3>
              <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.95rem', color: '#4b5563' }}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Main Content Sections */}
          {mainSections.map(id => sectionRenderers[id]())}
        </div>

        {/* Sidebar (Skills & Languages) */}
        <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '2rem' }}>
          {/* Sidebar Sections */}
          {sidebarSections.map(id => sectionRenderers[id]())}
        </div>
      </div>
    </div>
  );
};

export default ElegantTemplate;
