import { getTranslation } from './shared/translations';
import React from 'react';
import FormatDate from './shared/FormatDate';
import SkillBar from './shared/SkillBar';

export default function CVTemplateClassic({ data }) {
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

  const accentColor = '#1e293b'; // Dark slate

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div key="experience">
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: accentColor, borderBottom: '2px solid', borderColor: themeColor, paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          {t('experience')}
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
                  {exp.location && <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>({exp.location})</span>}
                  <span style={{ color: '#6b7280', fontSize: '0.85rem', marginLeft: 'auto' }}>
                    <FormatDate dateString={exp.startDate} /> - {exp.current ? 'Présent' : <FormatDate dateString={exp.endDate} />}
                  </span>
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
          {t('education')}
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
                  {edu.location && <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>({edu.location})</span>}
                  <span style={{ color: '#6b7280', fontSize: '0.85rem', marginLeft: 'auto' }}>
                    <FormatDate dateString={edu.startDate} /> - {edu.current ? 'Présent' : <FormatDate dateString={edu.endDate} />}
                  </span>
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

  const renderProjects = () => {
    if (projects.length === 0) return null;
    return (
      <div key="projects">
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: accentColor, borderBottom: '2px solid', borderColor: themeColor, paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          {t('projects')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {projects.map(proj => (
            <div key={proj.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0 1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: themeColor, flexShrink: 0 }} />
                <div style={{ width: '1px', backgroundColor: '#e2e8f0', flex: 1, marginTop: '4px' }} />
              </div>
              <div>
                <strong style={{ fontSize: '1rem', color: '#111827' }}>{proj.title}</strong>
                {proj.type && <span style={{ color: themeColor, fontSize: '0.85rem', marginLeft: '1rem', fontWeight: 500 }}>{proj.type}</span>}
                <ul style={{ color: '#4b5563', fontSize: '0.875rem', paddingLeft: '1.25rem', lineHeight: '1.5', margin: '0.5rem 0 0 0' }}>
                  {Array.isArray(proj.bullets) ? proj.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  )) : proj.description?.split('\n').filter(line => line.trim()).map((line, i) => (
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

  const renderExtracurricular = () => {
    if (extracurricular.length === 0) return null;
    return (
      <div key="extracurricular">
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: accentColor, borderBottom: '2px solid', borderColor: themeColor, paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          {t('extracurricular')}
        </h3>
        <ul style={{ color: '#4b5563', fontSize: '0.875rem', paddingLeft: '1.25rem', lineHeight: '1.5', margin: 0 }}>
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
      <div key="skills">
        <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#93c5fd', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 600 }}>
          {t('skills')}
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
          {t('languages')}
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

  const renderCertifications = () => {
    if (certifications.length === 0) return null;
    return (
      <div key="certifications">
        <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#93c5fd', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 600 }}>
          {t('certifications')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
          {certifications.map(c => (
            <div key={c.id}>
              <strong style={{ color: 'white' }}>{c.name}</strong>
              {(c.org || c.date) && <p style={{ color: '#93c5fd', fontSize: '0.75rem' }}>{c.org} {c.date && `(${c.date})`}</p>}
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
        <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#93c5fd', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 600 }}>
          {t('interests')}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {interests.map((i, idx) => (
            <span key={idx} style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '0.15rem 0.4rem', fontSize: '0.75rem', borderRadius: '3px' }}>
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
      <div key={cs.id} style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: accentColor, borderBottom: '2px solid', borderColor: themeColor, paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          {cs.name}
        </h3>
        <div style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
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

        {sidebarSections.map(id => sectionRenderers[id] ? sectionRenderers[id]() : null)}
      </div>

      {/* Right Main Content */}
      <div style={{ padding: '2.5cm 1.5cm', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* {t('profile')} Summary */}
        {personalInfo.summary && (
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: accentColor, borderBottom: '2px solid', borderColor: themeColor, paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              {t('profile')}
            </h3>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {mainSections.map(id => sectionRenderers[id] ? sectionRenderers[id]() : null)}
      </div>
    </div>
  );
}
