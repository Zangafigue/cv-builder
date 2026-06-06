import { getTranslation } from './shared/translations';
// CVTemplateJobLeads.jsx
// Reproduction fidèle du template JobLeads vu dans les screenshots :
// - Photo ronde à gauche du nom
// - En-tête : nom + infos de contact inline
// - Sections : {t('profile').toUpperCase()}, {t('experience').toUpperCase()}, {t('education').toUpperCase()}, {t('skills').toUpperCase()}, {t('languages').toUpperCase()}
// - Layout 2 colonnes pour date | contenu
// - Séparateurs horizontaux entre sections
// - Typographie sobre, noire sur blanc

import React from 'react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');

  .jl-cv * { box-sizing: border-box; margin: 0; padding: 0; }

  .jl-cv {
    font-family: 'Source Sans 3', 'Arial', sans-serif;
    font-size: 10pt;
    color: #1a1a1a;
    background: #fff;
    width: 210mm;
    min-height: 297mm;
    padding: 14mm 16mm 14mm;
    line-height: 1.45;
  }

  /* ── HEADER ─────────────────────────────────── */
  .jl-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 12px;
    border-bottom: 1.5px solid #1a1a1a;
    margin-bottom: 0;
  }
  .jl-photo {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }
  .jl-photo-placeholder {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #e0e0e0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    color: #bbb;
  }
  .jl-header-info { flex: 1; }
  .jl-name {
    font-size: 18pt;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #111;
    line-height: 1.1;
    margin-bottom: 6px;
  }
  .jl-contact {
    font-size: 9pt;
    color: #444;
    display: flex;
    flex-wrap: wrap;
    gap: 0 4px;
    align-items: center;
  }
  .jl-contact-sep { color: #bbb; margin: 0 2px; }

  /* ── SECTION ────────────────────────────────── */
  .jl-section {
    display: grid;
    grid-template-columns: 90px 1fr;
    border-bottom: 1px solid #d0d0d0;
    padding: 10px 0;
  }
  .jl-section:last-child { border-bottom: none; }

  .jl-section-label {
    font-size: 8.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #111;
    padding-top: 2px;
    padding-right: 10px;
  }
  .jl-section-body { flex: 1; }

  /* ── {t('profile').toUpperCase()} ─────────────────────────────────── */
  .jl-summary {
    font-size: 9.5pt;
    color: #333;
    line-height: 1.55;
  }

  /* ── ENTRY ──────────────────────────────────── */
  .jl-entry { margin-bottom: 10px; }
  .jl-entry:last-child { margin-bottom: 0; }

  .jl-entry-top {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 0 10px;
    align-items: baseline;
    margin-bottom: 1px;
  }
  .jl-entry-date {
    font-size: 8.5pt;
    color: #555;
    line-height: 1.4;
  }
  .jl-entry-right {}
  .jl-entry-title {
    font-weight: 700;
    font-size: 10pt;
    color: #111;
  }
  .jl-entry-company {
    font-size: 9.5pt;
    color: #111;
    font-weight: 400;
  }
  .jl-entry-location {
    font-size: 9pt;
    color: #555;
    float: right;
  }
  .jl-entry-bullets {
    list-style: disc;
    padding-left: 14px;
    margin-top: 3px;
  }
  .jl-entry-bullets li {
    font-size: 9.5pt;
    color: #333;
    line-height: 1.45;
    margin-bottom: 2px;
  }
  .jl-entry-desc {
    font-size: 9.5pt;
    color: #333;
    line-height: 1.5;
    margin-top: 2px;
  }

  /* ── {t('skills').toUpperCase()} (skills grid) ────────────── */
  .jl-skills-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 20px;
  }
  .jl-skill-item {
    font-size: 9.5pt;
    color: #111;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* ── {t('languages').toUpperCase()} ────────────────────────────────── */
  .jl-langs {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .jl-lang-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .jl-lang-name {
    font-size: 9.5pt;
    font-weight: 600;
    color: #111;
    min-width: 60px;
  }
  .jl-lang-level {
    font-size: 8.5pt;
    color: #666;
  }
  .jl-lang-bar {
    flex: 1;
    height: 2px;
    background: #1a1a1a;
    border-radius: 1px;
    max-width: 120px;
  }

  /* ── {t('certifications').toUpperCase()} ─────────────────────────── */
  .jl-certif-item {
    font-size: 9.5pt;
    color: #333;
    margin-bottom: 4px;
    padding-left: 12px;
    position: relative;
  }
  .jl-certif-item::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #555;
  }
  .jl-certif-name { font-weight: 600; color: #111; }
  .jl-certif-meta { color: #666; font-size: 9pt; }

  /* ── {t('interests').toUpperCase()} ───────────────────────────────── */
  .jl-interests {
    font-size: 9.5pt;
    color: #333;
    line-height: 1.6;
  }

  @media print {
    .jl-cv { padding: 10mm 12mm; }
  }
`;

// ── Helpers ────────────────────────────────────────────────────────────────

function Section({ label, children }) {
  return (
    <div className="jl-section">
      <div className="jl-section-label">{label}</div>
      <div className="jl-section-body">{children}</div>
    </div>
  );
}

function Entry({ date, title, company, location, bullets = [], desc }) {
  return (
    <div className="jl-entry">
      <div className="jl-entry-top">
        <div className="jl-entry-date">{date}</div>
        <div className="jl-entry-right">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="jl-entry-title">{title}</span>
            {location && <span className="jl-entry-location">{location}</span>}
          </div>
          {company && <div className="jl-entry-company">{company}</div>}
        </div>
      </div>
      {bullets.length > 0 && (
        <div style={{ paddingLeft: '110px' }}>
          <ul className="jl-entry-bullets">
            {bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      )}
      {desc && !bullets.length && (
        <div style={{ paddingLeft: '110px' }}>
          <div className="jl-entry-desc">{desc}</div>
        </div>
      )}
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────

export default function CVTemplateJobLeads({ data }) {
  const language = data?.language || 'FR';
  const t = (key) => getTranslation(key, language);
  const d = data || defaultData;

  const contactParts = [
    d.address,
    d.phone && { text: d.phone, href: `tel:${d.phone}` },
    d.email && { text: d.email, href: `mailto:${d.email}` },
    d.github && { text: 'GitHub', href: `https://${d.github}` },
  ].filter(Boolean);

  return (
    <>
      <style>{css}</style>
      <div className="jl-cv cv-document">

        {/* ── HEADER ── */}
        <div className="jl-header">
          {d.photo
            ? <img className="jl-photo" src={d.photo} alt="Photo" />
            : d.showPhotoPlaceholder !== false
              ? <div className="jl-photo-placeholder">👤</div>
              : null
          }
          <div className="jl-header-info">
            <div className="jl-name">{d.name || 'Prénom NOM'}</div>
            <div className="jl-contact">
              {contactParts.map((part, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="jl-contact-sep">,</span>}
                  {typeof part === 'string'
                    ? <span>{part}</span>
                    : <a href={part.href} style={{ color: '#1a1a1a', textDecoration: 'none' }}>{part.text}</a>
                  }
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* ── {t('profile').toUpperCase()} ── */}
        {d.summary && (
          <Section label={t('profile').toUpperCase()}>
            <p className="jl-summary">{d.summary}</p>
          </Section>
        )}

        {/* ── {t('experience').toUpperCase()} ── */}
        {d.experience?.length > 0 && (
          <Section label={t('experience').toUpperCase()}>
            {d.experience.map((exp, i) => (
              <Entry
                key={i}
                date={exp.period}
                title={exp.title}
                company={exp.company}
                location={exp.location}
                bullets={exp.bullets || (exp.description ? exp.description.split('\n').filter(Boolean) : [])}
              />
            ))}
          </Section>
        )}

        {/* ── {t('education').toUpperCase()} ── */}
        {d.education?.length > 0 && (
          <Section label={t('education').toUpperCase()}>
            {d.education.map((edu, i) => (
              <Entry
                key={i}
                date={edu.period}
                title={edu.degree}
                company={edu.school}
                location={edu.location}
                bullets={edu.bullets || (edu.description ? edu.description.split('\n').filter(Boolean) : [])}
              />
            ))}
          </Section>
        )}

        {/* ── {t('certifications').toUpperCase()} ── */}
        {d.certifications?.length > 0 && (
          <Section label={t('certifications').toUpperCase()}>
            {d.certifications.map((c, i) => (
              <div key={i} className="jl-certif-item">
                <span className="jl-certif-name">{c.name}</span>
                <span className="jl-certif-meta">
                  {c.date ? ` — ${c.date}` : ''}{c.org ? ` · ${c.org}` : ''}
                </span>
              </div>
            ))}
          </Section>
        )}

        {/* ── {t('skills').toUpperCase()} ── */}
        {d.skills?.length > 0 && (
          <Section label={t('skills').toUpperCase()}>
            <div className="jl-skills-grid">
              {d.skills.map((sk, i) => {
                const name = typeof sk === 'string' ? sk : sk.name;
                const level = typeof sk === 'object' && sk.showLevel && sk.level ? sk.level : null;
                return (
                  <div key={i} className="jl-skill-item">
                    {name}{level ? <span style={{ color: '#777', fontSize: '8.5pt' }}> ({level})</span> : ''}
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* ── {t('languages').toUpperCase()} ── */}
        {d.languages?.length > 0 && (
          <Section label={t('languages').toUpperCase()}>
            <div className="jl-langs">
              {d.languages.map((l, i) => {
                const name = typeof l === 'string' ? l : l.name;
                const level = typeof l === 'object' && l.level ? l.level : '';
                return (
                  <div key={i} className="jl-lang-row">
                    <span className="jl-lang-name">{name}</span>
                    <div className="jl-lang-bar" />
                    {level && <span className="jl-lang-level">({level})</span>}
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* ── CENTRES D'INTÉRÊT ── */}
        {d.interests?.length > 0 && (
          <Section label={t('interests').toUpperCase()}>
            <div className="jl-interests">
              {d.interests.map((t, i) => {
                const label = typeof t === 'string' ? t : (t.name || t);
                return <span key={i}>{label}{i < d.interests.length - 1 ? '  ·  ' : ''}</span>;
              })}
            </div>
          </Section>
        )}

      </div>
    </>
  );
}

// ── Données par défaut — CV Mathias à jour ────────────────────────────────

const defaultData = {
  name: "JEAN DUPONT",
  title: "Développeur FullStack Senior",
  address: "Paris, France",
  phone: "+33 6 12 34 56 78",
  email: "jean.dupont@email.com",
  github: "github.com/jeandupont",
  photo: null,
  showPhotoPlaceholder: true,

  summary:
    "Développeur passionné avec 5 ans d'expérience dans la création d'applications web scalables. " +
    "Expertise forte en React et Node.js. Orienté résultats et toujours en quête de solutions innovantes.",

  experience: [
    {
      period: "01/2020 – Présent",
      title: "Développeur Full Stack Senior",
      company: "TechCorp Industries",
      location: "Paris, France",
      bullets: [
        "Architecture et développement de la nouvelle plateforme SaaS",
        "Réduction du temps de chargement de 40% grâce à une refonte de l'API",
        "Mentorat de 3 développeurs juniors"
      ],
    },
    {
      period: "03/2018 – 12/2019",
      title: "Développeur Frontend",
      company: "WebSolutions Agence",
      location: "Lyon, France",
      bullets: [
        "Création de sites e-commerce sur mesure pour des PME",
        "Intégration de maquettes pixel-perfect avec React et Redux"
      ],
    },
  ],

  education: [
    {
      period: "09/2013 – 07/2018",
      degree: "Diplôme d'Ingénieur en Informatique",
      school: "Université de Technologie de Troyes (UTT)",
      location: "Troyes",
      bullets: ["Spécialisation en génie logiciel et systèmes d'information"],
    }
  ],

  certifications: [
    { name: "AWS Certified Developer", date: "2022", org: "Amazon Web Services" },
    { name: "React Native Specialist", date: "2021", org: "Meta" },
  ],

  skills: [
    { name: "HTML / CSS / JavaScript",   showLevel: true, level: "Expert" },
    { name: "React / Node.js",           showLevel: true, level: "Expert" },
    { name: "TypeScript",                showLevel: true, level: "Expert" },
    { name: "PostgreSQL / MongoDB",      showLevel: true, level: "Avancé" },
    { name: "Docker / CI-CD",            showLevel: true, level: "Avancé" },
    { name: "Git / GitHub",              showLevel: true, level: "Expert" },
  ],

  languages: [
    { name: "Français", level: "Natif / Bilingue" },
    { name: "Anglais",  level: "Courant (C1)" },
  ],

  interests: [
    "Photographie",
    "Randonnée en montagne",
    "Open Source",
  ],
};
