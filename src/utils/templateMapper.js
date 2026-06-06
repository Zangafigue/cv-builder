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
export const mapCvDataToTemplate = (cvData, targetTemplate = '') => {
  const { 
    personalInfo, 
    experience = [], 
    education = [], 
    skills = [], 
    languages = [], 
    interests = [], 
    certifications = [],
    projects = [],
    extracurricular = [],
    customSections = [],
    themeColor,
    typography,
    sectionsOrder
  } = cvData;

  // Option C: Adapt skills format for BIT template
  let mappedSkills = [];
  if (targetTemplate === 'bit') {
    // Group skills by level (Option A logic)
    const grouped = {};
    skills.forEach(s => {
      const groupKey = s.level || 'Compétences';
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(s.name);
    });
    mappedSkills = Object.keys(grouped).map(key => ({
      label: key,
      value: grouped[key].join(', ')
    }));
  } else {
    // Standard format for other templates
    mappedSkills = skills.map(s => ({ name: s.name, level: s.level, showLevel: s.showLevel }));
  }

  // Helper to split text description into bullet points
  const mapDescriptionToBullets = (desc) => {
    if (!desc) return [];
    return desc.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^- /, ''));
  };

  return {
    name: personalInfo.fullName,
    title: personalInfo.jobTitle,
    address: personalInfo.location,
    phone: personalInfo.phone,
    email: personalInfo.email,
    birthdate: personalInfo.birthDate,
    birthplace: personalInfo.birthPlace || '',
    nationality: personalInfo.nationality || '',
    photo: personalInfo.photo || null,
    photoSettings: personalInfo.photoSettings || { shape: 'round', filter: 'none' },
    linkedin: personalInfo.linkedin || '',
    website: personalInfo.website || '',
    github: personalInfo.linkedin || personalInfo.website || '', // backward compat
    summary: personalInfo.summary,
    
    // Add raw properties for backward/migrated templates compatibility
    personalInfo,
    themeColor,
    typography,
    sectionsOrder,
    language: cvData.language || 'FR',
    
    skills: mappedSkills,
    
    experience: experience.map(exp => ({
      period: `${exp.startDate} - ${exp.current ? (cvData.language === 'EN' ? 'Present' : 'Présent') : exp.endDate}`,
      title: exp.position,
      company: exp.company,
      org: exp.company, // for BIT template
      location: exp.location || '',
      description: exp.description,
      bullets: mapDescriptionToBullets(exp.description) // for BIT template
    })),
    
    education: education.map(edu => ({
      period: `${edu.startDate} - ${edu.current ? (cvData.language === 'EN' ? 'Present' : 'Présent') : edu.endDate}`,
      degree: edu.degree,
      school: edu.school,
      location: edu.location || '',
      description: edu.description,
      note: edu.description // for BIT template
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
    
    interests: interests ? interests.map(i => i.name || i) : [],
    
    projects: projects.map(proj => ({
      title: proj.title,
      type: proj.type || '',
      bullets: Array.isArray(proj.bullets) ? proj.bullets : mapDescriptionToBullets(proj.description)
    })),
    
    extracurricular: extracurricular.map(item => typeof item === 'string' ? item : (item.name || item.description || '')),
    
    customSections: customSections.map(cs => ({
      name: cs.name,
      content: cs.content
    }))
  };
};

export const getMockData = (templateId = '') => {
  const rawMock = {
    personalInfo: {
      fullName: "ALEX MARTIN",
      jobTitle: "Développeur Full Stack Senior",
      email: "alex.martin@example.com",
      phone: "+33 6 00 00 00 00",
      location: "Paris, France",
      birthDate: "1993-04-20",
      linkedin: "linkedin.com/in/alex-martin",
      website: "github.com/alex-martin",
      summary: "Développeur passionné avec 6 ans d'expérience en création d'applications web scalables. Expertise en React et Node.js, orienté résultats et solutions innovantes.",
    },
    experience: [
      {
        id: "exp1",
        position: "Lead Développeur Full Stack",
        company: "TechCorp Solutions",
        startDate: "2021-01",
        endDate: "",
        current: true,
        description: "- Architecture et développement de la plateforme SaaS\n- Réduction du temps de chargement de 40% via refonte API\n- Mentorat de 4 développeurs juniors"
      },
      {
        id: "exp2",
        position: "Développeur Frontend",
        company: "WebAgence Studio",
        startDate: "2019-03",
        endDate: "2020-12",
        current: false,
        description: "- Développement d'interfaces React pour des clients PME\n- Intégration maquettes pixel-perfect"
      }
    ],
    education: [
      {
        id: "edu1",
        degree: "Master Informatique",
        school: "Université Paris Saclay",
        startDate: "2016-09",
        endDate: "2019-07",
        current: false,
        description: "Spécialisation Génie Logiciel — Mention Bien"
      }
    ],
    skills: [
      { id: "sk1", name: "React / Next.js", level: "Expert", showLevel: true },
      { id: "sk2", name: "Node.js / Express", level: "Avancé", showLevel: true },
      { id: "sk3", name: "TypeScript", level: "Expert", showLevel: true },
      { id: "sk4", name: "PostgreSQL / MongoDB", level: "Avancé", showLevel: true },
      { id: "sk5", name: "Docker / CI-CD", level: "Intermédiaire", showLevel: true },
    ],
    languages: [
      { id: "l1", name: "Français", level: "Natif", showLevel: true },
      { id: "l2", name: "Anglais", level: "Courant (C1)", showLevel: true }
    ],
    interests: [
      { id: "int1", name: "Open Source" },
      { id: "int2", name: "Veille technologique" },
      { id: "int3", name: "Photographie" }
    ],
    certifications: [
      { id: "c1", name: "AWS Certified Developer", date: "2022", org: "Amazon Web Services" }
    ],
    projects: [
      {
        id: "p1",
        title: "E-Commerce Microservices",
        type: "Projet Personnel",
        bullets: [
          "Conception et mise en œuvre d'une architecture microservices hautement disponible",
          "Mise en place de passerelles d'API résilientes et sécurisées"
        ]
      }
    ],
    extracurricular: [
      "Bénévole et contributeur actif à des projets open-source"
    ],
    customSections: [],
    sectionsOrder: ['experience', 'education', 'skills', 'languages', 'projects', 'extracurricular'],
    themeColor: '#3b82f6',
    typography: { fontFamily: 'Inter', fontSize: 'medium' }
  };

  return mapCvDataToTemplate(rawMock, templateId);
};
