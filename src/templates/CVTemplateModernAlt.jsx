import { getTranslation } from './shared/translations';
import CvPhoto from './shared/CvPhoto';
import React from 'react';
import FormatDate from './shared/FormatDate';
import SkillBar from './shared/SkillBar';

export default function CVTemplateModernAlt({ data }) {
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
              <div style={{ fontSize: '0.95rem', color: themeColor, fontWeight: 600, marginBottom: '0.5rem' }}>{exp.company} {exp.location && `· ${exp.location}`}</div>
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
          <h3 style={{ fontSize: '1.25rem', color: themeColor, margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>{t('education')}</h3>
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
              <div style={{ fontSize: '0.95rem', color: themeColor, fontWeight: 600, marginBottom: '0.5rem' }}>{edu.school} {edu.location && `· ${edu.location}`}</div>
              {edu.description && (
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#4b5563' }}>{edu.description}</p>
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
      <div key="projects" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: themeColor, margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>{t('projects')}</h3>
          <div style={{ height: '2px', backgroundColor: '#e5e7eb', flex: 1 }}></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '0', top: '10px', bottom: '10px', width: '2px', backgroundColor: `${themeColor}40` }} />
          {projects.map(proj => (
            <div key={proj.id} style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              <div style={{ position: 'absolute', left: '-4px', top: '6px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: themeColor }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#111827' }}>{proj.title}</h4>
                {proj.type && <span style={{ fontSize: '0.85rem', color: themeColor, fontWeight: 500 }}>{proj.type}</span>}
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.5' }}>
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
      <div key="extracurricular" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: themeColor, margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>Activités</h3>
          <div style={{ height: '2px', backgroundColor: '#e5e7eb', flex: 1 }}></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '0', top: '10px', bottom: '10px', width: '2px', backgroundColor: `${themeColor}40` }} />
          {extracurricular.map((item, i) => (
            <div key={i} style={{ position: 'relative', paddingLeft: '1.5rem', fontSize: '0.9rem', color: '#4b5563' }}>
              <div style={{ position: 'absolute', left: '-4px', top: '6px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: themeColor }} />
              {typeof item === 'string' ? item : (item.name || item.description)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    if (skills.length === 0) return null;
    return (
      <div key="skills" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#1f2937', borderBottom: `2px solid ${themeColor}`, paddingBottom: '0.5rem', marginBottom: '1.25rem', fontWeight: 700 }}>
          {t('skills')}
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
      <div key="languages" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#1f2937', borderBottom: `2px solid ${themeColor}`, paddingBottom: '0.5rem', marginBottom: '1.25rem', fontWeight: 700 }}>
          {t('languages')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.9rem' }}>
          {languages.map(lang => (
            <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>{lang.name}</span>
              <span style={{ color: '#6b7280' }}>{lang.level}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    if (certifications.length === 0) return null;
    return (
      <div key="certifications" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#1f2937', borderBottom: `2px solid ${themeColor}`, paddingBottom: '0.5rem', marginBottom: '1.25rem', fontWeight: 700 }}>
          {t('certifications')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.85rem' }}>
          {certifications.map(c => (
            <div key={c.id}>
              <strong style={{ color: '#1f2937', display: 'block' }}>{c.name}</strong>
              {c.org && <span style={{ color: '#6b7280' }}>{c.org} {c.date && `(${c.date})`}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInterests = () => {
    if (interests.length === 0) return null;
    return (
      <div key="interests" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#1f2937', borderBottom: `2px solid ${themeColor}`, paddingBottom: '0.5rem', marginBottom: '1.25rem', fontWeight: 700 }}>
          {t('interests')}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {interests.map((i, idx) => (
            <span key={idx} style={{ backgroundColor: '#e5e7eb', color: '#4b5563', padding: '0.15rem 0.4rem', fontSize: '0.75rem', borderRadius: '3px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: themeColor, margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>{cs.name}</h3>
          <div style={{ height: '2px', backgroundColor: '#e5e7eb', flex: 1 }}></div>
        </div>
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
            <CvPhoto photo={personalInfo.photo} settings={personalInfo.photoSettings} size={90} style={{ marginBottom: '1rem', border: '3px solid rgba(255,255,255,0.5)' }} />
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
        
        {/* {t('profile')} Summary within Header */}
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
          {mainSections.map(id => sectionRenderers[id] ? sectionRenderers[id]() : null)}
        </div>

        {/* Sidebar (Right) */}
        <div style={{ backgroundColor: '#f9fafb', padding: '2.5rem 2rem 2.5rem 1.5rem', borderLeft: '1px solid #e5e7eb' }}>
          {sidebarSections.map(id => sectionRenderers[id] ? sectionRenderers[id]() : null)}
        </div>
      </div>
    </div>
  );
}
