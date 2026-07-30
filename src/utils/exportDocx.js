import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  BorderStyle,
  AlignmentType,
} from 'docx';
import { saveAs } from 'file-saver';
import { getTranslation } from '../templates/shared/translations';
import { templateSupportsPhoto } from '../templates/templateMeta';

// docx units: font sizes in half-points (1pt = 2); spacing/indent/margins in twips (1pt = 20).
const halfPt = (n) => n * 2;
const dxa = (n) => n * 20;

// Sober academic/BIT palette (black-on-white); section accents use the theme color.
const C = {
  name: '111111',
  title: '444444',
  body: '333333',
  muted: '666666',
};

const DEFAULT_ACCENT = '2563eb';

// Decode a base64 data URL into bytes for docx ImageRun.
const dataUrlToUint8 = (dataUrl) => {
  const b64 = (dataUrl || '').split(',')[1] || '';
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  return month ? `${months[parseInt(month, 10) - 1]} ${year}` : year;
};

const fmtBirth = (s) => {
  if (!s) return '';
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  m = s.match(/^(\d{4})-(\d{2})$/);
  if (m) return `${m[2]}/${m[1]}`;
  return s;
};

// ─── Content paragraph helpers ─────────────────────────────────────────────────

const bodyPara = (text) =>
  new Paragraph({
    children: [new TextRun({ text, size: halfPt(9.5), color: C.body })],
    spacing: { after: dxa(1.5) },
  });

const bulletPara = (text) =>
  new Paragraph({
    children: [new TextRun({ text: `•  ${text.replace(/^[-•·▸▪*►] ?/, '')}`, size: halfPt(9.5), color: C.body })],
    indent: { left: dxa(10), hanging: dxa(10) },
    spacing: { after: dxa(1) },
  });

const entryHead = ({ title, sub, date }) =>
  new Paragraph({
    children: [
      new TextRun({ text: title || '', bold: true, size: halfPt(10), color: C.name }),
      sub ? new TextRun({ text: `   ${sub}`, size: halfPt(9.5), color: C.name }) : null,
      date ? new TextRun({ text: `   (${date})`, size: halfPt(8.5), color: C.muted, italics: true }) : null,
    ].filter(Boolean),
    spacing: { before: dxa(3), after: dxa(0.5) },
  });

// Full-width section heading (uppercase, theme-colored, underlined) + its content.
const sectionBlock = (accent, label, paras) => [
  new Paragraph({
    children: [new TextRun({ text: (label || '').toUpperCase(), bold: true, size: halfPt(10.5), color: accent })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: accent } },
    spacing: { before: dxa(8), after: dxa(3) },
  }),
  ...paras,
];

