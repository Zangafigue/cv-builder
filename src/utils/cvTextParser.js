// Pure CV text-parsing logic, extracted from ImportService so it can be unit
// tested without pulling in the heavy pdfjs / mammoth IO dependencies.

// ─── Date utilities ──────────────────────────────────────────────────────────

const MONTHS_FR = {
  janvier: '01', février: '02', fevrier: '02', mars: '03', avril: '04',
  mai: '05', juin: '06', juillet: '07', août: '08', aout: '08',
  septembre: '09', octobre: '10', novembre: '11', décembre: '12', decembre: '12',
  jan: '01', fév: '02', fev: '02', avr: '04', juil: '07',
  sep: '09', oct: '10', nov: '11', déc: '12', dec: '12',
};

const MONTHS_EN = {
  january: '01', february: '02', march: '03', april: '04',
  may: '05', june: '06', july: '07', august: '08',
  september: '09', october: '10', november: '11', december: '12',
  jan: '01', feb: '02', mar: '03', apr: '04',
  jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11',
};

const ALL_MONTHS = { ...MONTHS_FR, ...MONTHS_EN };

/**
 * Converts a date string (many formats) to YYYY-MM for <input type="month">.
 * Returns '' if unrecognised.
 */
export function toYYYYMM(raw) {
  if (!raw) return '';
  const s = raw.trim().toLowerCase().replace(/[.,]/g, '');

  // Already YYYY-MM
  if (/^\d{4}-\d{2}$/.test(s)) return s;

  // MM/YYYY  MM-YYYY  MM.YYYY
  const slashFmt = s.match(/^(\d{1,2})[/-](\d{4})$/);
  if (slashFmt) return `${slashFmt[2]}-${slashFmt[1].padStart(2, '0')}`;

  // YYYY only
  if (/^\d{4}$/.test(s)) return `${s}-01`;

  // "Month YYYY"  or  "Month. YYYY"
  const mY = s.match(/^([a-zà-ÿ]+)\s+(\d{4})$/);
  if (mY) {
    const m = ALL_MONTHS[mY[1]];
    if (m) return `${mY[2]}-${m}`;
  }

  // "YYYY Month"
  const Ym = s.match(/^(\d{4})\s+([a-zà-ÿ]+)$/);
  if (Ym) {
    const m = ALL_MONTHS[Ym[2]];
    if (m) return `${Ym[1]}-${m}`;
  }

  return '';
}

/** Parses a "start - end" range string and returns { startDate, endDate, current }. */
export function parseDateRange(text) {
  // Separator: -, –, —, à, to, au
  const parts = text.split(/\s*[-–—]\s*|\s+(?:à|to|au)\s+/i);
  if (parts.length < 2) return null;

  const startDate = toYYYYMM(parts[0].trim());
  if (!startDate) return null;

  const endRaw = parts.slice(1).join(' ').trim();
  const current = /présent|present|aujourd|ongoing|now|en cours|actuel/i.test(endRaw);
  const endDate = current ? '' : toYYYYMM(endRaw);

  return { startDate, endDate, current };
}

/** Tries to extract a date-range from a line, returns range object or null. */
function extractDateRange(line) {
  // A line is a date range if it matches patterns like "Jan 2020 - Dec 2022" or "2020 - Présent"
  const datePattern = /(\d{4}|(?:[a-zà-ÿ]+\.?\s+\d{4}))\s*[-–—]\s*(\d{4}|(?:[a-zà-ÿ]+\.?\s+\d{4})|présent|present|en cours|actuel|aujourd)/i;
  const m = line.match(datePattern);
  if (!m) return null;
  return parseDateRange(m[0]);
}

// ─── Section detection ────────────────────────────────────────────────────────

const SECTION_PATTERNS = {
  experience: /^(expériences?|parcours professionnel|professional experience|work experience|emplois?|career|historique professionnel)/i,
  education: /^(formations?|études|éducation|education|diplômes?|scolarité|academic background)/i,
  skills: /^(compétences?|skills|aptitudes|technical skills|outils|technologies)/i,
  languages: /^(langues?|languages?)/i,
  interests: /^(centres? d.intérêt|intérêts?|loisirs?|hobbies|activités?)/i,
  certifications: /^(certifications?|diplômes?|certificats?|accréditations?|licences?)/i,
  summary: /^(profil|résumé|à propos|about|summary|objectif|présentation|introduction)/i,
};

export function detectSection(line) {
  for (const [section, pattern] of Object.entries(SECTION_PATTERNS)) {
    if (pattern.test(line.trim())) return section;
  }
  return null;
}

// ─── Entry builder ────────────────────────────────────────────────────────────

/**
 * Groups lines from a section into structured entries, using date-range lines as anchors.
 */
