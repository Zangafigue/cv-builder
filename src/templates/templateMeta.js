// Per-template capabilities. Used to gate UI (e.g. the photo upload) and exports
// so what the user can add matches what the chosen template can actually render.

// ATS templates intentionally omit photos: ATS parsers choke on images. Every
// other template (the design templates + JobLeads) renders the photo if present.
const NO_PHOTO_TEMPLATES = new Set(['ats-1', 'ats-2', 'ats-3']);

export const templateSupportsPhoto = (templateId) => !NO_PHOTO_TEMPLATES.has(templateId);
