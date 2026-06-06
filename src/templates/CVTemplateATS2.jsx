import { getTranslation } from './shared/translations';
import React from 'react';

const ACCENT = '#1B3A6B'; // Bleu marine sobre, pro

const s = {
  page: {
    fontFamily: '"Georgia", "Times New Roman", "Garamond", serif',
    fontSize: '11pt',
    color: '#1a1a1a',
    background: '#fff',
    width: '210mm',
    minHeight: '297mm',
    padding: '16mm 22mm 14mm',
    lineHeight: 1.5,
    boxSizing: 'border-box',
  },
  header: {
    borderBottom: `3px solid ${ACCENT}`,
    paddingBottom: '12px',
    marginBottom: '14px',
  },
  name: {
    fontSize: '24pt',
    fontWeight: 700,
    fontFamily: '"Georgia", serif',
    color: ACCENT,
    letterSpacing: '0.5px',
    marginBottom: '3px',
  },
  title: {
    fontSize: '12pt',
    fontWeight: 400,
    fontStyle: 'italic',
    color: '#444',
    marginBottom: '8px',
  },
  contactRow: {
    fontSize: '9.5pt',
    color: '#444',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0 14px',
    lineHeight: 1.6,
  },
  sectionTitle: {
    fontSize: '10.5pt',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: ACCENT,
    borderBottom: `1px solid ${ACCENT}`,
    paddingBottom: '3px',
    marginBottom: '8px',
    fontFamily: '"Arial", sans-serif',
  },
  section: {
    marginBottom: '14px',
  },
  summary: {
    fontSize: '10.5pt',
    color: '#333',
    lineHeight: 1.6,
    fontStyle: 'italic',
  },
  entry: {
    marginBottom: '10px',
  },
  entryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: '0 8px',
    marginBottom: '1px',
  },
  entryTitle: {
    fontWeight: 700,
    fontSize: '11pt',
    color: '#111',
    fontFamily: '"Arial", sans-serif',
  },
  entryDate: {
    fontSize: '9.5pt',
    color: '#666',
    fontFamily: '"Arial", sans-serif',
    whiteSpace: 'nowrap',
  },
  entrySub: {
    fontSize: '10.5pt',
    color: '#555',
    marginBottom: '3px',
  },
  entryDesc: {
    fontSize: '10pt',
    color: '#333',
    lineHeight: 1.5,
    marginTop: '2px',
  },
  skillsList: {
    fontSize: '10.5pt',
    color: '#333',
    lineHeight: 1.7,
  },
  skillGroup: {
    marginBottom: '3px',
    display: 'flex',
    gap: '6px',
    alignItems: 'flex-start',
  },
  skillGroupLabel: {
    fontWeight: 700,
    minWidth: '90px',
    color: '#111',
    fontFamily: '"Arial", sans-serif',
    fontSize: '10pt',
    flexShrink: 0,
  },
  langRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0 20px',
    fontSize: '10.5pt',
  },
  certifItem: {
    fontSize: '10.5pt',
    marginBottom: '4px',
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
    <div style={s.entryHeader}>
      <span style={s.entryTitle}>{title}</span>
      <span style={s.entryDate}>{date}</span>
    </div>
    {(sub || location) && (
      <div style={s.entrySub}>
        {sub}{sub && location ? `, ${location}` : location}
      </div>
    )}
    {desc && (
      <div style={s.entryDesc}>
        {desc.split('\n').map((line, i) => <div key={i}>{line}</div>)}
      </div>
    )}
  </div>
);

// Regroupe les skills par niveau si disponible
const groupSkills = (skills) => {
  if (!skills?.length) return null;
  const hasLevels = skills.some(s => typeof s === 'object' && s.showLevel && s.level);
  if (!hasLevels) {
    const names = skills.map(s => typeof s === 'string' ? s : s.name).filter(Boolean);
    return <div style={s.skillsList}>{names.join(' · ')}</div>;
  }
  const groups = {};
  skills.forEach(sk => {
    const name = typeof sk === 'string' ? sk : sk.name;
    const level = typeof sk === 'object' && sk.showLevel && sk.level ? sk.level : 'Autre';
    if (!groups[level]) groups[level] = [];
    groups[level].push(name);
  });
  return (
    <div>
      {Object.entries(groups).map(([level, names]) => (
        <div key={level} style={s.skillGroup}>
          <span style={s.skillGroupLabel}>{level} :</span>
          <span style={{ fontSize: '10pt', color: '#333' }}>{names.join(', ')}</span>
        </div>
      ))}
    </div>
  );
};

export default function CVTemplateATS2({ data }) {
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
      <div style={s.header}>
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

      {/* EXPÉRIENCE */}
      {d.experience?.length > 0 && (
        <Section title={t('experience')}>
          {d.experience.map((exp, i) => (
            <Entry
              key={i}
              title={exp.title}
              sub={exp.company}
              date={exp.period}
              location={exp.location}
              desc={exp.description}
            />
          ))}
        </Section>
      )}

      {/* {t('education').toUpperCase()} */}
      {d.education?.length > 0 && (
        <Section title={t('education')}>
          {d.education.map((edu, i) => (
            <Entry
              key={i}
              title={edu.degree}
              sub={edu.school}
              date={edu.period}
              location={edu.location}
              desc={edu.description}
            />
          ))}
        </Section>
      )}

      {/* {t('skills').toUpperCase()} */}
      {d.skills?.length > 0 && (
        <Section title={t('skills')}>
          {groupSkills(d.skills)}
        </Section>
      )}

      {/* {t('certifications').toUpperCase()} */}
      {d.certifications?.length > 0 && (
        <Section title={t('certifications')}>
          {d.certifications.map((c, i) => (
            <div key={i} style={s.certifItem}>
              <strong>{c.name}</strong>{c.date ? ` — ${c.date}` : ''}{c.org ? ` · ${c.org}` : ''}
            </div>
          ))}
        </Section>
      )}

      {/* {t('languages').toUpperCase()} */}
      {d.languages?.length > 0 && (
        <Section title={t('languages')}>
          <div style={s.langRow}>
            {d.languages.map((l, i) => {
              const name = typeof l === 'string' ? l : l.name;
              const level = typeof l === 'object' && l.level ? ` — ${l.level}` : '';
              return <span key={i} style={{ fontSize: '10.5pt' }}><strong>{name}</strong>{level}</span>;
            })}
          </div>
        </Section>
      )}

      {/* {t('interests').toUpperCase()} */}
      {d.interests?.length > 0 && (
        <Section title={t('interests')}>
          <div style={{ fontSize: '10.5pt', color: '#333' }}>
            {d.interests.map((t, i) => {
              const label = typeof t === 'string' ? t : (t.name || t);
              return <span key={i}>{label}{i < d.interests.length - 1 ? ' · ' : ''}</span>;
            })}
          </div>
        </Section>
      )}
    </div>
  );
}
