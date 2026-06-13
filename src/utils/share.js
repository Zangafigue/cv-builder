import { toast } from './toast';

const SHARE_TEXT = 'Crée un CV pro gratuitement en quelques minutes 🚀';

// Feedback collection. Set this to your Google Form / Tally URL to collect
// structured feedback; while empty, the button falls back to a prefilled email.
export const FEEDBACK_URL = 'https://tally.so/r/rjqrG2';
const FEEDBACK_EMAIL = 'mathiastraore08@gmail.com';

// Shares the platform link via the native share sheet (WhatsApp, status, …) on
// mobile, with a desktop fallback that copies the link (or opens WhatsApp web).
export async function shareApp() {
  const url = window.location.origin;
  const payload = { title: 'CV Builder Pro', text: SHARE_TEXT, url };

  if (navigator.share) {
    try {
      await navigator.share(payload);
    } catch {
      /* user cancelled the share sheet — ignore */
    }
    return;
  }

  // Desktop fallback: copy the link, else open WhatsApp web.
  const full = `${SHARE_TEXT} ${url}`;
  try {
    await navigator.clipboard.writeText(full);
    toast.success('Lien copié ! Collez-le dans WhatsApp ou vos statuts.');
  } catch {
    window.open(`https://wa.me/?text=${encodeURIComponent(full)}`, '_blank', 'noopener');
  }
}

// Opens the feedback form, or a prefilled email while no form URL is configured.
export function openFeedback() {
  if (FEEDBACK_URL) {
    window.open(FEEDBACK_URL, '_blank', 'noopener');
    return;
  }
  const subject = encodeURIComponent('Avis sur CV Builder Pro');
  const body = encodeURIComponent('Mon avis / ma suggestion :\n\n');
  window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
}