function buildEntries(lines, type) {
  const entries = [];
  let current = null;

  const flush = () => {
    if (current) {
      // Clean up description
      current.description = current.description.trim();
      entries.push(current);
      current = null;
    }
  };

  const makeEntry = () =>
    type === 'experience'
      ? { position: '', company: '', startDate: '', endDate: '', current: false, description: '' }
      : { degree: '', field: '', school: '', startDate: '', endDate: '', current: false, description: '' };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const dateRange = extractDateRange(trimmed);

    if (dateRange) {
      // This line contains a date range — it anchors a new entry
      flush();
      current = { ...makeEntry(), ...dateRange };

      // Try to extract title from the non-date portion of the same line
      const rest = trimmed
        .replace(/(\d{4}|(?:[a-zà-ÿ]+\.?\s+\d{4}))\s*[-–—]\s*(\d{4}|(?:[a-zà-ÿ]+\.?\s+\d{4})|présent|present|en cours|actuel|aujourd)/gi, '')
        .replace(/[|,\s]+$/, '')
        .replace(/^[|,\s]+/, '')
        .trim();

      if (rest.length > 1) {
        if (type === 'experience') current.position = rest;
        else current.degree = rest;
      }
    } else if (current !== null) {
      const hasBullet = /^[-•·▸▪*►•]/.test(trimmed);
      const isLong = trimmed.length > 80;

      if (hasBullet || isLong) {
        // Bullet points / long lines → description
        const clean = hasBullet ? trimmed : trimmed;
        current.description += (current.description ? '\n' : '') + clean;
      } else if (type === 'experience') {
        // Short non-bullet: fill missing fields in order
        if (!current.position) current.position = trimmed;
        else if (!current.company) current.company = trimmed;
        else current.description += (current.description ? '\n' : '') + trimmed;
      } else {
        // Education
        if (!current.degree) current.degree = trimmed;
        else if (!current.school) current.school = trimmed;
        else if (!current.field) current.field = trimmed;
        else current.description += (current.description ? '\n' : '') + trimmed;
      }
    } else {
      // Before first date-range anchor: start an entry with what we have
      current = makeEntry();
      if (type === 'experience') current.position = trimmed;
      else current.degree = trimmed;
    }
  }

  flush();
  return entries;
}

// ─── Skills parser ────────────────────────────────────────────────────────────

/**
 * Parses a skill line — handles comma/semicolon/pipe-separated lists and single skills.
 */
function parseSkillLine(line) {
  const result = [];
  // Split on ,  ;  |  •  /  or newlines
  const parts = line.split(/[,;|•/\n]+/).map(p => p.trim()).filter(p => p.length > 1 && p.length < 60);
  for (const part of parts) {
    // Clean up common noise
    const clean = part.replace(/^\s*[-*▸►]\s*/, '').trim();
    if (clean.length > 1) result.push({ name: clean, level: 'Avancé', showLevel: false });
  }
  return result;
}

// ─── Main text extractor ──────────────────────────────────────────────────────

