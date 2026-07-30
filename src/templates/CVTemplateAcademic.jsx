import React from 'react';
import { getTranslation } from './shared/translations';

// Academic / classic ATS résumé — single column, centered header, serif body,
// theme-colored ruled section titles. Modeled on the BIT-recommended format:
// no photo or birth info required (both optional), fully driven by cvData.
const css = `
  .ac-cv * { box-sizing: border-box; margin: 0; padding: 0; }

  .ac-cv {
    font-family: Georgia, Cambria, "Times New Roman", "Noto Serif", serif;
    font-size: calc(10pt * var(--cv-size-scale, 1));
    line-height: var(--cv-line-height, 1.35);
    color: #222;
    background: #fff;
    width: 210mm;
    min-height: 297mm;
    padding: 14mm 16mm;
  }

  /* ── HEADER (centered) ── */
  .ac-header { text-align: center; margin-bottom: 8px; }
  .ac-photo {
    width: 88px; height: 88px; object-fit: cover;
    display: block; margin: 0 auto 8px;
  }
  .ac-name {
    font-size: 1.85em; font-weight: 700; letter-spacing: 0.5px;
    color: #111; line-height: 1.1;
  }
  .ac-title { font-size: 1.05em; color: #555; margin-top: 3px; }
  .ac-contact {
    font-size: 0.86em; color: #444; margin-top: 7px;
    display: flex; flex-wrap: wrap; justify-content: center; align-items: center;
  }
  .ac-contact a { color: inherit; text-decoration: none; }
  .ac-contact-sep { color: #bbb; margin: 0 7px; }

  /* ── SECTIONS ── */
  .ac-section { margin-bottom: 7px; }
  .ac-section:last-child { margin-bottom: 0; }
  .ac-section-title {
    font-size: 0.95em; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
    color: var(--ac-accent, #2563eb);
    border-bottom: 1.5px solid var(--ac-accent, #2563eb);
    padding-bottom: 2px; margin-bottom: 4px;
  }
  .ac-summary { color: #333; text-align: justify; }

  /* ── ENTRIES ── */
  .ac-entry { margin-bottom: 5px; }
  .ac-entry:last-child { margin-bottom: 0; }
  .ac-entry-head {
    display: flex; justify-content: space-between; align-items: baseline;
    gap: 0 12px; flex-wrap: wrap;
  }
  .ac-entry-title { font-weight: 700; color: #111; }
  .ac-entry-date { font-style: italic; color: #555; font-size: 0.9em; white-space: nowrap; }
  .ac-entry-sub { color: #444; font-size: 0.95em; margin-top: 1px; }
  .ac-bullets { margin: 2px 0 0; padding-left: 17px; }
  .ac-bullets li { margin-bottom: 1px; color: #333; }

  .ac-inline { color: #333; }
  .ac-inline strong { color: #111; }

  /* At print time, don't force a full-page min-height: the mm→px rounding of
     297mm spills a sliver onto a blank 2nd page. Let content flow instead. */
  @media print { .ac-cv { min-height: auto; padding: 12mm 14mm; } }
`;

// Turns an entry into a clean list of bullet strings (from an explicit `bullets`
// array or a newline description), stripping any leading bullet marker.
function toBullets(item) {
  if (Array.isArray(item?.bullets) && item.bullets.length) return item.bullets.filter(Boolean);
  if (item?.description) {
    return item.description
      .split('\n')
      .map((l) => l.replace(/^[-•·▸▪*►•]\s?/, '').trim())
      .filter(Boolean);
  }
  return [];
}

function Section({ title, children }) {
  return (
    <section className="ac-section">
      <h2 className="ac-section-title">{title}</h2>
      {children}
    </section>
  );
}

