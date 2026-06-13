// Bring-Your-Own-Key: the user's personal Gemini API key, stored locally and sent
// to /api/gemini so AI features use *their* free quota instead of the shared one.
const STORAGE_KEY = 'cv-builder-gemini-key';

export const getGeminiKey = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

export const setGeminiKey = (key) => {
  try {
    const k = (key || '').trim();
    if (k) localStorage.setItem(STORAGE_KEY, k);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable — ignore */
  }
};
