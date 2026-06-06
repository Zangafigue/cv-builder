import { getTranslation } from './shared/translations';
import CvPhoto from './shared/CvPhoto';
import React from 'react';
import FormatDate from './shared/FormatDate';
import SkillBar from './shared/SkillBar';

export default function CVTemplateTimeline({ data }) {
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

  const renderFullName = () => {
    const name = personalInfo.fullName || '';
    if (!name) return <span style={{ color: themeColor }}>Votre Nom</span>;
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return <span style={{ color: themeColor }}>Votre Nom</span>;
    return (
      <>
        <strong style={{ fontWeight: 700, color: themeColor }}>{parts[0]}</strong>{' '}
        {parts.slice(1).join(' ')}
      </>
    );
  };

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div key="experience" style={{ display: 'flex' }}>
        {/* Left side: Section Title */}
        <div style={{ width: '140px', textAlign: 'right', paddingRight: '2rem', flexShrink: 0 }}>
          <h3 style={{ fontSize: '1rem', color: themeColor, textTransform: 'uppercase', fontWeight: 700, margin: '0' }}>Expérience</h3>
        </div>
        {/* Middle: Line */}
        <div style={{ width: '2px', backgroundColor: '#e2e8f0', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', backgroundColor: themeColor, borderRadius: '50%' }}></div>
        </div>
        {/* Right side: Content */}
        <div style={{ flex: 1, paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {experience.map((exp, idx) => (
            <div key={exp.id} style={{ position: 'relative' }}>
              {idx > 0 && <div style={{ position: 'absolute', top: '8px', left: '-35px', width: '10px', height: '10px', backgroundColor: '#cbd5e0', borderRadius: '50%', border: '2px solid white' }}></div>}
              
              <div style={{ fontSize: '0.85rem', color: themeColor, fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '1px' }}>
                <FormatDate dateString={exp.startDate} format="numeric" /> - {exp.current ? 'Présent' : <FormatDate dateString={exp.endDate} format="numeric" />}
              </div>
              <h4 style={{ fontSize: '1.2rem', margin: '0 0 0.25rem 0', fontWeight: 700, color: '#2d3748' }}>{exp.position}</h4>
              <div style={{ fontSize: '0.95rem', color: '#4a5568', fontWeight: 600, marginBottom: '0.5rem' }}>{exp.company} {exp.location && `· ${exp.location}`}</div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.6' }}>
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
      <div key="education" style={{ display: 'flex' }}>
        <div style={{ width: '140px', textAlign: 'right', paddingRight: '2rem', flexShrink: 0 }}>
          <h3 style={{ fontSize: '1rem', color: '#a0aec0', textTransform: 'uppercase', fontWeight: 700, margin: '0' }}>{t('education')}</h3>
        </div>
        <div style={{ width: '2px', backgroundColor: '#e2e8f0', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', backgroundColor: '#a0aec0', borderRadius: '50%' }}></div>
        </div>
        <div style={{ flex: 1, paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {education.map((edu, idx) => (
            <div key={edu.id} style={{ position: 'relative' }}>
              {idx > 0 && <div style={{ position: 'absolute', top: '8px', left: '-35px', width: '10px', height: '10px', backgroundColor: '#cbd5e0', borderRadius: '50%', border: '2px solid white' }}></div>}
              
              <div style={{ fontSize: '0.85rem', color: '#a0aec0', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '1px' }}>
                <FormatDate dateString={edu.startDate} format="numeric" /> - {edu.current ? 'Présent' : <FormatDate dateString={edu.endDate} format="numeric" />}
              </div>
              <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', fontWeight: 700, color: '#2d3748' }}>{edu.degree} {edu.field ? `- ${edu.field}` : ''}</h4>
              <div style={{ fontSize: '0.95rem', color: '#4a5568', fontWeight: 600 }}>{edu.school} {edu.location && `· ${edu.location}`}</div>
              {edu.description && (
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#4a5568' }}>{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (projects.length === 0) return null;
    return (
      <div key="projects" style={{ display: 'flex' }}>
        <div style={{ width: '140px', textAlign: 'right', paddingRight: '2rem', flexShrink: 0 }}>
          <h3 style={{ fontSize: '1rem', color: '#a0aec0', textTransform: 'uppercase', fontWeight: 700, margin: '0' }}>{t('projects')}</h3>
        </div>
        <div style={{ width: '2px', backgroundColor: '#e2e8f0', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', backgroundColor: '#a0aec0', borderRadius: '50%' }}></div>
        </div>
        <div style={{ flex: 1, paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {projects.map((proj, idx) => (
            <div key={proj.id} style={{ position: 'relative' }}>
              {idx > 0 && <div style={{ position: 'absolute', top: '8px', left: '-35px', width: '10px', height: '10px', backgroundColor: '#cbd5e0', borderRadius: '50%', border: '2px solid white' }}></div>}
              <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', fontWeight: 700, color: '#2d3748' }}>{proj.title}</h4>
              {proj.type && <div style={{ fontSize: '0.9rem', color: themeColor, fontWeight: 600, marginBottom: '0.5rem' }}>{proj.type}</div>}
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.6' }}>
                {Array.isArray(proj.bullets) ? proj.bullets.map((b, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>{b}</li>
                )) : proj.description?.split('\n').filter(line => line.trim()).map((line, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>{line.replace(/^- /, '')}</li>
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
      <div key="extracurricular" style={{ display: 'flex' }}>
        <div style={{ width: '140px', textAlign: 'right', paddingRight: '2rem', flexShrink: 0 }}>
          <h3 style={{ fontSize: '1rem', color: '#a0aec0', textTransform: 'uppercase', fontWeight: 700, margin: '0' }}>Activités</h3>
        </div>
        <div style={{ width: '2px', backgroundColor: '#e2e8f0', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', backgroundColor: '#a0aec0', borderRadius: '50%' }}></div>
        </div>
        <div style={{ flex: 1, paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.6' }}>
            {extracurricular.map((item, i) => (
              <li key={i}>
                {typeof item === 'string' ? item : (item.name || item.description)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    if (skills.length === 0) return null;
    return (
      <div key="skills">
        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: themeColor, fontWeight: 700, marginBottom: '1rem' }}>{t('skills')}</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {skills.map(skill => (
            <div key={skill.id}>
              <SkillBar 
                name={skill.name} 
                level={skill.level} 
                color={themeColor} 
                bgColor="#e2e8f0"
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
        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#718096', fontWeight: 700, marginBottom: '1rem' }}>{t('languages')}</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
          {languages.map(lang => (
            <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{lang.name}</strong>
              <span style={{ color: '#718096' }}>{lang.level}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    if (certifications.length === 0) return null;
    return (
      <div key="certifications" style={{ display: 'flex' }}>
        <div style={{ width: '140px', textAlign: 'right', paddingRight: '2rem', flexShrink: 0 }}>
          <h3 style={{ fontSize: '1rem', color: '#a0aec0', textTransform: 'uppercase', fontWeight: 700, margin: '0' }}>{t('certifications')}</h3>
        </div>
        <div style={{ width: '2px', backgroundColor: '#e2e8f0', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', backgroundColor: '#a0aec0', borderRadius: '50%' }}></div>
        </div>
        <div style={{ flex: 1, paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
          {certifications.map(c => (
            <div key={c.id}>
              <strong>{c.name}</strong>
              {c.org && <span style={{ color: '#718096' }}> ({c.org} {c.date && `· ${c.date}`})</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInterests = () => {
    if (interests.length === 0) return null;
    return (
      <div key="interests">
        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#718096', fontWeight: 700, marginBottom: '1rem' }}>{t('interests')}</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {interests.map((i, idx) => (
            <span key={idx} style={{ border: '1px solid #e2e8f0', color: '#4a5568', padding: '0.15rem 0.4rem', fontSize: '0.75rem', borderRadius: '3px' }}>
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
      <div key={cs.id} style={{ display: 'flex' }}>
        <div style={{ width: '140px', textAlign: 'right', paddingRight: '2rem', flexShrink: 0 }}>
          <h3 style={{ fontSize: '1rem', color: '#a0aec0', textTransform: 'uppercase', fontWeight: 700, margin: '0' }}>{cs.name}</h3>
        </div>
        <div style={{ width: '2px', backgroundColor: '#e2e8f0', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', backgroundColor: '#a0aec0', borderRadius: '50%' }}></div>
        </div>
        <div style={{ flex: 1, paddingLeft: '2rem', color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
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

  const mainSections = sectionsOrder.filter(id => ['experience', 'education', 'projects', 'extracurricular', 'certifications', 'customSections'].includes(id));
  const bottomSections = sectionsOrder.filter(id => ['skills', 'languages', 'interests'].includes(id));

  return (
    <div 
      className="cv-document animate-fade-in" 
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box',
        color: '#2d3748',
        fontFamily: 'var(--cv-font-family)',
        fontSize: 'var(--cv-font-size)',
        lineHeight: 'var(--cv-line-height)',
        padding: '3cm 2cm'
      }}
    >
      {/* Centered Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <CvPhoto photo={personalInfo.photo} settings={personalInfo.photoSettings} size={104} style={{ margin: '0 auto 1.25rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 300, color: '#1a202c', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {renderFullName()}
        </h1>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#4a5568', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          {personalInfo.jobTitle || 'Titre Professionnel'}
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#718096' }}>
            {personalInfo.email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ color: themeColor }}>@</span> {personalInfo.email}</div>}
            {personalInfo.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ color: themeColor }}>Tél:</span> {personalInfo.phone}</div>}
            {personalInfo.location && <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ color: themeColor }}>Loc:</span> {personalInfo.location}</div>}
            {personalInfo.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ color: themeColor }}>In:</span> {personalInfo.linkedin}</div>}
        </div>
      </div>

      {/* {t('profile')}e Summary */}
      {personalInfo.summary && (
        <div style={{ marginBottom: '3rem', textAlign: 'center', padding: '0 2rem' }}>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568' }}>
                {personalInfo.summary}
            </p>
        </div>
      )}

      {/* Timeline Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {mainSections.map(id => sectionRenderers[id] ? sectionRenderers[id]() : null)}

        {/* Skills & Langs Timeline Format */}
        {(skills.length > 0 || languages.length > 0 || interests.length > 0) && (
          <div style={{ display: 'flex' }}>
            <div style={{ width: '140px', textAlign: 'right', paddingRight: '2rem', flexShrink: 0 }}>
              <h3 style={{ fontSize: '1rem', color: '#a0aec0', textTransform: 'uppercase', fontWeight: 700, margin: '0' }}>Atouts</h3>
            </div>
            <div style={{ width: '2px', backgroundColor: '#e2e8f0', position: 'relative' }}>
               <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', backgroundColor: '#a0aec0', borderRadius: '50%' }}></div>
               {/* End dot */}
               <div style={{ position: 'absolute', bottom: 0, left: '-4px', width: '10px', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '50%' }}></div>
            </div>
            <div style={{ flex: 1, paddingLeft: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {bottomSections.map(id => sectionRenderers[id] ? sectionRenderers[id]() : null)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