function Entry({ title, sub, date, bullets = [] }) {
  return (
    <div className="ac-entry">
      <div className="ac-entry-head">
        <span className="ac-entry-title">{title}</span>
        {date && <span className="ac-entry-date">{date}</span>}
      </div>
      {sub && <div className="ac-entry-sub">{sub}</div>}
      {bullets.length > 0 && (
        <ul className="ac-bullets">
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
    </div>
  );
}

export default function CVTemplateAcademic({ data }) {
  const language = data?.language || 'FR';
  const t = (key) => getTranslation(key, language);
  const d = data || defaultData;
  const accent = d.themeColor || '#2563eb';

  const normalizeHref = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);
  const fmtBirth = (s) => {
    if (!s) return '';
    let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    m = s.match(/^(\d{4})-(\d{2})$/);
    if (m) return `${m[2]}/${m[1]}`;
    return s;
  };

  // Birth date / place / nationality are optional (omitted on international CVs).
  const birthBits = [];
  if (d.birthdate) birthBits.push(`${t('born')} ${t('bornDateSep')} ${fmtBirth(d.birthdate)}${d.birthplace ? ` ${t('bornPlaceSep')} ${d.birthplace}` : ''}`);
  else if (d.birthplace) birthBits.push(`${t('born')} ${t('bornPlaceSep')} ${d.birthplace}`);
  if (d.nationality) birthBits.push(d.nationality);

  const contactParts = [
    d.phone && { text: d.phone, href: `tel:${d.phone}` },
    d.email && { text: d.email, href: `mailto:${d.email}` },
    d.address,
    d.linkedin && { text: d.linkedin, href: normalizeHref(d.linkedin) },
    d.website && { text: d.website, href: normalizeHref(d.website) },
    d.github && { text: d.github, href: normalizeHref(d.github) },
    ...birthBits,
  ].filter(Boolean);

  const photoRadius = d.photoSettings?.shape === 'square' ? '6px' : '50%';

  const order = d.sectionsOrder || ['experience', 'education', 'skills', 'languages', 'projects', 'extracurricular', 'certifications', 'interests', 'customSections'];

  const renderSection = (sid) => {
    switch (sid) {
      case 'experience':
        return d.experience?.length > 0 ? (
          <Section key={sid} title={t('experience')}>
            {d.experience.map((exp, i) => (
              <Entry
                key={i}
                title={exp.title}
                sub={[exp.company, exp.location].filter(Boolean).join(' · ')}
                date={exp.period}
                bullets={toBullets(exp)}
              />
            ))}
          </Section>
        ) : null;
      case 'education':
        return d.education?.length > 0 ? (
          <Section key={sid} title={t('education')}>
            {d.education.map((edu, i) => (
              <Entry
                key={i}
                title={edu.degree}
                sub={[edu.school, edu.location].filter(Boolean).join(' · ')}
                date={edu.period}
                bullets={toBullets(edu)}
              />
            ))}
          </Section>
        ) : null;
      case 'projects':
        return d.projects?.length > 0 ? (
          <Section key={sid} title={t('projects')}>
            {d.projects.map((proj, i) => (
              <Entry key={i} title={proj.title} sub={proj.type} bullets={toBullets(proj)} />
            ))}
          </Section>
        ) : null;
      case 'skills':
        return d.skills?.length > 0 ? (
          <Section key={sid} title={t('skills')}>
            <p className="ac-inline">
              {d.skills
                .map((sk) => {
                  const name = typeof sk === 'string' ? sk : sk.name;
                  const lvl = typeof sk === 'object' && sk.showLevel && sk.level ? ` (${sk.level})` : '';
                  return name ? `${name}${lvl}` : '';
                })
                .filter(Boolean)
                .join('   ·   ')}
            </p>
          </Section>
        ) : null;
      case 'languages':
        return d.languages?.length > 0 ? (
          <Section key={sid} title={t('languages')}>
            <p className="ac-inline">
              {d.languages.map((l, i) => {
                const name = typeof l === 'string' ? l : l.name;
                const level = typeof l === 'object' && l.level ? l.level : '';
                return (
                  <React.Fragment key={i}>
                    {i > 0 && <span style={{ color: '#bbb' }}>{'   |   '}</span>}
                    <strong>{name}</strong>{level ? `: ${level}` : ''}
                  </React.Fragment>
                );
              })}
            </p>
          </Section>
        ) : null;
      case 'certifications':
        return d.certifications?.length > 0 ? (
          <Section key={sid} title={t('certifications')}>
            <ul className="ac-bullets">
              {d.certifications.map((c, i) => (
                <li key={i}>
                  <strong>{c.name}</strong>{c.date ? ` — ${c.date}` : ''}{c.org ? ` · ${c.org}` : ''}
                </li>
              ))}
            </ul>
          </Section>
        ) : null;
      case 'extracurricular':
        return d.extracurricular?.length > 0 ? (
          <Section key={sid} title={t('extracurricular')}>
            <ul className="ac-bullets">
              {d.extracurricular.map((item, i) => {
                const text = typeof item === 'string' ? item : (item.name || item.description || '');
                return text ? <li key={i}>{text}</li> : null;
              })}
            </ul>
          </Section>
        ) : null;
      case 'interests':
        return d.interests?.length > 0 ? (
          <Section key={sid} title={t('interests')}>
            <p className="ac-inline">
              {d.interests
                .map((it) => (typeof it === 'string' ? it : it.name || ''))
                .filter(Boolean)
                .join('   ·   ')}
            </p>
          </Section>
        ) : null;
      case 'customSections':
        return d.customSections?.length > 0 ? (
          <React.Fragment key={sid}>
            {d.customSections.map((cs, i) => (cs.name ? (
              <Section key={i} title={cs.name}>
                <div className="ac-summary">
                  {(cs.content || '').split('\n').map((line, j) => <div key={j}>{line}</div>)}
                </div>
              </Section>
            ) : null))}
          </React.Fragment>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="ac-cv cv-document" style={{ '--ac-accent': accent }}>
        {/* ── HEADER ── */}
        <div className="ac-header">
          {d.photo && (
            <img className="ac-photo" src={d.photo} alt="Photo" style={{ borderRadius: photoRadius }} />
          )}
          <div className="ac-name">{d.name || 'Prénom NOM'}</div>
          {d.title && <div className="ac-title">{d.title}</div>}
          {contactParts.length > 0 && (
            <div className="ac-contact">
              {contactParts.map((part, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="ac-contact-sep">|</span>}
                  {typeof part === 'string' ? <span>{part}</span> : <a href={part.href}>{part.text}</a>}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* PROFILE SUMMARY */}
        {d.summary && (
          <Section title={t('profile')}>
            <p className="ac-summary">{d.summary}</p>
          </Section>
        )}

        {/* Remaining sections in the user-defined order */}
        {order.map(renderSection)}
      </div>
    </>
  );
}

// Fallback shown only when no data is provided.
const defaultData = {
  name: 'PRÉNOM NOM',
  title: '',
  phone: '+226 00 00 00 00',
  email: 'prenom.nom@email.com',
  address: 'Ville, Pays',
  summary:
    "Étudiant(e) en ingénierie, avec une expérience pratique fondamentale. À la recherche d'un stage pour renforcer ses compétences techniques et contribuer à des projets concrets.",
  experience: [
    { title: 'Stagiaire', company: 'Entreprise', location: 'Ville', period: '2025 - 2026', bullets: ['Réalisation de tâches sous supervision.', 'Contribution aux tests et à la documentation.'] },
  ],
  education: [
    { degree: "Licence en Génie Électrique", school: 'Burkina Institute of Technology (BIT)', location: 'Koudougou', period: '2025 - 2028', bullets: ['Cours pertinents : circuits électriques, énergies renouvelables.'] },
  ],
  skills: [
    { name: 'Câblage électrique', level: 'Intermédiaire', showLevel: false },
    { name: 'Systèmes photovoltaïques', level: 'Notions', showLevel: false },
    { name: 'Microsoft Word / Excel', level: '', showLevel: false },
  ],
  languages: [
    { name: 'Mooré', level: 'Natif' },
    { name: 'Français', level: 'Courant' },
    { name: 'Anglais', level: 'Intermédiaire' },
  ],
  extracurricular: ['Membre, BIT Technology Club', 'Membre, BIT English Club'],
  sectionsOrder: ['experience', 'education', 'skills', 'languages', 'projects', 'extracurricular', 'certifications', 'interests', 'customSections'],
  themeColor: '#2563eb',
};
