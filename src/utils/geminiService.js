// Thin client for the AI features. The Gemini API key lives server-side in the
// /api/gemini serverless function — it is never shipped to the browser.

import { getGeminiKey } from './aiKey';

async function callGemini(payload) {
  let res;
  try {
    res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, userApiKey: getGeminiKey() }),
    });
  } catch {
    throw new Error('Service IA injoignable. Vérifiez votre connexion.');
  }

  if (!res.ok) {
    let message = `Service IA indisponible (${res.status}).`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch { /* response had no JSON body */ }
    throw new Error(message);
  }

  const { result } = await res.json();
  return result;
}

/**
 * Analyzes CV data and returns suggestions for improvement (phrasing, keywords, structure).
 * @param {Object} cvData
 * @returns {Promise<Object>} Suggestions JSON object
 */
export const analyzeCvData = async (cvData) => {
  // Send only the relevant fields to keep the payload (and token usage) small.
  const cleanData = {
    personalInfo: {
      fullName: cvData.personalInfo.fullName,
      jobTitle: cvData.personalInfo.jobTitle,
      summary: cvData.personalInfo.summary,
    },
    experience: cvData.experience.map(e => ({
      id: e.id,
      position: e.position,
      company: e.company,
      description: e.description,
    })),
    education: cvData.education.map(e => ({
      id: e.id,
      degree: e.degree,
      field: e.field,
      school: e.school,
      description: e.description,
    })),
    skills: cvData.skills.map(s => s.name),
    languages: cvData.languages.map(l => ({ name: l.name, level: l.level })),
    projects: cvData.projects.map(p => ({
      id: p.id,
      title: p.title,
      type: p.type,
      description: p.description,
    })),
    extracurricular: cvData.extracurricular.map(e => typeof e === 'string' ? e : e.name),
  };

  return callGemini({ action: 'analyze', cvData: cleanData });
};

/**
 * Translates the entire CV into a target language, preserving structure and IDs.
 * @param {Object} cvData
 * @param {string} targetLang "FR" | "EN"
 * @returns {Promise<Object>} Translated cvData object
 */
export const translateCvData = async (cvData, targetLang) => {
  // Strip large base64 photo strings before sending to avoid token/payload bloat,
  // then restore them on the translated result.
  const cvDataCopy = JSON.parse(JSON.stringify(cvData));
  const savedPhoto = cvDataCopy.photo;
  const savedOriginalPhoto = cvDataCopy.originalPhoto;
  let savedPersonalInfoPhoto = null;
  let savedPersonalInfoOriginalPhoto = null;

  delete cvDataCopy.photo;
  delete cvDataCopy.originalPhoto;
  if (cvDataCopy.personalInfo) {
    savedPersonalInfoPhoto = cvDataCopy.personalInfo.photo;
    savedPersonalInfoOriginalPhoto = cvDataCopy.personalInfo.originalPhoto;
    delete cvDataCopy.personalInfo.photo;
    delete cvDataCopy.personalInfo.originalPhoto;
  }

  const translated = await callGemini({ action: 'translate', cvData: cvDataCopy, targetLang });

  // Restore the photo properties if they existed.
  if (savedPhoto !== undefined) translated.photo = savedPhoto;
  if (savedOriginalPhoto !== undefined) translated.originalPhoto = savedOriginalPhoto;
  if (translated.personalInfo) {
    if (savedPersonalInfoPhoto !== undefined) translated.personalInfo.photo = savedPersonalInfoPhoto;
    if (savedPersonalInfoOriginalPhoto !== undefined) translated.personalInfo.originalPhoto = savedPersonalInfoOriginalPhoto;
  }

  // Record the active language so templates switch their section labels
  // (Profil↔Profile…) and date wording (Présent↔Present).
  translated.language = targetLang;

  return translated;
};
