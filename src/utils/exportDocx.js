import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';
import { templateSupportsPhoto } from '../templates/templateMeta';

// Decode a base64 data URL (data:image/...;base64,XXXX) into bytes for docx.
const dataUrlToUint8 = (dataUrl) => {
  const b64 = (dataUrl || '').split(',')[1] || '';
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

// docx library sizes/spacing/indents:
// - TextRun/font size uses half-points (1 pt = 2)
// - Spacing, margin, indent, and other measurements use twips / twentieths of a point (dxa) (1 pt = 20)
const halfPt = (n) => n * 2;
const dxa = (n) => n * 20;

const sectionHeading = (text) =>
  new Paragraph({
    text: text.toUpperCase(),
    heading: HeadingLevel.HEADING_2,
    spacing: { before: dxa(8), after: dxa(2) },
    border: {
      bottom: { color: '3b82f6', space: 2, style: BorderStyle.SINGLE, size: 8 },
    },
    run: {
      bold: true,
      color: '1e293b',
      size: halfPt(10),
      allCaps: true,
    },
  });

const bullet = (text) =>
  new Paragraph({
    text: `• ${text.replace(/^[-•·▸▪*►] ?/, '')}`,
    spacing: { after: dxa(1) },
    indent: { left: dxa(8) },
    run: { size: halfPt(9), color: '374151' },
  });

const meta = (text) =>
  new Paragraph({
    children: [new TextRun({ text, size: halfPt(8.5), color: '6b7280', italics: true })],
    spacing: { after: dxa(1) },
  });

const body = (text, opts = {}) =>
  new Paragraph({
    children: [new TextRun({ text, size: halfPt(9.5), color: '374151', ...opts })],
    spacing: { after: dxa(2) },
  });

const empty = () => new Paragraph({
  spacing: { before: 0, after: dxa(4) },
  children: [new TextRun({ text: '', size: halfPt(1) })]
});

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  return month ? `${months[parseInt(month, 10) - 1]} ${year}` : year;
};

// ─── Main export function ─────────────────────────────────────────────────────

