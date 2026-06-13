import { GoogleGenerativeAI } from '@google/generative-ai';

// Vercel serverless function (Node runtime).
// Holds the Gemini API key server-side so it is never shipped to the browser.
// Client calls POST /api/gemini with { action: 'analyze' | 'translate', cvData, targetLang }.

const MODEL = 'gemini-2.5-flash';

// Strip markdown code fences that the model sometimes wraps JSON in.
function stripJsonFences(text) {
  return text
    .trim()
    .replace(/^```json/i, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim();
}

function buildAnalyzePrompt(cleanData) {
  return `
Vous êtes un expert en recrutement et en optimisation de CV.
Voici les données d'un CV importé au format JSON :
${JSON.stringify(cleanData, null, 2)}

Analysez ce CV et proposez des suggestions concrètes d'amélioration sous la forme d'un objet JSON.
Votre réponse doit être un JSON valide correspondant EXACTEMENT au schéma suivant :
{
  "bulletImprovements": [
    {
      "section": "experience" ou "projects",
      "itemId": "L'identifiant (ID) exact de l'expérience ou du projet concerné",
      "original": "La phrase ou le bullet point d'origine à améliorer",
      "suggested": "La nouvelle formulation améliorée (plus percutante, orientée résultats)",
      "explanation": "Pourquoi cette formulation est meilleure"
    }
  ],
  "missingKeywords": [
    {
      "keyword": "Le mot-clé ou compétence technique recommandée",
      "explanation": "Pourquoi l'ajouter par rapport au profil"
    }
  ],
  "structural": [
    {
      "suggestion": "Suggestion d'amélioration de la structure générale du profil",
      "explanation": "Bénéfice de cette suggestion"
    }
  ]
}

Règles impératives :
1. Les suggestions doivent être rédigées en français.
2. Si le CV n'a pas besoin de modifications majeures, proposez quand même 2 ou 3 améliorations subtiles mais pertinentes.
3. Retournez UNIQUEMENT le code JSON. N'entourez pas la réponse de balises de code Markdown (\`\`\`json ... \`\`\`), retournez simplement le texte JSON brut.
`;
}

function buildTranslatePrompt(cvData, targetLang) {
  const targetLanguageFull = targetLang === 'EN' ? 'Anglais (English)' : 'Français (French)';
  return `
Vous êtes un traducteur professionnel spécialisé dans la localisation de CVs.
Traduisez l'intégralité des données du CV ci-dessous vers la langue cible : "${targetLanguageFull}".
Conservez strictement la structure JSON d'origine, les clés du JSON, les identifiants (IDs), les couleurs de thème, et la police de caractères.
Ne traduisez que les valeurs textuelles modifiables (noms de postes, descriptions, formations, loisirs, rubriques personnalisées, etc.).
Les dates doivent rester au même format.

Voici les données du CV au format JSON :
${JSON.stringify(cvData, null, 2)}

Retournez uniquement le JSON traduit valide. N'entourez pas la réponse de balises de code Markdown (\`\`\`json ... \`\`\`), retournez simplement le texte JSON brut.
`;
}

// Best-effort per-IP rate limit for the SHARED server key only (per warm instance;
// back it with Vercel KV / Upstash for robust cross-instance limiting).
const RL_WINDOW_MS = 60_000;
const RL_MAX = 6;
const rlHits = new Map();
function serverKeyRateLimited(ip) {
  const now = Date.now();
  const arr = (rlHits.get(ip) || []).filter((tm) => now - tm < RL_WINDOW_MS);
  arr.push(now);
  rlHits.set(ip, arr);
  return arr.length > RL_MAX;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  // Vercel parses JSON bodies automatically, but guard against a raw string body.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Corps de requête invalide.' }); }
  }
  body = body || {};
  const { action, cvData, targetLang } = body;

  // BYOK: use the visitor's own Gemini key when provided (their quota), else the
  // shared server key (rate-limited). No key at all → ask them to add one.
  const userApiKey = (typeof body.userApiKey === 'string' && body.userApiKey.trim()) ? body.userApiKey.trim() : '';
  const apiKey = userApiKey || process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    return res.status(503).json({ error: "Service IA indisponible. Ajoutez votre propre clé Gemini (gratuite) dans les réglages pour activer la traduction." });
  }
  if (!userApiKey) {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    if (serverKeyRateLimited(ip)) {
      return res.status(429).json({ error: "Trop de requêtes IA. Patientez une minute, ou ajoutez votre propre clé Gemini (gratuite) pour ne plus être limité." });
    }
  }

  let prompt;
  if (action === 'analyze') prompt = buildAnalyzePrompt(cvData);
  else if (action === 'translate') prompt = buildTranslatePrompt(cvData, targetLang);
  else return res.status(400).json({ error: 'Action inconnue. Utilisez "analyze" ou "translate".' });

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(prompt);
    const data = JSON.parse(stripJsonFences(result.response.text()));
    return res.status(200).json({ result: data });
  } catch (err) {
    console.error('Gemini proxy error:', err);
    const msg = err?.message || '';
    if (/\b429\b|quota|rate.?limit|too many requests/i.test(msg)) {
      return res.status(429).json({ error: "Quota IA atteint (palier gratuit). Réessayez dans quelques minutes, ou revenez demain." });
    }
    return res.status(502).json({ error: "Le service IA a échoué : " + (msg || 'erreur inconnue') });
  }
}
