import { useCv } from '../../context/CvContext';
import FormatDate from './shared/FormatDate';
import SkillBar from './shared/SkillBar';
const ModernAltTemplate = () => {
  const { cvData } = useCv();
  const { personalInfo, experience, education, skills, languages, themeColor } = cvData;

  const sectionsOrder = cvData.sectionsOrder || ['experience', 'education', 'skills', 'languages'];

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div key="experience" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: themeColor, margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>Expérience</h3>
          <div style={{ height: '2px', backgroundColor: '#e5e7eb', flex: 1 }}></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '0', top: '10px', bottom: '10px', width: '2px', backgroundColor: `${themeColor}40` }} />
          {experience.map(exp => (
            <div key={exp.id} style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              <div style={{ position: 'absolute', left: '-4px', top: '6px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: themeColor }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#111827' }}>{exp.position}</h4>
                <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>
                  <FormatDate dateString={exp.startDate} /> - {exp.current ? 'Présent' : <FormatDate dateString={exp.endDate} />}
                </span>
              </div>
              <div style={{ fontSize: '0.95rem', color: themeColor, fontWeight: 600, marginBottom: '0.5rem' }}>{exp.company}</div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.5' }}>
                {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>{line.replace(/^- /, '')}</li>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: themeColor, margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>Formation</h3>
          <div style={{ height: '2px', backgroundColor: '#e5e7eb', flex: 1 }}></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '0', top: '10px', bottom: '10px', width: '2px', backgroundColor: `${themeColor}40` }} />
          {education.map(edu => (
            <div key={edu.id} style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              <div style={{ position: 'absolute', left: '-4px', top: '6px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: themeColor }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700, color: '#111827' }}>{edu.degree} {edu.field ? `- ${edu.field}` : ''}</h4>
                <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>
                  <FormatDate dateString={edu.startDate} /> - {edu.current ? 'Présent' : <FormatDate dateString={edu.endDate} />}
                </span>
              </div>
              <div style={{ fontSize: '0.95rem', color: '#4b5563', fontWeight: 600 }}>{edu.school}</div>
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
        <h3 style={{ fontSize: '1.1rem', color: themeColor, margin: '0 0 1.25rem 0', fontWeight: 700, textTransform: 'uppercase' }}>Expertise</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {skills.map(skill => (
            <div key={skill.id} style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <SkillBar 
                name={skill.name} 
                level={skill.level} 
                color={themeColor} 
                bgColor="#f3f4f6"
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
        <h3 style={{ fontSize: '1.1rem', color: themeColor, margin: '0 0 1.25rem 0', fontWeight: 700, textTransform: 'uppercase' }}>Langues</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {languages.map(lang => (
            <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#374151' }}>{lang.name}</span>
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{lang.level}</span>
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
        boxSizing: 'border-box',
        color: '#1f2937',
        fontFamily: 'var(--cv-font-family)',
        fontSize: 'var(--cv-font-size)',
        lineHeight: 'var(--cv-line-height)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header Full Width */}
      <div style={{ backgroundColor: themeColor, color: 'white', padding: '2.5rem 3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ maxWidth: '60%' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              {personalInfo.fullName || 'Votre Nom'}
            </h1>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 500, opacity: 0.9, letterSpacing: '1px', textTransform: 'uppercase' }}>
              {personalInfo.jobTitle || 'Titre Professionnel'}
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', textAlign: 'right', opacity: 0.9 }}>
            {personalInfo.email && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>{personalInfo.email} ✉</div>}
            {personalInfo.phone && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>{personalInfo.phone} ☎</div>}
            {personalInfo.location && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>{personalInfo.location} 𖡡</div>}
            {personalInfo.linkedin && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>{personalInfo.linkedin} in/</div>}
          </div>
        </div>
        
        {/* Profil Summary within Header but isolated */}
        {personalInfo.summary && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', borderLeft: '4px solid white' }}>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
              {personalInfo.summary}
            </p>
          </div>
        )}
      </div>

      {/* Content - Main (Left) / Sidebar (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', flex: 1 }}>
        
        {/* Main Content */}
        <div style={{ padding: '2.5rem 2rem 2.5rem 3rem' }}>
          
          {/* Main Sections */}
          {mainSections.map(id => sectionRenderers[id]())}
        </div>

        {/* Sidebar (Right) */}
        <div style={{ backgroundColor: '#f9fafb', padding: '2.5rem 2rem 2.5rem 1.5rem', borderLeft: '1px solid #e5e7eb' }}>
          
          {/* Sidebar Sections */}
          {sidebarSections.map(id => sectionRenderers[id]())}
        </div>
      </div>
    </div>
  );
};

export default ModernAltTemplate;
