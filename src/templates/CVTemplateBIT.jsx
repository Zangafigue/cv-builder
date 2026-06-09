import { getTranslation } from './shared/translations';
// CVTemplateBIT.jsx — Template officiel BIT Student CV
// Structure exacte recommandée par le Burkina Institute of Technology :
// PERSONAL INFO → PROFILE SUMMARY → EDUCATION → PROJECTS → SKILLS
// → EXPERIENCE → EXTRACURRICULAR → {t('certifications').toUpperCase()}
// Design : sobre, académique, 1 page, ATS-friendly

import React from 'react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&family=Merriweather:wght@700&display=swap');

  .bit-cv * { box-sizing: border-box; margin: 0; padding: 0; }

  .bit-cv {
    font-family: 'Lato', 'Arial', sans-serif;
    font-size: 10pt;
    color: #1c1c1c;
    background: #fff;
    width: 210mm;
    min-height: 297mm;
    padding: 13mm 16mm 12mm;
    line-height: 1.45;
  }

  /* ── HEADER ─────────────────────────────────────────── */
  .bit-header {
    text-align: center;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 2px solid #1c1c1c;
  }

  .bit-name {
    font-family: 'Merriweather', Georgia, serif;
    font-size: 20pt;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #1c1c1c;
    text-transform: uppercase;
    margin-bottom: 5px;
    line-height: 1.1;
  }

  .bit-contact {
    font-size: 9pt;
    color: #444;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0 6px;
  }

  .bit-contact-sep {
    color: #999;
  }

  .bit-location {
    font-size: 9pt;
    color: #555;
    margin-top: 2px;
    font-style: italic;
  }

  /* ── SECTION ─────────────────────────────────────────── */
  .bit-section {
    margin-bottom: 9px;
  }

  .bit-section-title {
    font-size: 8.5pt;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #1c1c1c;
    border-bottom: 1.5px solid #1c1c1c;
    padding-bottom: 2px;
    margin-bottom: 6px;
  }

  /* ── PROFILE SUMMARY ─────────────────────────────────── */
  .bit-summary {
    font-size: 10pt;
    color: #333;
    line-height: 1.55;
    text-align: justify;
  }

  /* ── EDUCATION ───────────────────────────────────────── */
  .bit-edu-entry {
    margin-bottom: 6px;
  }

  .bit-edu-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .bit-edu-degree {
    font-weight: 700;
    font-size: 10pt;
    color: #1c1c1c;
  }

  .bit-edu-period {
    font-size: 9pt;
    color: #555;
    font-style: italic;
    white-space: nowrap;
    margin-left: 8px;
    flex-shrink: 0;
  }

  .bit-edu-school {
    font-size: 9.5pt;
    color: #444;
    margin-bottom: 2px;
  }

  .bit-edu-note {
    font-size: 9pt;
    color: #666;
    font-style: italic;
  }

  /* ── PROJECTS ────────────────────────────────────────── */
  .bit-project-entry {
    margin-bottom: 7px;
  }

  .bit-project-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2px;
  }

  .bit-project-title {
    font-weight: 700;
    font-size: 10pt;
    color: #1c1c1c;
  }

  .bit-project-type {
    font-size: 9pt;
    color: #666;
    font-style: italic;
    white-space: nowrap;
    margin-left: 8px;
    flex-shrink: 0;
  }

  .bit-project-bullets {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .bit-project-bullets li {
    font-size: 9.5pt;
    color: #333;
    padding-left: 12px;
    position: relative;
    line-height: 1.45;
    margin-bottom: 1px;
  }

  .bit-project-bullets li::before {
    content: "–";
    position: absolute;
    left: 0;
    color: #888;
  }

  /* ── SKILLS ──────────────────────────────────────────── */
  .bit-skills-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3px 20px;
  }

  .bit-skill-row {
    display: flex;
    gap: 5px;
    align-items: flex-start;
    font-size: 9.5pt;
  }

  .bit-skill-label {
    font-weight: 700;
    color: #1c1c1c;
    white-space: nowrap;
    flex-shrink: 0;
    font-size: 9pt;
  }

  .bit-skill-value {
    color: #333;
    line-height: 1.45;
  }

  /* ── EXPERIENCE ──────────────────────────────────────── */
  .bit-exp-entry {
    margin-bottom: 7px;
  }

  .bit-exp-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1px;
  }

  .bit-exp-title {
    font-weight: 700;
    font-size: 10pt;
    color: #1c1c1c;
  }

  .bit-exp-period {
    font-size: 9pt;
    color: #555;
    font-style: italic;
    white-space: nowrap;
    margin-left: 8px;
    flex-shrink: 0;
  }

  .bit-exp-org {
    font-size: 9.5pt;
    color: #444;
    margin-bottom: 2px;
  }

  .bit-exp-bullets {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .bit-exp-bullets li {
    font-size: 9.5pt;
    color: #333;
    padding-left: 12px;
    position: relative;
    line-height: 1.45;
    margin-bottom: 1px;
  }

  .bit-exp-bullets li::before {
    content: "–";
    position: absolute;
    left: 0;
    color: #888;
  }

  /* ── EXTRACURRICULAR ─────────────────────────────────── */
  .bit-extra-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 2px 0;
  }

  .bit-extra-list li {
    font-size: 9.5pt;
    color: #333;
    padding-left: 12px;
    position: relative;
    width: 100%;
    line-height: 1.45;
  }

  .bit-extra-list li::before {
    content: "–";
    position: absolute;
    left: 0;
    color: #888;
  }

  /* ── {t('certifications').toUpperCase()} ──────────────────────────────────── */
  .bit-certif-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .bit-certif-list li {
    font-size: 9.5pt;
    color: #333;
    padding-left: 12px;
    position: relative;
    line-height: 1.45;
    margin-bottom: 1px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .bit-certif-list li::before {
    content: "–";
    position: absolute;
    left: 0;
    color: #888;
  }

  .bit-certif-name {
    font-weight: 600;
    color: #1c1c1c;
  }

  .bit-certif-meta {
    color: #666;
    font-size: 9pt;
    font-style: italic;
    margin-left: 8px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  @media print {
    .bit-cv { padding: 10mm 12mm; }
  }
`;

// ── Helpers ────────────────────────────────────────────────────────────────

const Section = ({ title, children }) => (
  <div className="bit-section">
    <div className="bit-section-title">{title}</div>
    {children}
  </div>
);

// ── Composant principal ────────────────────────────────────────────────────

export default function CVTemplateBIT({ data }) {
  const language = data?.language || 'FR';
  const t = (key) => getTranslation(key, language);
  const d = data || defaultData;

  const contactParts = [
    d.phone,
    d.email,
    d.linkedin && (d.linkedin.startsWith('http') ? d.linkedin : `linkedin.com/in/${d.linkedin}`),
    d.github && `github.com/${d.github.replace('github.com/', '')}`,
    d.website,
  ].filter(Boolean);

  return (
    <>
      <style>{css}</style>
      <div className="bit-cv cv-document">

        {/* ── PERSONAL INFORMATION ── */}
        <div className="bit-header">
          <div className="bit-name">{d.name || 'Full Name'}</div>
          <div className="bit-contact">
            {contactParts.map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="bit-contact-sep">|</span>}
                <span>{part}</span>
              </React.Fragment>
            ))}
          </div>
          {d.address && <div className="bit-location">{d.address}</div>}
        </div>

        {/* ── PROFILE SUMMARY ── */}
        {d.summary && (
          <Section title={t('profile')}>
            <p className="bit-summary">{d.summary}</p>
          </Section>
        )}

        {/* ── EDUCATION ── */}
        {d.education?.length > 0 && (
          <Section title={t('education')}>
            {d.education.map((edu, i) => (
              <div key={i} className="bit-edu-entry">
                <div className="bit-edu-row">
                  <span className="bit-edu-degree">{edu.degree}</span>
                  <span className="bit-edu-period">{edu.period}</span>
                </div>
                <div className="bit-edu-school">{edu.school}</div>
                {edu.note && <div className="bit-edu-note">{edu.note}</div>}
              </div>
            ))}
          </Section>
        )}

        {/* ── PROJECTS ── */}
        {d.projects?.length > 0 && (
          <Section title={t('projects')}>
            {d.projects.map((proj, i) => (
              <div key={i} className="bit-project-entry">
                <div className="bit-project-header">
                  <span className="bit-project-title">{proj.title}</span>
                  {proj.type && <span className="bit-project-type">{proj.type}</span>}
                </div>
                {proj.bullets?.length > 0 && (
                  <ul className="bit-project-bullets">
                    {proj.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* ── SKILLS ── */}
        {d.skills?.length > 0 && (
          <Section title={t('skills')}>
            <div className="bit-skills-grid">
              {d.skills.map((sk, i) => {
                const label = typeof sk === 'string' ? null : sk.label;
                const value = typeof sk === 'string' ? sk : sk.value;
                return (
                  <div key={i} className="bit-skill-row">
                    {label && <span className="bit-skill-label">{label}:</span>}
                    <span className="bit-skill-value">{value}</span>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* ── EXPERIENCE ── */}
        {d.experience?.length > 0 && (
          <Section title={t('experience')}>
            {d.experience.map((exp, i) => (
              <div key={i} className="bit-exp-entry">
                <div className="bit-exp-header">
                  <span className="bit-exp-title">{exp.title}</span>
                  <span className="bit-exp-period">{exp.period}</span>
                </div>
                {exp.org && <div className="bit-exp-org">{exp.org}</div>}
                {exp.bullets?.length > 0 && (
                  <ul className="bit-exp-bullets">
                    {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* ── EXTRACURRICULAR ACTIVITIES / VOLUNTEERING ── */}
        {d.extracurricular?.length > 0 && (
          <Section title={t('extracurricular')}>
            <ul className="bit-extra-list">
              {d.extracurricular.map((item, i) => {
                const text = typeof item === 'string' ? item : item.name;
                return <li key={i}>{text}</li>;
              })}
            </ul>
          </Section>
        )}

        {/* ── {t('certifications').toUpperCase()} & TRAINING ── */}
        {d.certifications?.length > 0 && (
          <Section title={t('certifications')}>
            <ul className="bit-certif-list">
              {d.certifications.map((c, i) => (
                <li key={i}>
                  <span className="bit-certif-name">{c.name}</span>
                  {(c.date || c.org) && (
                    <span className="bit-certif-meta">
                      {[c.org, c.date].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

      </div>
    </>
  );
}

import { defaultData } from './CVTemplateBIT.data';
