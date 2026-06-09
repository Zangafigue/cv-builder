export const translations = {
  FR: {
    profile: "Profil",
    experience: "Expérience Professionnelle",
    education: "Formation",
    skills: "Compétences",
    languages: "Langues",
    interests: "Loisirs",
    certifications: "Certifications",
    projects: "Projets",
    extracurricular: "Activités Extrascolaires",
    present: "Présent",
    born: "Né(e)",
    bornDateSep: "le",
    bornPlaceSep: "à"
  },
  EN: {
    profile: "Profile Summary",
    experience: "Professional Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    interests: "Interests / Hobbies",
    certifications: "Certifications",
    projects: "Projects",
    extracurricular: "Extracurricular Activities",
    present: "Present",
    born: "Born",
    bornDateSep: "on",
    bornPlaceSep: "in"
  }
};

export const getTranslation = (labelKey, lang) => {
  const language = (lang === 'EN' || lang === 'en') ? 'EN' : 'FR';
  return translations[language][labelKey] || labelKey;
};
