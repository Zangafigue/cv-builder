import { useCv } from '../../context/CvContext';
import FormatDate from './shared/FormatDate';
import SkillBar from './shared/SkillBar';
const MinimalistTemplate = () => {
  const { cvData } = useCv();
  const { personalInfo, experience, education, skills, languages } = cvData;

  const sectionsOrder = cvData.sectionsOrder || ['experience', 'education', 'skills', 'languages'];

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div key="experience" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '1rem', fontWeight: 600 }}>
          Expérience Professionnelle
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {experience.map(exp => (
            <div key={exp.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '1rem' }}>{exp.position}</strong>
                <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                  <FormatDate dateString={exp.startDate} /> — {exp.current ? 'Présent' : <FormatDate dateString={exp.endDate} />}
                </span>
              </div>
              <div style={{ fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{exp.company}</div>
              <ul style={{ fontSize: '0.85rem', paddingLeft: '1.5rem', margin: 0 }}>
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
      <div key="education" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '1rem', fontWeight: 600 }}>
          Formation & Diplômes
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {education.map(edu => (
            <div key={edu.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '1rem' }}>{edu.degree} {edu.field ? `- ${edu.field}` : ''}</strong>
                <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                  <FormatDate dateString={edu.startDate} /> — {edu.current ? 'Présent' : <FormatDate dateString={edu.endDate} />}
                </span>
              </div>
              <div style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>{edu.school}</div>
              {edu.description && (
                <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>{edu.description}</p>
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
      <div key="skills">
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '1rem', fontWeight: 600 }}>
          Compétences
        </h3>
        <ul style={{ fontSize: '0.85rem', listStyleType: 'none', padding: 0, margin: 0 }}>
          {skills.map(skill => (
            <li key={skill.id} style={{ marginBottom: '0.5rem' }}>
              <SkillBar 
                name={skill.name} 
                level={skill.level} 
                color="#111827" 
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
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '1rem', fontWeight: 600 }}>
          Langues
        </h3>
        <ul style={{ fontSize: '0.85rem', listStyleType: 'none', padding: 0, margin: 0 }}>
          {languages.map(lang => (
            <li key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>{lang.name}</span>
              <span style={{ color: '#6b7280' }}>{lang.level}</span>
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
  const bottomSections = sectionsOrder.filter(id => ['skills', 'languages'].includes(id));
  return (
    <div 
      className="cv-document animate-fade-in" 
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: 'white',
        padding: '2.5cm',
        boxSizing: 'border-box',
        color: '#111827',
        fontFamily: 'var(--cv-font-family)',
        fontSize: 'var(--cv-font-size)',
        lineHeight: 'var(--cv-line-height)'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem', fontWeight: 400, letterSpacing: '0.05em' }}>
          {personalInfo.fullName || 'Votre Nom'}
        </h1>
        <h2 style={{ fontSize: '1rem', color: '#4b5563', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
          {personalInfo.jobTitle || 'Titre Professionnel'}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', color: '#374151', fontSize: '0.85rem' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {(personalInfo.email || personalInfo.phone) && personalInfo.location && <span>|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>
      
      {/* Profil Summary */}
      {personalInfo.summary && (
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.95rem', fontStyle: 'italic', textAlign: 'center', maxWidth: '80%', margin: '0 auto' }}>
            {personalInfo.summary}
          </p>
        </div>
      )}
      
      {mainSections.map(id => sectionRenderers[id]())}

      {/* Skills & Langues - Flex layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {bottomSections.map(id => sectionRenderers[id]())}
      </div>

    </div>
  );
};

export default MinimalistTemplate;
