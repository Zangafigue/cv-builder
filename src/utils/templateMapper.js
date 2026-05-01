/**
 * Maps the application's cvData structure to the structure expected by the user's templates.
 * 
 * App structure: 
 * personalInfo: { fullName, jobTitle, email, phone, location, birthDate, linkedin, website, summary }
 * experience: [ { id, company, position, startDate, endDate, current, description } ]
 * education: [ { id, school, degree, field, startDate, endDate, current, description } ]
 * skills: [ { id, name, level } ]
 * languages: [ { id, name, level } ]
 * 
 * Template structure:
 * name, title, address, phone, email, birthdate, nationality, photo, github, summary
 * skills: [ string ]
 * experience: [ { period, title, company, location, description } ]
 * education: [ { period, degree, school, location, description } ]
 * certifications: [ { name, date, org } ]
 * languages: [ { name, level } ]
 * interests: [ string ]
 */
export const mapCvDataToTemplate = (cvData) => {
  const { personalInfo, experience, education, skills, languages, interests, certifications = [] } = cvData;

  return {
    name: personalInfo.fullName,
    title: personalInfo.jobTitle,
    address: personalInfo.location,
    phone: personalInfo.phone,
    email: personalInfo.email,
    birthdate: personalInfo.birthDate,
    birthplace: personalInfo.birthPlace || '',
    nationality: personalInfo.nationality || '', // Might need to add this to personalInfo wizard
    photo: personalInfo.photo || null,
    photoSettings: personalInfo.photoSettings || { shape: 'round', filter: 'none' },
    linkedin: personalInfo.linkedin || '',
    website: personalInfo.website || '',
    // Keep github as alias for backward compat with ATS templates
    github: personalInfo.linkedin || personalInfo.website || '',
    summary: personalInfo.summary,
    skills: skills.map(s => ({ name: s.name, level: s.level, showLevel: s.showLevel })),
    experience: experience.map(exp => ({
      period: `${exp.startDate} - ${exp.current ? 'Présent' : exp.endDate}`,
      title: exp.position,
      company: exp.company,
      location: exp.location || '',
      description: exp.description
    })),
    education: education.map(edu => ({
      period: `${edu.startDate} - ${edu.current ? 'Présent' : edu.endDate}`,
      degree: edu.degree,
      school: edu.school,
      location: edu.location || '',
      description: edu.description
    })),
    certifications: certifications.map(c => ({
      name: c.name,
      date: c.date,
      org: c.org
    })),
    languages: languages.map(l => ({
      name: l.name,
      level: l.level,
      showLevel: l.showLevel
    })),
    interests: interests ? interests.map(i => i.name || i) : []
  };
};

export const getMockData = () => {
  return {
    name: "ALEX MARTIN",
    title: "Développeur Full Stack Senior",
    address: "Paris, France",
    phone: "+33 6 00 00 00 00",
    email: "alex.martin@example.com",
    birthdate: "1993-04-20",
    nationality: "Français",
    photo: null,
    linkedin: "linkedin.com/in/alex-martin",
    github: "linkedin.com/in/alex-martin",
    summary: "Développeur passionné avec 6 ans d'expérience en création d'applications web scalables. Expertise en React et Node.js, orienté résultats et solutions innovantes.",
    skills: [
      { name: "React / Next.js", level: "Expert", showLevel: true },
      { name: "Node.js / Express", level: "Avancé", showLevel: true },
      { name: "TypeScript", level: "Expert", showLevel: true },
      { name: "PostgreSQL / MongoDB", level: "Avancé", showLevel: true },
      { name: "Docker / CI-CD", level: "Intermédiaire", showLevel: true },
    ],
    experience: [
      {
        period: "2021-01 - Présent",
        title: "Lead Développeur Full Stack",
        company: "TechCorp Solutions",
        location: "Paris",
        description: "- Architecture et développement de la plateforme SaaS\n- Réduction du temps de chargement de 40% via refonte API\n- Mentorat de 4 développeurs juniors"
      },
      {
        period: "2019-03 - 2020-12",
        title: "Développeur Frontend",
        company: "WebAgence Studio",
        location: "Lyon",
        description: "- Développement d'interfaces React pour des clients PME\n- Intégration maquettes pixel-perfect"
      }
    ],
    education: [
      {
        period: "2016-09 - 2019-07",
        degree: "Master Informatique",
        school: "Université Paris Saclay",
        location: "Paris",
        description: "Spécialisation Génie Logiciel — Mention Bien"
      }
    ],
    certifications: [
      { name: "AWS Certified Developer", date: "2022", org: "Amazon Web Services" }
    ],
    languages: [
      { name: "Français", level: "Natif" },
      { name: "Anglais", level: "Courant (C1)" }
    ],
    interests: ["Open Source", "Veille technologique", "Photographie"]
  };
};
