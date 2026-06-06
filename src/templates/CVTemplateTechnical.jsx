import React from 'react';

export default function CVTemplateTechnical({ data }) {
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
    themeColor = '#10b981'
  } = data || {};

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('fr-FR', { month: '2-digit', year: 'numeric' }).format(date);
  };

  return (
    <div 
      className="cv-document animate-fade-in" 
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box',
        color: '#111827',
        fontFamily: 'var(--cv-font-family)',
        padding: '2cm',
        fontSize: 'calc(var(--cv-font-size) * 0.95)',
        lineHeight: 'var(--cv-line-height)'
      }}
    >
      {/* Code-like Header */}
      <div style={{ marginBottom: '2rem', borderBottom: `2px dashed ${themeColor}60`, paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 700, color: themeColor }}>
          <span style={{ color: '#9ca3af' }}>const</span> developer <span style={{ color: '#9ca3af' }}>=</span> '{personalInfo.fullName}';
        </h1>
        <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          // {personalInfo.jobTitle}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
          {personalInfo.email && <div><span style={{ color: themeColor }}>email:</span> '{personalInfo.email}'</div>}
          {personalInfo.phone && <div><span style={{ color: themeColor }}>phone:</span> '{personalInfo.phone}'</div>}
          {personalInfo.location && <div><span style={{ color: themeColor }}>location:</span> '{personalInfo.location}'</div>}
          {personalInfo.linkedin && <div><span style={{ color: themeColor }}>linkedin:</span> '{personalInfo.linkedin}'</div>}
          {personalInfo.website && <div><span style={{ color: themeColor }}>github:</span> '{personalInfo.website}'</div>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem' }}>
        
        {/* Main Content */}
        <div>
          {/* Summary */}
          {personalInfo.summary && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: themeColor, borderBottom: `1px solid ${themeColor}40`, paddingBottom: '0.2rem', marginBottom: '0.8rem', fontWeight: 700, display: 'inline-block' }}>
                &gt; _about
              </h2>
              <p style={{ margin: 0, textAlign: 'justify', fontSize: '0.95rem' }}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: themeColor, borderBottom: `1px solid ${themeColor}40`, paddingBottom: '0.2rem', marginBottom: '1rem', fontWeight: 700, display: 'inline-block' }}>
                &gt; _experience
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>{exp.position}</h3>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#6b7280' }}>
                        [{formatDate(exp.startDate)} - {exp.current ? 'now' : formatDate(exp.endDate)}]
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, color: themeColor, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                      @ {exp.company} {exp.location && `· ${exp.location}`}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.95rem' }}>
                      {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                        <li key={i} style={{ marginBottom: '0.3rem' }}>{line.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: themeColor, borderBottom: `1px solid ${themeColor}40`, paddingBottom: '0.2rem', marginBottom: '1rem', fontWeight: 700, display: 'inline-block' }}>
                &gt; _projects
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {projects.map(proj => (
                  <div key={proj.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>{proj.title}</h3>
                      {proj.type && <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#6b7280' }}>[{proj.type}]</span>}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.95rem' }}>
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
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: themeColor, borderBottom: `1px solid ${themeColor}40`, paddingBottom: '0.2rem', marginBottom: '1rem', fontWeight: 700, display: 'inline-block' }}>
                &gt; _education
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {education.map(edu => (
                  <div key={edu.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>{edu.degree} {edu.field ? `- ${edu.field}` : ''}</h3>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#6b7280' }}>
                        [{formatDate(edu.startDate)} - {edu.current ? 'now' : formatDate(edu.endDate)}]
                      </span>
                    </div>
                    <div style={{ color: themeColor, fontSize: '0.95rem' }}>{edu.school} {edu.location && `· ${edu.location}`}</div>
                    {edu.description && (
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#4b5563' }}>{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Sections */}
          {customSections.length > 0 && customSections.map(cs => (
            <div key={cs.id} style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: themeColor, borderBottom: `1px solid ${themeColor}40`, paddingBottom: '0.2rem', marginBottom: '1rem', fontWeight: 700, display: 'inline-block' }}>
                &gt; _{cs.name.toLowerCase().replace(/\s+/g, '_')}
              </h2>
              <div style={{ color: '#111827', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {cs.content}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div>
          {/* Skills (Tech Stack) */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8fafc', border: `1px solid ${themeColor}30`, borderRadius: '4px' }}>
              <h2 style={{ fontSize: '1.2rem', color: themeColor, marginBottom: '1rem', marginTop: 0, fontWeight: 700 }}>
                &gt; _stack
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {skills.map(skill => (
                  <span key={skill.id} style={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    color: '#6ee7b7', 
                    padding: '0.2rem 0.5rem', 
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    borderRadius: '2px' 
                  }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8fafc', border: `1px solid ${themeColor}30`, borderRadius: '4px' }}>
              <h2 style={{ fontSize: '1.2rem', color: themeColor, marginBottom: '1rem', marginTop: 0, fontWeight: 700 }}>
                &gt; _langs
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'monospace' }}>
                {languages.map(lang => (
                  <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <strong>{lang.name}</strong>
                    <span style={{ color: '#6b7280' }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8fafc', border: `1px solid ${themeColor}30`, borderRadius: '4px' }}>
              <h2 style={{ fontSize: '1.2rem', color: themeColor, marginBottom: '1rem', marginTop: 0, fontWeight: 700 }}>
                &gt; _certs
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {certifications.map(c => (
                  <div key={c.id}>
                    <strong>{c.name}</strong>
                    {c.org && <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: 0 }}>@ {c.org} {c.date && `(${c.date})`}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracurricular */}
          {extracurricular.length > 0 && (
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8fafc', border: `1px solid ${themeColor}30`, borderRadius: '4px' }}>
              <h2 style={{ fontSize: '1.2rem', color: themeColor, marginBottom: '1rem', marginTop: 0, fontWeight: 700 }}>
                &gt; _extra
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {extracurricular.map((item, i) => (
                  <div key={i}>
                    - {typeof item === 'string' ? item : (item.name || item.description)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', border: `1px solid ${themeColor}30`, borderRadius: '4px' }}>
              <h2 style={{ fontSize: '1.2rem', color: themeColor, marginBottom: '1rem', marginTop: 0, fontWeight: 700 }}>
                &gt; _hobby
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {interests.map((i, idx) => (
                  <span key={idx} style={{ border: '1px solid #cbd5e1', padding: '0.15rem 0.35rem', borderRadius: '2px' }}>
                    {i.name || i}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
