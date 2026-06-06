import { getTranslation } from './shared/translations';
import React from 'react';

const s = {
  page: {
    fontFamily: '"Calibri", "Arial", "Helvetica Neue", sans-serif',
    fontSize: '11.5pt',
    color: '#1a1a1a',
    background: '#fff',
    width: '210mm',
    minHeight: '297mm',
    padding: '18mm 20mm 16mm',
    lineHeight: 1.45,
    boxSizing: 'border-box',
  },
  name: {
    fontSize: '22pt',
    fontWeight: 700,
    letterSpacing: '0.5px',
    marginBottom: '2px',
    color: '#111',
  },
  title: {
    fontSize: '12pt',
    fontWeight: 400,
    color: '#444',
    marginBottom: '8px',
  },
  contactLine: {
    fontSize: '10pt',
    color: '#444',
    marginBottom: '12px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0 16px',
  },
  contactItem: {
    display: 'inline',
  },
  hrTop: {
    border: 'none',
    borderTop: '2px solid #111',
    margin: '0 0 14px',
  },
  hrThin: {
    border: 'none',
    borderTop: '0.5px solid #ccc',
    margin: '10px 0 10px',
  },
  sectionTitle: {
    fontSize: '11pt',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    color: '#111',
    marginBottom: '6px',
    paddingBottom: '3px',
    borderBottom: '1.5px solid #111',
  },
  section: {
    marginBottom: '14px',
  },
  summary: {
    fontSize: '10.5pt',
    color: '#333',
    lineHeight: 1.55,
    marginBottom: 0,
  },
  entryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '1px',
    flexWrap: 'wrap',
    gap: '0 8px',
  },
  entryTitle: {
    fontWeight: 700,
    fontSize: '11pt',
    color: '#111',
  },
  entryDate: {
    fontSize: '10pt',
    color: '#555',
    whiteSpace: 'nowrap',
  },
  entrySub: {
    fontSize: '10.5pt',
    color: '#444',
    marginBottom: '3px',
  },
  entryDesc: {
    fontSize: '10.5pt',
    color: '#333',
    lineHeight: 1.5,
    marginTop: '2px',
  },
  entry: {
    marginBottom: '10px',
  },
  skillsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px 10px',
    fontSize: '10.5pt',
    color: '#333',
  },
  skillItem: {
    display: 'inline',
  },
  langsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px 20px',
    fontSize: '10.5pt',
    color: '#333',
  },
  certifItem: {
    fontSize: '10.5pt',
    color: '#333',
    marginBottom: '4px',
  },
  interestsList: {
    fontSize: '10.5pt',
    color: '#333',
  },
};

const Section = ({ title, children }) => (
  <div style={s.section}>
    <div style={s.sectionTitle}>{title}</div>
    {children}
  </div>
);

const Entry = ({ title, sub, date, location, desc }) => (
  <div style={s.entry}>
    <div style={s.entryRow}>
      <span style={s.entryTitle}>{title}</span>
      <span style={s.entryDate}>{date}</span>
    </div>
    {(sub || location) && (
      <div style={s.entrySub}>
        {sub}{sub && location ? ` — ${location}` : location}
      </div>
    )}
    {desc && (
      <div style={s.entryDesc}>
        {desc.split('\n').map((line, i) => (
          <div key={i}>{line.startsWith('-') ? line : line}</div>
        ))}
      </div>
    )}
  </div>
);