export const extractDataFromText = (text) => {
  const data = {
    personalInfo: {
      fullName: '', jobTitle: '', email: '', phone: '',
      birthDate: '', birthPlace: '', nationality: '', location: '',
      linkedin: '', website: '', summary: '', photo: '',
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    interests: [],
    certifications: [],
  };

  // ── Global regex extractions ──────────────────────────────────────────────

  // Email
  const emailM = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailM) data.personalInfo.email = emailM[0];

  // Phone (international + local formats)
  const phoneM = text.match(/(?:(?:\+|00)\d{1,3}[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/);
  if (phoneM) data.personalInfo.phone = phoneM[0].trim();

  // LinkedIn
  const linkedinM = text.match(/(?:linkedin\.com\/in\/|linkedin\s*:\s*)([a-zA-Z0-9\-_]+)/i);
  if (linkedinM) data.personalInfo.linkedin = `linkedin.com/in/${linkedinM[1]}`;

  // Website / Portfolio (avoid linkedin, emails, common noise)
  const websiteM = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-z]{2,}(?:\/[^\s]*)?)/i);
  if (websiteM && !websiteM[0].toLowerCase().includes('linkedin.com') && !websiteM[0].includes('@')) {
    data.personalInfo.website = websiteM[0];
  }

  // Nationality
  const nationalityM = text.match(/(?:nationalité|nationality)\s*:?\s*([^\n,;]+)/i);
  if (nationalityM) data.personalInfo.nationality = nationalityM[1].trim();

  // Birth date — try multiple formats
  const birthDatePatterns = [
    /(?:né(?:e)?\s+le|date de naissance|dob|born|birthdate)\s*:?\s*(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4})/i,
    /(\d{1,2}[/.-]\d{1,2}[/.-]\d{4})/,
  ];
  for (const p of birthDatePatterns) {
    const m = text.match(p);
    if (m) {
      // Try to convert dd/mm/yyyy → yyyy-mm
      const parts = m[1].split(/[/.-]/);
      if (parts.length === 3) {
        const year = parts[2].length === 4 ? parts[2] : `20${parts[2]}`;
        const month = parts[1].padStart(2, '0');
        data.personalInfo.birthDate = `${year}-${month}`;
      }
      break;
    }
  }

  // Birth place
  const birthPlaceM = text.match(/(?:né(?:e)?\s+(?:le\s+[\d/.-]+\s+)?à|lieu de naissance|birthplace|lieu de naissance)\s*:?\s*([^\n,;]+)/i);
  if (birthPlaceM) data.personalInfo.birthPlace = birthPlaceM[1].trim().split('\n')[0];

  // ── Line-by-line parsing ──────────────────────────────────────────────────

  const rawLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Detect full name (first non-empty line that isn't an email/phone/url/section header)
  const noisePattern = /[@\d{5}]|linkedin|github|http|www\.|profil|résumé|cv\b/i;
  for (let i = 0; i < Math.min(rawLines.length, 5); i++) {
    const line = rawLines[i];
    if (line.length > 2 && line.length < 50 && !noisePattern.test(line) && !detectSection(line)) {
      data.personalInfo.fullName = line;
      // Next short non-noise line might be the job title
      for (let j = i + 1; j < Math.min(rawLines.length, i + 5); j++) {
        const next = rawLines[j];
        if (next.length > 3 && next.length < 80 && !noisePattern.test(next) && !detectSection(next) && !next.includes('@')) {
          data.personalInfo.jobTitle = next;
          break;
        }
      }
      break;
    }
  }

  // Section-based parsing
  let currentSection = null;
  const sectionLines = {};

  for (const line of rawLines) {
    const detected = detectSection(line);
    if (detected) {
      currentSection = detected;
      if (!sectionLines[currentSection]) sectionLines[currentSection] = [];
      continue;
    }

    if (!currentSection) {
      // Before first section: capture summary if line is long enough
      if (line.length > 80 && !data.personalInfo.summary && !noisePattern.test(line)) {
        data.personalInfo.summary = line;
      }
      continue;
    }

    if (!sectionLines[currentSection]) sectionLines[currentSection] = [];
    sectionLines[currentSection].push(line);
  }

  // ── Build structured data from sections ───────────────────────────────────

  // Summary
  if (sectionLines.summary) {
    data.personalInfo.summary = sectionLines.summary
      .filter(l => l.length > 20)
      .join(' ')
      .trim();
  }

  // Experience
  if (sectionLines.experience) {
    data.experience = buildEntries(sectionLines.experience, 'experience');
  }

  // Education
  if (sectionLines.education) {
    data.education = buildEntries(sectionLines.education, 'education');
  }

  // Skills
  if (sectionLines.skills) {
    const allSkills = [];
    for (const line of sectionLines.skills) {
      const parsed = parseSkillLine(line);
      allSkills.push(...parsed);
    }
    // Deduplicate by name
    const seen = new Set();
    data.skills = allSkills.filter(s => {
      if (seen.has(s.name.toLowerCase())) return false;
      seen.add(s.name.toLowerCase());
      return true;
    });
  }

  // Languages
  if (sectionLines.languages) {
    for (const line of sectionLines.languages) {
      // Format: "Français - Natif" or "English (B2)" or "English : Courant"
      const parts = line.split(/\s*[-–:()]\s*/);
      if (parts[0] && parts[0].trim().length > 1) {
        const name = parts[0].trim();
        const level = parts[1] ? parts[1].replace(/[()]/g, '').trim() : '';
        if (name.length < 30) {
          data.languages.push({ name, level: level || 'Courant', showLevel: !!level });
        }
      }
    }
  }

  // Interests
  if (sectionLines.interests) {
    for (const line of sectionLines.interests) {
      const parts = line.split(/[,;|•/]+/).map(p => p.trim()).filter(p => p.length > 1 && p.length < 40);
      data.interests.push(...parts);
    }
    // Deduplicate
    data.interests = [...new Set(data.interests)];
  }

  // Certifications
  if (sectionLines.certifications) {
    for (const line of sectionLines.certifications) {
      if (line.length < 5) continue;
      // Try to extract date from parentheses or at end
      const dateM = line.match(/\(?\b(\d{4})\b\)?/);
      const date = dateM ? dateM[1] : '';
      // Try to extract org after • or — or :
      const orgM = line.match(/[•—\-:]\s*(.+)$/);
      const org = orgM ? orgM[1].trim() : '';
      const name = line
        .replace(/\(?\b\d{4}\b\)?/g, '')
        .replace(/[•—\-:].*$/, '')
        .trim();
      if (name.length > 2) {
        data.certifications.push({ name, date, org });
      }
    }
  }

  return data;
};
