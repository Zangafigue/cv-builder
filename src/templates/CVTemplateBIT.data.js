// ── Données par défaut — CV Mathias au format BIT ─────────────────────────

export const defaultData = {
  name: "ZANGAFIGUE MATHIAS TRAORE",
  phone: "+226 07 58 02 39",
  email: "mathiaszangafigue@gmail.com",
  github: "github.com/Zangafigue",
  address: "Koudougou, Burkina Faso",

  summary:
    "Second-year Computer Science student (Programming & Entrepreneurship) at the Burkina " +
    "Institute of Technology (BIT). Web and mobile developer building products with React, " +
    "Flutter and Python/Node.js. Recently completed a developer internship at WoeLab/HubCity " +
    "in Lomé, contributing to the audit, documentation and MVP consolidation of SCoPE. " +
    "Interested in applied AI, cybersecurity and product entrepreneurship.",

  education: [
    {
      degree: "Bachelor's Degree in Computer Science – Programming & Entrepreneurship",
      school: "Burkina Institute of Technology (BIT) · Koudougou, Burkina Faso",
      period: "Oct. 2024 – Present",
      note: "Coursework: Software Development, OOP, Databases, Systems Architecture, Entrepreneurship",
    },
    {
      degree: "Baccalauréat D – Science Series",
      school: "Lycée Privé Eben Ezer 2 · Bobo Dioulasso, Burkina Faso",
      period: "Sept. 2023 – June 2024",
    },
  ],

  projects: [
    {
      title: "GymX v2 – Elite Gym Management Platform",
      type: "Personal Project",
      bullets: [
        "Full-stack web platform with secure authentication, RBAC (Members/Admins), real-time class bookings, analytics dashboard, and i18n (EN/FR).",
        "Tools: React 19, TypeScript, Tailwind CSS v4, Supabase (PostgreSQL + Auth + RLS), Framer Motion, Vite.",
        "Contribution: sole developer — architecture, UI design, backend, deployment.",
      ],
    },
    {
      title: "AgroConnectBF – Agricultural Web/Mobile Platform",
      type: "Group Project (Team of 5)",
      bullets: [
        "Platform connecting farmers, buyers, and transporters in Burkina Faso with GPS tracking.",
        "Tools: Node.js/Express/MongoDB Atlas (backend), React 18 + TypeScript + Leaflet (web), Flutter/Dart + Google Maps (mobile).",
        "Contribution: Lead Developer — system architecture, team coordination, API design, Railway deployment.",
      ],
    },
    {
      title: "GroupGenerator · E-Suggestion Box · Portfolio (Three.js)",
      type: "Personal & Academic Projects",
      bullets: [
        "GroupGenerator: live web tool hosted online, open source MIT — HTML/CSS/JS.",
        "E-Suggestion Box: full-stack student idea platform — Python/Flask + JavaScript (team of 5).",
        "Portfolio: interactive 3D portfolio under development — React + Three.js.",
      ],
    },
  ],

  skills: [
    { label: "Languages",   value: "JavaScript, TypeScript, Python, Dart, HTML5, CSS3, C, Java (learning)" },
    { label: "Frameworks",  value: "React 18/19, Node.js/Express, Flutter, Vue.js, Tailwind CSS, Flask" },
    { label: "Databases",   value: "Supabase/PostgreSQL, MongoDB Atlas, MySQL" },
    { label: "Tools",       value: "Git, GitHub, Vite, Swagger, Postman, VS Code, Figma" },
    { label: "Soft skills", value: "Team leadership, Project management, Autonomy, Problem-solving" },
  ],

  experience: [
    {
      title: "Web & Mobile Developer Intern – WoeLab / HubCity Africa",
      org: "AIESEC Global Talent · Lomé, Togo",
      period: "Aug. 2026 – Sept. 26, 2026",
      bullets: [
        "Audited and documented three SCoPE codebases: Flutter web, Flutter mobile and NestJS backend.",
        "Contributed to the administration dashboard, MVP consolidation, testing, Git workflows and technical handoff.",
      ],
    },
    {
      title: "Lead Developer – AgroConnectBF",
      org: "BIT Academic Project · Koudougou, Burkina Faso",
      period: "March 2026 – Present",
      bullets: [
        "Designed the full technical architecture across 3 repositories (backend, web, mobile).",
        "Coordinated a 5-member team: sprint planning, code reviews, task assignment.",
        "Delivered core features: JWT/OTP authentication, REST API with Swagger docs, real-time GPS mobile app.",
      ],
    },
  ],

  extracurricular: [
    "Class Delegate (CS27, Group 14) – BIT, 2024–Present: liaison between students and academic administration.",
    "Competitor – Hackathon des Grandes Écoles (HGE 2026): Lead Dev on Valence, an educational chemistry mobile game (Flutter + Django).",
    "Huawei ICT Competition – National Stage (Network Track): achieved a perfect score on 60-question mock exam.",
  ],

  certifications: [
    { name: "Introduction to Model Context Protocol", org: "Anthropic Education", date: "Apr. 2026" },
    { name: "AI Fluency for Students",               org: "Anthropic Education", date: "Apr. 2026" },
    { name: "Foundations of Project Management",     org: "Google Career Certificates", date: "Aug. 2025" },
    { name: "Project Initiation: Starting a Successful Project", org: "Google", date: "Sept. 2025" },
  ],
};
