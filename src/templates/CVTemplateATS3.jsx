import { getTranslation } from './shared/translations';
import React from 'react';

const ACCENT = '#0F4C75'; // Bleu tech sobre

const s = {
  page: {
    fontFamily: '"Arial", "Helvetica Neue", "Liberation Sans", sans-serif',
    fontSize: '10.5pt',
    color: '#1a1a1a',
    background: '#fff',
    width: '210mm',
    minHeight: '297mm',
    padding: '15mm 20mm 14mm',
    lineHeight: 1.45,
    boxSizing: 'border-box',
  },
  // HEADER BANDEAU PLEINE LARGEUR (pas de colonne)
  headerBand: {
    backgroundColor: ACCENT,
    margin: '-15mm -20mm 0',
    padding: '16px 20mm 14px',
    marginBottom: '14px',
  },
  name: {
    fontSize: '22pt',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.5px',
    marginBottom: '2px',
  },
  title: {
    fontSize: '12pt',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '8px',
  },
  contactRow: {
    fontSize: '9pt',
    color: 'rgba(255,255,255,0.9)',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0 16px',
  },
  sectionTitle: {
    fontSize: '9.5pt',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: ACCENT,
    borderLeft: `3px solid ${ACCENT}`,
    paddingLeft: '8px',
    marginBottom: '8px',
    marginTop: 0,
  },
  section: {
    marginBottom: '14px',
  },
  summary: {
    fontSize: '10.5pt',
    color: '#333',
    lineHeight: 1.6,
  },
  // Stack technique sous forme de tags texte (PAS de chips graphiques)
  stackWrap: {
    fontSize: '10.5pt',
    color: '#333',
    lineHeight: 1.8,
  },
  stackGroup: {
    marginBottom: '4px',
    display: 'flex',
    gap: '6px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  stackLabel: {
    fontWeight: 700,
    color: ACCENT,
    minWidth: '100px',
    fontSize: '10pt',
    flexShrink: 0,
  },
  stackItems: {
    fontSize: '10.5pt',
    color: '#333',
  },
  entry: {
    marginBottom: '10px',
  },
  entryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0 8px',
    marginBottom: '1px',
  },
  entryTitle: {
    fontWeight: 700,
    fontSize: '11pt',
    color: '#111',
  },
  entryDate: {
    fontSize: '9.5pt',
    color: '#666',
    whiteSpace: 'nowrap',
  },
  entrySub: {
    fontSize: '10pt',
    color: '#555',
    marginBottom: '2px',
  },
  entryTech: {
    fontSize: '9.5pt',
    color: ACCENT,
    fontWeight: 600,
    marginBottom: '3px',
    fontStyle: 'italic',
  },
  entryDesc: {
    fontSize: '10pt',
    color: '#333',
    lineHeight: 1.5,
  },
  certifItem: {
    fontSize: '10.5pt',
    color: '#333',
    marginBottom: '4px',
  },
  langRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0 20px',
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

// Groupe les skills par catégorie/niveau pour une section "Stack technique"
const StackSection = ({ skills, language = 'FR' }) => {
  if (!skills?.length) return null;
  const t = (key) => getTranslation(key, language);
  const hasLevels = skills.some(sk => typeof sk === 'object' && sk.showLevel && sk.level);

  if (!hasLevels) {
    const names = skills.map(sk => typeof sk === 'string' ? sk : sk.name).filter(Boolean);
    return (
      <Section title={t('skills')}>
        <div style={s.stackWrap}>{names.join(' · ')}</div>
      </Section>
    );
  }

  const groups = {};
  skills.forEach(sk => {
    const name = typeof sk === 'string' ? sk : sk.name;
    const level = (typeof sk === 'object' && sk.showLevel && sk.level) ? sk.level : 'Autres';
    if (!groups[level]) groups[level] = [];
    groups[level].push(name);
  });

  return (
    <Section title={t('skills')}>
      <div style={s.stackWrap}>
        {Object.entries(groups).map(([level, names]) => (
          <div key={level} style={s.stackGroup}>
            <span style={s.stackLabel}>{level} :</span>
            <span style={s.stackItems}>{names.join(', ')}</span>
          </div>
        ))}
      </div>
    </Section>
  );
};

const Entry = ({ title, sub, date, location, desc, tech }) => (
  <div style={s.entry}>
    <div style={s.entryHeader}>
      <span style={s.entryTitle}>{title}</span>
      <span style={s.entryDate}>{date}</span>
    </div>
    {(sub || location) && (
      <div style={s.entrySub}>
        {sub}{location ? ` — ${location}` : ''}
      </div>
    )}
    {tech && <div style={s.entryTech}>Stack : {tech}</div>}
    {desc && (
      <div style={s.entryDesc}>
        {desc.split('\n').map((line, i) => <div key={i}>{line}</div>)}
      </div>
    )}
  </div>
);

export default function CVTemplateATS3({ data }) {
  const language = data?.language || 'FR';
  const t = (key) => getTranslation(key, language);
  const d = data || {};
  const contactParts = [
    d.phone, d.email, d.address,
    d.linkedin && `LinkedIn : ${d.linkedin}`,
    d.github && `GitHub : ${d.github}`,
    d.website,
    d.nationality,
  ].filter(Boolean);

  return (
    <div className="cv-document" style={s.page}>
      {/* HEADER BANDEAU — couleur de fond uniquement, pas d'image */}
      <div style={s.headerBand}>
        <div style={s.name}>{d.name || 'Prénom Nom'}</div>
        {d.title && <div style={s.title}>{d.title}</div>}
        <div style={s.contactRow}>
          {contactParts.map((p, i) => <span key={i}>{p}</span>)}
        </div>
      </div>

      {/* PROFIL */}
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
            // Dedicated "tech stack" section for ATS keyword matching.
            return <StackSection key={sid} skills={d.skills} language={language} />;
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
                <div style={s.langRow}>
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
                <div style={{ fontSize: '10.5pt', color: '#333' }}>
                  {d.interests.map((it, i) => {
                    const label = typeof it === 'string' ? it : (it.name || it);
                    return <span key={i}>{label}{i < d.interests.length - 1 ? ' · ' : ''}</span>;
                  })}
                </div>
              </Section>
            ) : null;
          case 'extracurricular':
            return d.extracurricular?.length > 0 ? (
              <Section key={sid} title={t('extracurricular')}>
                <div style={{ fontSize: '10.5pt', color: '#333' }}>
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
                    <div style={{ fontSize: '10.5pt', color: '#333', lineHeight: 1.5 }}>
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
