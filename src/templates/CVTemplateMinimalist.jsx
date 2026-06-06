import { getTranslation } from './shared/translations';
import CvPhoto from './shared/CvPhoto';
import React from 'react';
import FormatDate from './shared/FormatDate';
import SkillBar from './shared/SkillBar';

export default function CVTemplateMinimalist({ data }) {
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
    sectionsOrder = ['experience', 'education', 'skills', 'languages']
  } = data || {};

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div key="experience" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '1rem', fontWeight: 600 }}>
          {t('experience')}
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
              <div style={{ fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{exp.company} {exp.location && `· ${exp.location}`}</div>
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
          {t('education')} & Diplômes
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
              <div style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>{edu.school} {edu.location && `· ${edu.location}`}</div>
              {edu.description && (
                <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>{edu.description}</p>
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
      <div key="projects" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '1rem', fontWeight: 600 }}>
          {t('projects')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {projects.map(proj => (
            <div key={proj.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '1rem' }}>{proj.title}</strong>
                {proj.type && <span style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>{proj.type}</span>}
              </div>
              <ul style={{ fontSize: '0.85rem', paddingLeft: '1.5rem', margin: '0.25rem 0 0 0' }}>
                {Array.isArray(proj.bullets) ? proj.bullets.map((b, i) => (
                  <li key={i} style={{ marginBottom: '0.2rem' }}>{b}</li>
                )) : proj.description?.split('\n').filter(line => line.trim()).map((line, i) => (
                  <li key={i} style={{ marginBottom: '0.2rem' }}>{line.replace(/^- /, '')}</li>
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
      <div key="extracurricular" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '1rem', fontWeight: 600 }}>
          {t('extracurricular')}
        </h3>
        <ul style={{ fontSize: '0.85rem', paddingLeft: '1.5rem', margin: 0 }}>
          {extracurricular.map((item, i) => (
            <li key={i} style={{ marginBottom: '0.25rem' }}>
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
      <div key="skills" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '1rem', fontWeight: 600 }}>
          {t('skills')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {skills.map(skill => (
            <div key={skill.id}>
              <SkillBar 
                name={skill.name} 
                level={skill.level} 
                color="#475569" 
                bgColor="#f1f5f9"
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
      <div key="languages" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '1rem', fontWeight: 600 }}>
          {t('languages')}
        </h3>
        <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
          {languages.map(lang => (
            <li key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>{lang.name}</span>
              <span style={{ color: '#6b7280' }}>{lang.level}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderCertifications = () => {
    if (certifications.length === 0) return null;
    return (
      <div key="certifications" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '1rem', fontWeight: 600 }}>
          {t('certifications')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
          {certifications.map(c => (
            <div key={c.id}>
              <strong>{c.name}</strong>
              {c.org && <span style={{ color: '#6b7280' }}> ({c.org})</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInterests = () => {
    if (interests.length === 0) return null;
    return (
      <div key="interests" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '1rem', fontWeight: 600 }}>
          {t('interests')}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {interests.map((i, idx) => (
            <span key={idx} style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', padding: '0.15rem 0.4rem', fontSize: '0.75rem', borderRadius: '3px' }}>
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
      <div key={cs.id} style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', marginBottom: '1rem', fontWeight: 600 }}>
          {cs.name}
        </h3>
        <div style={{ color: '#111827', fontSize: '0.85rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
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
        <CvPhoto photo={personalInfo.photo} settings={personalInfo.photoSettings} size={100} style={{ margin: '0 auto 1rem' }} />
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
      
      {/* {t('profile')} Summary */}
      {personalInfo.summary && (
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.95rem', fontStyle: 'italic', textAlign: 'center', maxWidth: '80%', margin: '0 auto' }}>
            {personalInfo.summary}
          </p>
        </div>
      )}
      
      {mainSections.map(id => sectionRenderers[id] ? sectionRenderers[id]() : null)}

      {/* Skills & {t('languages')} - Flex layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {bottomSections.map(id => sectionRenderers[id] ? sectionRenderers[id]() : null)}
      </div>
    </div>
  );
}
