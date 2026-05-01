import { useCv } from '../../context/CvContext';
import FormatDate from './shared/FormatDate';
import SectionTitle from './shared/SectionTitle';


const ExecutiveTemplate = () => {
  const { cvData } = useCv();
  const { personalInfo, experience, education, skills, languages, themeColor } = cvData;

  const sectionsOrder = cvData.sectionsOrder || ['experience', 'education', 'skills', 'languages'];

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div key="experience" style={{ marginBottom: '2.5rem' }}>
        <SectionTitle title="Expérience Professionnelle" themeColor={themeColor} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {experience.map(exp => (
            <div key={exp.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: themeColor, fontWeight: 600 }}>
                <FormatDate dateString={exp.startDate} /><br/>
                — {exp.current ? 'Présent' : <FormatDate dateString={exp.endDate} />}
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0', fontWeight: 700 }}>{exp.position}</h4>
                <div style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '0.5rem', fontWeight: 600 }}>{exp.company}</div>
                <ul style={{ fontSize: '0.9rem', paddingLeft: '1.25rem', margin: 0, color: '#374151', lineHeight: '1.5' }}>
                  {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{line.replace(/^- /, '')}</li>
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
      <div key="education" style={{ marginBottom: '2.5rem' }}>
        <SectionTitle title="Formation" themeColor={themeColor} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {education.map(edu => (
            <div key={edu.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: themeColor, fontWeight: 600 }}>
                <FormatDate dateString={edu.startDate} />
                {edu.endDate ? <> — {edu.current ? 'Présent' : <FormatDate dateString={edu.endDate} />}</> : (edu.current && ' — Présent')}
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0', fontWeight: 700 }}>{edu.degree} {edu.field ? `- ${edu.field}` : ''}</h4>
                <div style={{ fontSize: '0.9rem', color: '#4b5563' }}>{edu.school}</div>
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
        <SectionTitle title="Compétences Clés" themeColor={themeColor} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {skills.map(skill => (
            <span key={skill.id} style={{ 
              backgroundColor: '#f3f4f6', 
              color: '#374151', 
              padding: '0.3rem 0.8rem', 
              borderRadius: '4px', 
              fontSize: '0.85rem', 
              fontWeight: 500,
              border: '1px solid #e5e7eb'
            }}>
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguages = () => {
    if (languages.length === 0) return null;
    return (
      <div key="languages">
        <SectionTitle title="Langues" themeColor={themeColor} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {languages.map(lang => (
            <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ fontWeight: 600 }}>{lang.name}</span>
              <span style={{ color: '#4b5563' }}>{lang.level}</span>
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
  const bottomSections = sectionsOrder.filter(id => ['skills', 'languages'].includes(id));
  
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
        lineHeight: 'var(--cv-line-height)'
      }}
    >
      {/* Heavy Top Border Header */}
      <div style={{ backgroundColor: themeColor, padding: '2.5rem', color: 'white' }}>
        <h1 style={{ fontSize: '2.75rem', marginBottom: '0.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
          {personalInfo.fullName || 'Votre Nom'}
        </h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 500, letterSpacing: '1px', opacity: 0.9 }}>
          {personalInfo.jobTitle || 'Titre Professionnel'}
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1.5rem', fontSize: '0.85rem', opacity: 0.85 }}>
          {personalInfo.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✉ {personalInfo.email}</div>}
          {personalInfo.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>☎ {personalInfo.phone}</div>}
          {personalInfo.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>𖡡 {personalInfo.location}</div>}
          {personalInfo.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>in/ {personalInfo.linkedin}</div>}
        </div>
      </div>
      
      <div style={{ padding: '2.5rem' }}>
        {/* Profil Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '2.5rem' }}>
            <SectionTitle title="Profil" themeColor={themeColor} />
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#374151' }}>
              {personalInfo.summary}
            </p>
          </div>
        )}
        
        {mainSections.map(id => sectionRenderers[id]())}

        {/* Skills & Langues - Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
          {bottomSections.map(id => sectionRenderers[id]())}
        </div>

      </div>
    </div>
  );
};

export default ExecutiveTemplate;