// ─── Main export function ───────────────────────────────────────────────────────

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
    themeColor = '',
  } = cvData;

  const accent = (themeColor || '').replace('#', '') || DEFAULT_ACCENT;
  // Same labels as the on-screen templates, so the Word doc matches the view.
  const t = (key) => getTranslation(key, language);

  // ── Birth date / place / nationality (translated, optional) ─────────────────
  const birthBits = [];
  if (personalInfo.birthDate) birthBits.push(`${t('born')} ${t('bornDateSep')} ${fmtBirth(personalInfo.birthDate)}${personalInfo.birthPlace ? ` ${t('bornPlaceSep')} ${personalInfo.birthPlace}` : ''}`);
  else if (personalInfo.birthPlace) birthBits.push(`${t('born')} ${t('bornPlaceSep')} ${personalInfo.birthPlace}`);
  if (personalInfo.nationality) birthBits.push(personalInfo.nationality);

  // ── Header: centered photo (optional) + name + title + contact line ─────────
  const children = [];

  if (personalInfo.photo && templateSupportsPhoto(template)) {
    try {
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: dxa(3) },
        children: [new ImageRun({ type: 'jpg', data: dataUrlToUint8(personalInfo.photo), transformation: { width: 72, height: 72 } })],
      }));
    } catch (e) {
      console.warn('Could not embed photo in DOCX:', e);
    }
  }

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: personalInfo.jobTitle ? dxa(0.5) : dxa(2) },
    children: [new TextRun({ text: personalInfo.fullName || 'Votre Nom', bold: true, size: halfPt(18), color: C.name })],
  }));

  if (personalInfo.jobTitle) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: dxa(2) },
      children: [new TextRun({ text: personalInfo.jobTitle, size: halfPt(11), color: C.title })],
    }));
  }

  const contactParts = [
    personalInfo.phone,
    personalInfo.email,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.website,
    ...birthBits,
  ].filter(Boolean);
  if (contactParts.length) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: dxa(6) },
      children: [new TextRun({ text: contactParts.join('   ·   '), size: halfPt(9), color: C.muted })],
    }));
  }

  // ── Section content builders (return arrays of paragraphs) ─────────────────
  const buildContent = (id) => {
    switch (id) {
      case 'experience':
        return experience.flatMap((exp) => {
          const date = [formatDate(exp.startDate), exp.current ? t('present') : formatDate(exp.endDate)].filter(Boolean).join(' – ');
          return [
            entryHead({ title: exp.position, sub: exp.company, date }),
            ...(exp.description || '').split('\n').filter((l) => l.trim()).map(bulletPara),
          ];
        });
      case 'education':
        return education.flatMap((edu) => {
          const date = [formatDate(edu.startDate), edu.current ? t('present') : formatDate(edu.endDate)].filter(Boolean).join(' – ');
          const degree = [edu.degree, edu.field].filter(Boolean).join(' — ');
          const out = [entryHead({ title: degree, sub: edu.school, date })];
          if (edu.description) out.push(bodyPara(edu.description));
          return out;
        });
      case 'projects':
        return projects.flatMap((proj) => {
          const bullets = Array.isArray(proj.bullets) && proj.bullets.length
            ? proj.bullets
            : (proj.description || '').split('\n').filter((l) => l.trim());
          return [entryHead({ title: proj.title, sub: proj.type }), ...bullets.map(bulletPara)];
        });
      case 'skills':
        return skills
          .map((s) => ({ name: typeof s === 'string' ? s : s.name, level: (typeof s === 'object' && s.showLevel && s.level) ? s.level : '' }))
          .filter((s) => s.name)
          .map((s) => new Paragraph({
            children: [
              new TextRun({ text: s.name, size: halfPt(9.5), color: C.body }),
              ...(s.level ? [new TextRun({ text: `  (${s.level})`, size: halfPt(8.5), color: C.muted, italics: true })] : []),
            ],
            spacing: { after: dxa(1) },
          }));
      case 'languages':
        return languages.map((l) => {
          const name = typeof l === 'string' ? l : l.name;
          const level = (typeof l === 'object' && l.level) ? l.level : '';
          return bodyPara(level ? `${name} (${level})` : name);
        });
      case 'certifications':
        return certifications.map((c) => bulletPara([c.name, c.date && `— ${c.date}`, c.org && `· ${c.org}`].filter(Boolean).join(' ')));
      case 'extracurricular':
        return extracurricular
          .map((item) => (typeof item === 'string' ? item : (item.name || '')))
          .filter(Boolean)
          .map(bulletPara);
      case 'interests':
        return [bodyPara(interests.map((i) => (typeof i === 'string' ? i : i.name)).filter(Boolean).join('  ·  '))];
      default:
        return [];
    }
  };

  // ── Sections, in the user-defined order (full-width headings) ──────────────
  if (personalInfo.summary) children.push(...sectionBlock(accent, t('profile'), [bodyPara(personalInfo.summary)]));

  const allSectionIds = ['experience', 'education', 'skills', 'languages', 'projects', 'extracurricular', 'certifications', 'interests'];
  const orderedSections = [
    ...sectionsOrder.filter((id) => allSectionIds.includes(id)),
    ...allSectionIds.filter((id) => !sectionsOrder.includes(id)),
  ];
  orderedSections.forEach((id) => {
    const content = buildContent(id);
    if (content.length) children.push(...sectionBlock(accent, t(id), content));
  });
  customSections.forEach((cs) => {
    if (!cs.name) return;
    const content = (cs.content || '').split('\n').filter((l) => l.trim()).map(bodyPara);
    if (content.length) children.push(...sectionBlock(accent, cs.name, content));
  });

  // ── Generate document ──────────────────────────────────────────────────────
  const doc = new Document({
    styles: {
      paragraphStyles: [{ id: 'Normal', name: 'Normal', run: { font: 'Calibri', size: halfPt(9.5) } }],
    },
    sections: [
      {
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: dxa(36), right: dxa(40), bottom: dxa(36), left: dxa(40) } } },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `CV_${(personalInfo.fullName || 'Mon_CV').replace(/\s+/g, '_')}.docx`;
  saveAs(blob, filename);
};
