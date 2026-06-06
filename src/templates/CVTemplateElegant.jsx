import { getTranslation } from './shared/translations';
import CvPhoto from './shared/CvPhoto';
import React from 'react';
import FormatDate from './shared/FormatDate';
import SkillBar from './shared/SkillBar';

export default function CVTemplateElegant({ data }) {
  const language = data?.language || 'FR';
  const t = (key) => getTranslation(key, language);
  const { 
    personalInfo = {}, 
    experience = [], 
    education = [], 
    skills = [], 
    languages = [], 
    interests = [],
    certifications = [],
    projects = [],
    extracurricular = [],
    customSections = [],
    themeColor = '#3b82f6',
    sectionsOrder = ['experience', 'education', 'skills', 'languages']
  } = data || {};

  // Inject Lato font if not present
  React.useEffect(() => {
    if (!document.getElementById('lato-font-link')) {
      const link = document.createElement('link');
      link.id = 'lato-font-link';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

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
                <span>{exp.company} {exp.location && `· ${exp.location}`}</span>
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
        <h3 style={{ fontSize: '1.2rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: 600 }}>{t('education')}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {education.map(edu => (
            <div key={edu.id}>
              <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0', fontWeight: 600 }}>{edu.degree} {edu.field ? `- ${edu.field}` : ''}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Lato', sans-serif", fontSize: '0.85rem', color: '#6b7280', fontStyle: 'italic' }}>
                <span>{edu.school} {edu.location && `· ${edu.location}`}</span>
                <span><FormatDate dateString={edu.startDate} /> — {edu.current ? 'Présent' : <FormatDate dateString={edu.endDate} />}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (projects.length === 0) return null;
    return (
      <div key="projects" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: 600 }}>{t('projects')}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {projects.map(proj => (
            <div key={proj.id}>
              <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0', fontWeight: 600 }}>{proj.title}</h4>
              {proj.type && <div style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.85rem', color: '#6b7280', fontStyle: 'italic', marginBottom: '0.25rem' }}>{proj.type}</div>}
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontFamily: "'Lato', sans-serif", fontSize: '0.9rem', color: '#374151' }}>
                {Array.isArray(proj.bullets) ? proj.bullets.map((b, i) => (
                  <li key={i} style={{ marginBottom: '0.3rem' }}>{b}</li>
                )) : proj.description?.split('\n').filter(line => line.trim()).map((line, i) => (
                  <li key={i} style={{ marginBottom: '0.3rem' }}>{line.replace(/^- /, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExtracurricular = () => {
    if (extracurricular.length === 0) return null;
    return (
      <div key="extracurricular" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: 600 }}>Activités</h3>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontFamily: "'Lato', sans-serif", fontSize: '0.9rem', color: '#374151' }}>
          {extracurricular.map((item, i) => (
            <li key={i} style={{ marginBottom: '0.35rem' }}>
              {typeof item === 'string' ? item : (item.name || item.description)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderSkills = () => {
    if (skills.length === 0) return null;
    return (
      <div key="skills" style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: 600 }}>{t('skills')}</h3>
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
        <h3 style={{ fontSize: '1rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: 600 }}>{t('languages')}</h3>
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

  const renderCertifications = () => {
    if (certifications.length === 0) return null;
    return (
      <div key="certifications" style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: 600 }}>{t('certifications')}</h3>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontFamily: "'Lato', sans-serif", fontSize: '0.9rem', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {certifications.map(c => (
            <li key={c.id} style={{ borderBottom: '1px dashed #e5e7eb', paddingBottom: '0.4rem' }}>
              <strong style={{ color: '#1f2937', display: 'block' }}>{c.name}</strong>
              {c.org && <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{c.org} {c.date && `· ${c.date}`}</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderInterests = () => {
    if (interests.length === 0) return null;
    return (
      <div key="interests" style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: 600 }}>{t('interests')}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', fontFamily: "'Lato', sans-serif" }}>
          {interests.map((i, idx) => (
            <span key={idx} style={{ border: '1px solid #cbd5e1', padding: '0.2rem 0.5rem', fontSize: '0.8rem', color: '#4b5563', borderRadius: '2px' }}>
              {i.name || i}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderCustomSections = () => {
    if (customSections.length === 0) return null;
    return customSections.map(cs => (
      <div key={cs.id} style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: 600 }}>{cs.name}</h3>
        <div style={{ color: '#374151', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-line', fontFamily: "'Lato', sans-serif" }}>
          {cs.content}
        </div>
      </div>
    ));
  };

  const sectionRenderers = {
    experience: renderExperience,
    education: renderEducation,
    projects: renderProjects,
    extracurricular: renderExtracurricular,
    skills: renderSkills,
    languages: renderLanguages,
    certifications: renderCertifications,
    interests: renderInterests,
    customSections: renderCustomSections
  };

  const mainSections = sectionsOrder.filter(id => ['experience', 'education', 'projects', 'extracurricular', 'customSections'].includes(id));
  const sidebarSections = sectionsOrder.filter(id => ['skills', 'languages', 'certifications', 'interests'].includes(id));

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
        <CvPhoto photo={personalInfo.photo} settings={personalInfo.photoSettings} size={104} style={{ margin: '0 auto 1.25rem' }} />
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
              <h3 style={{ fontSize: '1.2rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem', fontWeight: 600 }}>{t('profile')}</h3>
              <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.95rem', color: '#4b5563' }}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Main Content Sections */}
          {mainSections.map(id => sectionRenderers[id] ? sectionRenderers[id]() : null)}
        </div>

        {/* Sidebar (Skills & Languages) */}
        <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '2rem' }}>
          {/* Sidebar Sections */}
          {sidebarSections.map(id => sectionRenderers[id] ? sectionRenderers[id]() : null)}
        </div>
      </div>
    </div>
  );
}