export default function CVTemplateATS1({ data }) {
  const language = data?.language || 'FR';
  const t = (key) => getTranslation(key, language);
  const d = data || {};
  const contactParts = [
    d.phone, d.email, d.address,
    d.github && `GitHub: ${d.github}`,
    d.nationality,
  ].filter(Boolean);

  return (
    <div className="cv-document" style={s.page}>
      {/* HEADER */}
      <div style={s.name}>{d.name || 'Prénom Nom'}</div>
      {d.title && <div style={s.title}>{d.title}</div>}
      <div style={s.contactLine}>
        {contactParts.map((p, i) => (
          <span key={i} style={s.contactItem}>{p}</span>
        ))}
      </div>
      <hr style={s.hrTop} />

      {/* SYNTHÈSE */}
      {d.summary && (
        <Section title={t('profile')}>
          <p style={s.summary}>{d.summary}</p>
        </Section>
      )}

      {/* Sections in the user-defined order (sectionsOrder) */}
      {(d.sectionsOrder || ['experience', 'education', 'skills', 'languages', 'projects', 'extracurricular', 'certifications', 'interests', 'customSections']).map((sid) => {
        switch (sid) {
          case 'experience':
            return d.experience?.length > 0 ? (
              <Section key={sid} title={t('experience')}>
                {d.experience.map((exp, i) => (
                  <Entry key={i} title={exp.title} sub={exp.company} date={exp.period} location={exp.location} desc={exp.description} />
                ))}
              </Section>
            ) : null;
          case 'education':
            return d.education?.length > 0 ? (
              <Section key={sid} title={t('education')}>
                {d.education.map((edu, i) => (
                  <Entry key={i} title={edu.degree} sub={edu.school} date={edu.period} location={edu.location} desc={edu.description} />
                ))}
              </Section>
            ) : null;
          case 'projects':
            return d.projects?.length > 0 ? (
              <Section key={sid} title={t('projects')}>
                {d.projects.map((proj, i) => (
                  <Entry key={i} title={proj.title} sub={proj.type} desc={Array.isArray(proj.bullets) ? proj.bullets.join('\n') : proj.description} />
                ))}
              </Section>
            ) : null;
          case 'skills':
            return d.skills?.length > 0 ? (
              <Section key={sid} title={t('skills')}>
                <div style={s.skillsGrid}>
                  {d.skills.map((sk, i) => {
                    const name = typeof sk === 'string' ? sk : sk.name;
                    const level = typeof sk === 'object' && sk.showLevel && sk.level ? ` (${sk.level})` : '';
                    return (<span key={i} style={s.skillItem}>{name}{level}{i < d.skills.length - 1 ? ' ·' : ''}</span>);
                  })}
                </div>
              </Section>
            ) : null;
          case 'certifications':
            return d.certifications?.length > 0 ? (
              <Section key={sid} title={t('certifications')}>
                {d.certifications.map((c, i) => (
                  <div key={i} style={s.certifItem}>
                    <strong>{c.name}</strong>{c.date ? ` — ${c.date}` : ''}{c.org ? ` · ${c.org}` : ''}
                  </div>
                ))}
              </Section>
            ) : null;
          case 'languages':
            return d.languages?.length > 0 ? (
              <Section key={sid} title={t('languages')}>
                <div style={s.langsRow}>
                  {d.languages.map((l, i) => {
                    const name = typeof l === 'string' ? l : l.name;
                    const level = typeof l === 'object' && l.level ? ` — ${l.level}` : '';
                    return <span key={i}><strong>{name}</strong>{level}</span>;
                  })}
                </div>
              </Section>
            ) : null;
          case 'interests':
            return d.interests?.length > 0 ? (
              <Section key={sid} title={t('interests')}>
                <div style={s.interestsList}>
                  {d.interests.map((it, i) => {
                    const label = typeof it === 'string' ? it : it.name || it;
                    return <span key={i}>{label}{i < d.interests.length - 1 ? ' · ' : ''}</span>;
                  })}
                </div>
              </Section>
            ) : null;
          case 'extracurricular':
            return d.extracurricular?.length > 0 ? (
              <Section key={sid} title={t('extracurricular')}>
                <div style={s.interestsList}>
                  {d.extracurricular.map((item, i) => {
                    const text = typeof item === 'string' ? item : (item.name || item.description || '');
                    return text ? <div key={i} style={{ marginBottom: '3px' }}>{text}</div> : null;
                  })}
                </div>
              </Section>
            ) : null;
          case 'customSections':
            return d.customSections?.length > 0 ? (
              <React.Fragment key={sid}>
                {d.customSections.map((cs, i) => cs.name ? (
                  <Section key={i} title={cs.name}>
                    <div style={s.entryDesc}>
                      {(cs.content || '').split('\n').map((line, j) => (<div key={j}>{line}</div>))}
                    </div>
                  </Section>
                ) : null)}
              </React.Fragment>
            ) : null;
          default:
            return null;
        }
      })}
    </div>
  );
}
