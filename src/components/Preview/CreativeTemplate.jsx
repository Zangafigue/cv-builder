import { useCv } from '../../context/CvContext';
import FormatDate from './shared/FormatDate';
import SkillBar from './shared/SkillBar';
const CreativeTemplate = () => {
  const { cvData } = useCv();
  const { personalInfo, experience, education, skills, languages, themeColor } = cvData;  const sectionsOrder = cvData.sectionsOrder || ['experience', 'education', 'skills', 'languages'];

  const renderSkills = () => {
    if (skills.length === 0) return null;
    return (
      <div key="skills" style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '0.5rem' }}>Expertise</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {skills.map(skill => (
            <div key={skill.id}>
              <SkillBar 
                name={skill.name} 
                level={skill.level} 
                color="white" 
                bgColor="rgba(255,255,255,0.2)"
                showLabel={false}
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
      <div key="languages" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '0.5rem' }}>Langues</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {languages.map(lang => (
            <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <strong>{lang.name}</strong>
              <span style={{ opacity: 0.9 }}>{lang.level}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div key="experience" style={{ marginBottom: '3rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', color: themeColor, margin: '0 0 1.5rem 0', fontWeight: 800 }}>
          <span style={{ width: '30px', height: '3px', backgroundColor: themeColor }} /> Expérience Pro
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
          {/* Timeline line */}
          <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', backgroundColor: '#e5e7eb' }} />
          
          {experience.map((exp) => (
            <div key={exp.id} style={{ position: 'relative', paddingLeft: '2rem' }}>
              {/* Timeline dot */}
              <div style={{ position: 'absolute', left: '6px', top: '6px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: themeColor, border: '3px solid #fafafa' }} />
              
              <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', fontWeight: 700, color: '#1f2937' }}>{exp.position}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: themeColor, fontWeight: 600 }}>{exp.company}</span>
                <span style={{ fontSize: '0.8rem', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '10px' }}>
                  <FormatDate dateString={exp.startDate} /> - {exp.current ? 'Présent' : <FormatDate dateString={exp.endDate} />}
                </span>
              </div>
              <ul style={{ fontSize: '0.9rem', color: '#4b5563', paddingLeft: '1.2rem', margin: 0, lineHeight: 1.6 }}>
                {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                  <li key={i} style={{ marginBottom: '0.2rem' }}>{line.replace(/^- /, '')}</li>
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
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', color: themeColor, margin: '0 0 1.5rem 0', fontWeight: 800 }}>
          <span style={{ width: '30px', height: '3px', backgroundColor: themeColor }} /> Formation
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', backgroundColor: '#e5e7eb' }} />
          
          {education.map(edu => (
            <div key={edu.id} style={{ position: 'relative', paddingLeft: '2rem' }}>
              <div style={{ position: 'absolute', left: '6px', top: '6px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: themeColor, border: '3px solid #fafafa' }} />
              
              <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', fontWeight: 700, color: '#1f2937' }}>{edu.degree} {edu.field ? `- ${edu.field}` : ''}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.9rem', color: themeColor, fontWeight: 600 }}>{edu.school}</span>
                <span style={{ fontSize: '0.8rem', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '10px' }}>
                  <FormatDate dateString={edu.startDate} /> - {edu.current ? 'Présent' : <FormatDate dateString={edu.endDate} />}
                </span>
              </div>
              {edu.description && (
                 <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: '0.5rem 0 0 0' }}>{edu.description}</p>
              )}
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

  const sidebarSections = sectionsOrder.filter(id => ['skills', 'languages'].includes(id));
  const mainSections = sectionsOrder.filter(id => ['experience', 'education'].includes(id));

  return (
    <div 
      className="cv-document animate-fade-in" 
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        color: '#1f2937',
        fontFamily: 'var(--cv-font-family)',
        fontSize: 'var(--cv-font-size)',
        lineHeight: 'var(--cv-line-height)',
        display: 'grid',
        gridTemplateColumns: '32% 68%',
      }}
    >
      {/* Left Sidebar - Distinctive color block */}
      <div style={{ backgroundColor: themeColor, color: 'white', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
        
        {/* Profile Info */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          {/* Circular initials as logo substitute */}
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
            fontSize: '2.5rem', fontWeight: 'bold', color: 'white', border: '3px solid rgba(255,255,255,0.5)'
          }}>
            {personalInfo.fullName ? personalInfo.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CV'}
          </div>
          
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 800, lineHeight: 1.1 }}>
            {personalInfo.fullName || 'Votre Nom'}
          </h1>
          <h2 style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.9, letterSpacing: '1px', textTransform: 'uppercase' }}>
            {personalInfo.jobTitle || 'Titre Professionnel'}
          </h2>
        </div>

        {/* Contact info list */}
        <div style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '0.5rem' }}>Contact</h3>
          {personalInfo.email && <div><strong>Email:</strong><br/>{personalInfo.email}</div>}
          {personalInfo.phone && <div><strong>Tél:</strong><br/>{personalInfo.phone}</div>}
          {personalInfo.location && <div><strong>Adresse:</strong><br/>{personalInfo.location}</div>}
          {personalInfo.linkedin && <div><strong>LinkedIn:</strong><br/>{personalInfo.linkedin}</div>}
          {personalInfo.website && <div><strong>Site Web:</strong><br/>{personalInfo.website}</div>}
        </div>

        {/* Visual Skills & Languages */}
        {sidebarSections.map(id => sectionRenderers[id]())}
      </div>

      {/* Right Main Content */}
      <div style={{ padding: '3.5rem 2.5rem', backgroundColor: '#fafafa' }}>
        
        {/* Profile Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', color: themeColor, margin: '0 0 1rem 0', fontWeight: 800 }}>
              <span style={{ width: '30px', height: '3px', backgroundColor: themeColor }} /> À Propos
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#4b5563' }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {mainSections.map(id => sectionRenderers[id]())}

      </div>
    </div>
  );
};

export default CreativeTemplate;
