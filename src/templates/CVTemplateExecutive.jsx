import { getTranslation } from './shared/translations';
import React from 'react';
import FormatDate from './shared/FormatDate';
import SectionTitle from './shared/SectionTitle';

export default function CVTemplateExecutive({ data }) {
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

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div key="experience" style={{ marginBottom: '2.5rem' }}>
        <SectionTitle title={t('experience')} themeColor={themeColor} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {experience.map(exp => (
            <div key={exp.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: themeColor, fontWeight: 600 }}>
                <FormatDate dateString={exp.startDate} /><br/>
                — {exp.current ? 'Présent' : <FormatDate dateString={exp.endDate} />}
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0', fontWeight: 700 }}>{exp.position}</h4>
                <div style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '0.5rem', fontWeight: 600 }}>{exp.company} {exp.location && `· ${exp.location}`}</div>
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
        <SectionTitle title={t('education')} themeColor={themeColor} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {education.map(edu => (
            <div key={edu.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: themeColor, fontWeight: 600 }}>
                <FormatDate dateString={edu.startDate} />
                {edu.endDate ? <> — {edu.current ? 'Présent' : <FormatDate dateString={edu.endDate} />}</> : (edu.current && ' — Présent')}
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0', fontWeight: 700 }}>{edu.degree} {edu.field ? `- ${edu.field}` : ''}</h4>
                <div style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '0.5rem', fontWeight: 600 }}>{edu.school} {edu.location && `· ${edu.location}`}</div>
                {edu.description && (
                  <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.5', margin: 0 }}>
                    {edu.description}
                  </p>
                )}
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
        <SectionTitle title={t('projects')} themeColor={themeColor} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {projects.map(proj => (
            <div key={proj.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: themeColor, fontWeight: 600 }}>
                Projet Personnel
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0', fontWeight: 700 }}>{proj.title}</h4>
                {proj.type && <div style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '0.5rem', fontWeight: 600 }}>{proj.type}</div>}
                <ul style={{ fontSize: '0.9rem', paddingLeft: '1.25rem', margin: 0, color: '#374151', lineHeight: '1.5' }}>
                  {Array.isArray(proj.bullets) ? proj.bullets.map((b, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{b}</li>
                  )) : proj.description?.split('\n').filter(line => line.trim()).map((line, i) => (
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

  const renderExtracurricular = () => {
    if (extracurricular.length === 0) return null;
    return (
      <div key="extracurricular" style={{ marginBottom: '2.5rem' }}>
        <SectionTitle title={t('extracurricular')} themeColor={themeColor} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {extracurricular.map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: themeColor, fontWeight: 600 }}>
                Engagement
              </div>
              <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.5' }}>
                {typeof item === 'string' ? item : (item.name || item.description)}
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
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: themeColor, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {t('skills')}
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {skills.map(skill => (
            <span key={skill.id} style={{ border: `1px solid ${themeColor}30`, backgroundColor: 'var(--surface-50)', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
              {skill.name} {skill.showLevel && skill.level && `(${skill.level})`}
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
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: themeColor, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {t('languages')}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
          {languages.map(lang => (
            <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{lang.name}</strong>
              <span style={{ color: '#4b5563' }}>{lang.level}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    if (certifications.length === 0) return null;
    return (
      <div key="certifications">
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: themeColor, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {t('certifications')}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
          {certifications.map(c => (
            <div key={c.id}>
              <strong>{c.name}</strong>
              {c.org && <p style={{ color: '#4b5563', fontSize: '0.8rem' }}>{c.org} {c.date && `(${c.date})`}</p>}
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
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: themeColor, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {t('interests')}
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {interests.map((i, idx) => (
            <span key={idx} style={{ backgroundColor: '#f1f5f9', color: '#4b5563', padding: '0.15rem 0.4rem', fontSize: '0.8rem', borderRadius: '3px' }}>
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
        <SectionTitle title={cs.name} themeColor={themeColor} />
        <div style={{ color: '#374151', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
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
  const bottomSections = sectionsOrder.filter(id => ['skills', 'languages', 'certifications', 'interests'].includes(id));

  return (
    <div 
      className="cv-document animate-fade-in" 
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: 'white',
        boxShadow: 'var(--shadow-xl)',
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
        {/* {t('profile')} Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '2.5rem' }}>
            <SectionTitle title={t('profile')} themeColor={themeColor} />
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#374151' }}>
              {personalInfo.summary}
            </p>
          </div>
        )}
        
        {mainSections.map(id => sectionRenderers[id] ? sectionRenderers[id]() : null)}

        {/* Skills & {t('languages')} - Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
          {bottomSections.map(id => sectionRenderers[id] ? sectionRenderers[id]() : null)}
        </div>
      </div>
    </div>
  );
}