export const exportToDocx = async (cvData) => {
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
    sectionsOrder = [],
    language = 'FR',
    template = '',
  } = cvData;

  const lang = (language === 'EN' || language === 'en') ? 'EN' : 'FR';
  const t = (key) => {
    const dict = {
      FR: {
        profile: "Profil",
        experience: "Expérience Professionnelle",
        education: "Formation",
        skills: "Compétences",
        languages: "Langues",
        interests: "Centres d'intérêt",
        certifications: "Certifications",
        projects: "Projets Réalisés",
        extracurricular: "Activités Extrascolaires & Bénévolat",
        present: "Présent",
        born: "Né(e)", bornDateSep: "le", bornPlaceSep: "à"
      },
      EN: {
        profile: "Profile Summary",
        experience: "Professional Experience",
        education: "Education",
        skills: "Skills",
        languages: "Languages",
        interests: "Interests & Hobbies",
        certifications: "Certifications",
        projects: "Completed Projects",
        extracurricular: "Extracurricular Activities & Volunteering",
        present: "Present",
        born: "Born", bornDateSep: "on", bornPlaceSep: "in"
      }
    };
    return dict[lang][key] || key;
  };

  const children = [];

  // ── PHOTO (only if the template supports it and one is set) ──────────────────
  if (personalInfo.photo && templateSupportsPhoto(template)) {
    try {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: dxa(3) },
          children: [
            new ImageRun({
              type: 'jpg',
              data: dataUrlToUint8(personalInfo.photo),
              transformation: { width: 90, height: 90 },
            }),
          ],
        })
      );
    } catch (e) {
      console.warn('Could not embed photo in DOCX:', e);
    }
  }

  // ── HEADER ─────────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personalInfo.fullName || 'Votre Nom',
          bold: true,
          size: halfPt(18),
          color: '111827',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: dxa(2) },
    })
  );

  if (personalInfo.jobTitle) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: personalInfo.jobTitle, size: halfPt(11), color: '3b82f6', bold: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: dxa(3) },
      })
    );
  }

  // Birth date / place / nationality, formatted like the templates.
  const fmtBirth = (s) => {
    if (!s) return '';
    let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    m = s.match(/^(\d{4})-(\d{2})$/);
    if (m) return `${m[2]}/${m[1]}`;
    return s;
  };
  const birthBits = [];
  if (personalInfo.birthDate) birthBits.push(`${t('born')} ${t('bornDateSep')} ${fmtBirth(personalInfo.birthDate)}${personalInfo.birthPlace ? ` ${t('bornPlaceSep')} ${personalInfo.birthPlace}` : ''}`);
  else if (personalInfo.birthPlace) birthBits.push(`${t('born')} ${t('bornPlaceSep')} ${personalInfo.birthPlace}`);
  if (personalInfo.nationality) birthBits.push(personalInfo.nationality);

  // Contact line
  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.website,
    ...birthBits,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts.join('  |  '), size: halfPt(8.5), color: '6b7280' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: dxa(6) },
      })
    );
  }

  // ── PROFIL ─────────────────────────────────────────────────────────────────
  if (personalInfo.summary) {
    children.push(sectionHeading(t('profile')));
    children.push(body(personalInfo.summary));
    children.push(empty());
  }

  // ── SECTION BUILDER ────────────────────────────────────────────────────────

  const buildSection = (sectionId) => {
    switch (sectionId) {
      case 'experience':
        if (!experience.length) return;
        children.push(sectionHeading(t('experience')));
        experience.forEach((exp) => {
          const dateRange = [
            formatDate(exp.startDate),
            exp.current ? t('present') : formatDate(exp.endDate),
          ].filter(Boolean).join(' – ');

          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: exp.position || '', bold: true, size: halfPt(9.5), color: '111827' }),
                new TextRun({ text: exp.company ? `  —  ${exp.company}` : '', size: halfPt(9), color: '3b82f6' }),
                new TextRun({ text: dateRange ? `   (${dateRange})` : '', size: halfPt(8.5), color: '6b7280', italics: true }),
              ],
              spacing: { before: dxa(4), after: dxa(1) },
            })
          );

          if (exp.description) {
            exp.description.split('\n').filter(l => l.trim()).forEach(line => {
              children.push(bullet(line));
            });
          }
        });
        children.push(empty());
        break;

      case 'education':
        if (!education.length) return;
        children.push(sectionHeading(t('education')));
        education.forEach((edu) => {
          const dateRange = [
            formatDate(edu.startDate),
            edu.current ? t('present') : formatDate(edu.endDate),
          ].filter(Boolean).join(' – ');

          const degreeText = [edu.degree, edu.field].filter(Boolean).join(' — ');
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: degreeText || '', bold: true, size: halfPt(9.5), color: '111827' }),
                new TextRun({ text: edu.school ? `   |   ${edu.school}` : '', size: halfPt(9), color: '3b82f6' }),
                new TextRun({ text: dateRange ? `   (${dateRange})` : '', size: halfPt(8.5), color: '6b7280', italics: true }),
              ],
              spacing: { before: dxa(4), after: dxa(1) },
            })
          );
          if (edu.description) {
            children.push(meta(edu.description));
          }
        });
        children.push(empty());
        break;

      case 'skills': {
        if (!skills.length) return;
        children.push(sectionHeading(t('skills')));
        // One line per skill (faithful to the templates) — keeps grouped names
        // like "Front-end : React, TypeScript…" intact instead of re-grouping.
        skills.forEach((s) => {
          const name = typeof s === 'string' ? s : s.name;
          if (!name) return;
          const level = (typeof s === 'object' && s.showLevel && s.level) ? s.level : '';
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: name, size: halfPt(9), color: '374151' }),
                ...(level ? [new TextRun({ text: `  (${level})`, size: halfPt(8.5), color: '6b7280', italics: true })] : []),
              ],
              spacing: { after: dxa(1) },
            })
          );
        });
        children.push(empty());
        break;
      }

      case 'languages': {
        if (!languages.length) return;
        children.push(sectionHeading(t('languages')));
        const langParts = languages.map(lang => {
          const name = typeof lang === 'string' ? lang : lang.name;
          const level = typeof lang === 'object' && lang.level ? lang.level : '';
          return level ? `${name} (${level})` : name;
        }).filter(Boolean).join('   ·   ');
        children.push(body(langParts));
        children.push(empty());
        break;
      }

      case 'projects':
        if (!projects.length) return;
        children.push(sectionHeading(t('projects')));
        projects.forEach((proj) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: proj.title || '', bold: true, size: halfPt(9.5), color: '111827' }),
                new TextRun({ text: proj.type ? `  —  ${proj.type}` : '', size: halfPt(9), color: '3b82f6' }),
              ],
              spacing: { before: dxa(4), after: dxa(1) },
            })
          );
          const bullets = Array.isArray(proj.bullets) && proj.bullets.length > 0
            ? proj.bullets
            : (proj.description || '').split('\n').filter(l => l.trim());
          bullets.forEach(b => children.push(bullet(b)));
        });
        children.push(empty());
        break;

      case 'extracurricular':
        if (!extracurricular.length) return;
        children.push(sectionHeading(t('extracurricular')));
        extracurricular.forEach((item) => {
          const text = typeof item === 'string' ? item : (item.name || '');
          if (text) children.push(bullet(text));
        });
        children.push(empty());
        break;

      case 'certifications': {
        if (!certifications.length) return;
        children.push(sectionHeading(t('certifications')));
        const certParts = certifications.map((c) => {
          return [c.name, c.org, c.date ? `(${c.date})` : ''].filter(Boolean).join(' · ');
        }).join('   ·   ');
        children.push(body(certParts));
        children.push(empty());
        break;
      }

      case 'interests':
        if (!interests.length) return;
        children.push(sectionHeading(t('interests')));
        children.push(
          body(interests.map(i => (typeof i === 'string' ? i : i.name)).filter(Boolean).join('   ·   '))
        );
        children.push(empty());
        break;

      default:
        break;
    }
  };

  // Ordered sections
  const allSectionIds = [
    'experience', 'education', 'skills', 'languages',
    'projects', 'extracurricular', 'certifications', 'interests',
  ];
  const orderedSections = [
    ...sectionsOrder.filter(id => allSectionIds.includes(id)),
    ...allSectionIds.filter(id => !sectionsOrder.includes(id)),
  ];

  orderedSections.forEach(buildSection);

  // Custom sections
  customSections.forEach((cs) => {
    if (!cs.name) return;
    children.push(sectionHeading(cs.name));
    (cs.content || '').split('\n').filter(l => l.trim()).forEach(line => {
      children.push(body(line));
    });
    children.push(empty());
  });

  // ── GENERATE DOC ───────────────────────────────────────────────────────────
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          run: { font: 'Calibri', size: halfPt(9.5) },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: dxa(36), right: dxa(36), bottom: dxa(36), left: dxa(36) },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `CV_${(personalInfo.fullName || 'Mon_CV').replace(/\s+/g, '_')}.docx`;
  saveAs(blob, filename);
};
