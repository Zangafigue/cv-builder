// Pure, deterministic CV "coach". Derives actionable tips from cvData with no AI
// and no network, so it can run reactively (useMemo) on every edit and is fully
// unit-testable — same spirit as cvTextParser. UI strings are in French.

// Bullets that open with these are weak/passive — suggest a strong action verb.
const WEAK_OPENERS = /^(responsable\b|en charge\b|chargé\w*\b|participé\b|aidé\b|travaillé sur\b|gestion de\b|en tant que\b)/i;

const WORDS = (t) => (t ? t.trim().split(/\s+/).filter(Boolean) : []);
const hasNumber = (t) => /\d/.test(t || '');

/** Split a newline description into clean bullet lines (drops leading "- "). */
export function descriptionToBullets(desc) {
  if (!desc) return [];
  return desc
    .split('\n')
    .map((l) => l.trim().replace(/^[-•*]\s?/, '').trim())
    .filter((l) => l.length > 0);
}

let _seq = 0;
const tip = (list, { section, itemId = null, field = null, severity, message }) => {
  list.push({ id: `t${_seq++}`, section, itemId, field, severity, message });
};

/**
 * Analyzes a CV and returns { score, tips }.
 * - score: 0–100 completeness/quality indicator.
 * - tips:  [{ id, section, itemId, field, severity: 'high'|'medium'|'low', message }]
 */
export function analyzeCv(cvData = {}) {
  _seq = 0;
  const tips = [];
  const p = cvData.personalInfo || {};
  const experience = cvData.experience || [];
  const education = cvData.education || [];
  const skills = cvData.skills || [];
  const projects = cvData.projects || [];

  // ── Contact / identity ──────────────────────────────────────────────
  if (!p.fullName?.trim()) tip(tips, { section: 'personalInfo', field: 'fullName', severity: 'high', message: 'Renseignez votre nom complet.' });
  if (!p.email?.trim()) tip(tips, { section: 'personalInfo', field: 'email', severity: 'high', message: 'Ajoutez une adresse e-mail de contact.' });
  if (!p.phone?.trim()) tip(tips, { section: 'personalInfo', field: 'phone', severity: 'medium', message: 'Ajoutez un numéro de téléphone.' });
  if (!p.location?.trim()) tip(tips, { section: 'personalInfo', field: 'location', severity: 'low', message: 'Précisez votre ville / localisation.' });
  if (!p.jobTitle?.trim()) tip(tips, { section: 'personalInfo', field: 'jobTitle', severity: 'medium', message: "Indiquez un intitulé de poste — il cible le reste du CV." });

  // ── Summary ─────────────────────────────────────────────────────────
  const sumWords = WORDS(p.summary).length;
  if (sumWords === 0) {
    tip(tips, { section: 'summary', field: 'summary', severity: 'high', message: 'Ajoutez un résumé de profil de 2–3 phrases.' });
  } else if (sumWords < 25) {
    tip(tips, { section: 'summary', field: 'summary', severity: 'medium', message: `Étoffez votre résumé (${sumWords} mots — visez 40 à 60).` });
  } else if (sumWords > 90) {
    tip(tips, { section: 'summary', field: 'summary', severity: 'low', message: `Résumé un peu long (${sumWords} mots) — resserrez sur l'essentiel.` });
  }
  if (sumWords > 0 && p.jobTitle?.trim()) {
    const titleWord = p.jobTitle.trim().split(/\s+/)[0].toLowerCase();
    if (titleWord.length > 3 && !p.summary.toLowerCase().includes(titleWord)) {
      tip(tips, { section: 'summary', field: 'summary', severity: 'low', message: 'Mentionnez votre métier/poste dans le résumé.' });
    }
  }

  // ── Experience ──────────────────────────────────────────────────────
  // Pro experience is optional for a student profile: only flag when there is
  // neither experience nor projects to show work.
  if (experience.length === 0 && projects.length === 0) {
    tip(tips, { section: 'experience', severity: 'high', message: 'Ajoutez au moins une expérience ou un projet pour illustrer votre travail.' });
  }
  experience.forEach((exp) => {
    const label = exp.position || exp.company || 'cette expérience';
    if (!exp.position?.trim()) tip(tips, { section: 'experience', itemId: exp.id, severity: 'medium', message: 'Intitulé de poste manquant.' });
    if (!exp.company?.trim()) tip(tips, { section: 'experience', itemId: exp.id, severity: 'low', message: `Entreprise manquante pour « ${label} ».` });
    if (!exp.startDate) tip(tips, { section: 'experience', itemId: exp.id, severity: 'low', message: `Dates manquantes pour « ${label} ».` });

    const bullets = descriptionToBullets(exp.description);
    if (bullets.length === 0) {
      tip(tips, { section: 'experience', itemId: exp.id, severity: 'high', message: `Décrivez vos réalisations pour « ${label} » (2–4 points).` });
    } else {
      const quantified = bullets.some(hasNumber);
      if (!quantified) {
        tip(tips, { section: 'experience', itemId: exp.id, severity: 'medium', message: `Quantifiez au moins un résultat (%, €, volume, durée) pour « ${label} ».` });
      }
      bullets.forEach((b, i) => {
        if (WEAK_OPENERS.test(b)) {
          tip(tips, { section: 'experience', itemId: exp.id, severity: 'low', message: `Point ${i + 1} : commencez par un verbe d'action fort (Piloté, Conçu, Augmenté…) plutôt que « ${b.split(/\s+/).slice(0, 2).join(' ')}… ».` });
        }
        if (WORDS(b).length > 30) {
          tip(tips, { section: 'experience', itemId: exp.id, severity: 'low', message: `Point ${i + 1} trop long — scindez ou resserrez.` });
        }
      });
    }
  });

  // ── Education ───────────────────────────────────────────────────────
  if (education.length === 0) {
    tip(tips, { section: 'education', severity: 'medium', message: 'Ajoutez votre formation / vos diplômes.' });
  }

  // ── Skills ──────────────────────────────────────────────────────────
  if (skills.length === 0) {
    tip(tips, { section: 'skills', severity: 'high', message: 'Ajoutez vos compétences clés.' });
  } else {
    if (skills.length < 4) tip(tips, { section: 'skills', severity: 'low', message: `Peu de compétences (${skills.length}) — visez 6 à 10.` });
    const seen = new Set();
    skills.forEach((s) => {
      const k = (s.name || '').trim().toLowerCase();
      if (k && seen.has(k)) tip(tips, { section: 'skills', severity: 'low', message: `Doublon de compétence : « ${s.name} ».` });
      seen.add(k);
    });
  }

  return { score: computeScore(tips), tips };
}

// Score = 100 minus weighted penalties, floored at 0.
function computeScore(tips) {
  const weight = { high: 12, medium: 6, low: 2 };
  const penalty = tips.reduce((sum, t) => sum + (weight[t.severity] || 0), 0);
  return Math.max(0, 100 - penalty);
}

/** Tips for a given section (and optionally a specific item) — for inline display. */
export function tipsFor(result, section, itemId = null) {
  if (!result?.tips) return [];
  return result.tips.filter((t) => t.section === section && (itemId == null || t.itemId === itemId));
}
