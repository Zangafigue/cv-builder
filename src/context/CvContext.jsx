import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '../utils/toast';
import { initialCvData } from './initialCvData';

const CvContext = createContext();

// Hash routing helpers
const getHashFromState = (page, step) => {
  return page === 'wizard' ? `#wizard/${step}` : `#${page}`;
};

const parseStateFromHash = (hash) => {
  if (!hash || hash === '#' || hash === '#landing') {
    return { page: 'landing', step: 0 };
  }
  if (hash === '#template-select') {
    return { page: 'template-select', step: 0 };
  }
  if (hash.startsWith('#wizard/')) {
    const step = parseInt(hash.split('/')[1], 10);
    return { page: 'wizard', step: isNaN(step) ? 0 : step };
  }
  if (hash === '#final') {
    return { page: 'final', step: 0 };
  }
  return { page: 'landing', step: 0 };
};

// Pages: 'landing' | 'template-select' | 'wizard' | 'final'
export const CvProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return parseStateFromHash(window.location.hash).page;
    }
    return localStorage.getItem('cv-builder-page') || 'landing';
  });
  
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return parseStateFromHash(window.location.hash).step;
    }
    const saved = localStorage.getItem('cv-builder-step');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [cvData, setCvData] = useState(() => {
    const saved = localStorage.getItem('cv-builder-data-v2');
    return saved ? JSON.parse(saved) : initialCvData;
  });

  // Listen to hash change (back/forward browser buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const { page, step } = parseStateFromHash(window.location.hash);
      setCurrentPage(page);
      setCurrentStep(step);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when page/step changes
  useEffect(() => {
    const currentHash = window.location.hash;
    const targetHash = getHashFromState(currentPage, currentStep);
    if (currentHash !== targetHash) {
      window.location.hash = targetHash;
    }
  }, [currentPage, currentStep]);

  useEffect(() => {
    localStorage.setItem('cv-builder-page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('cv-builder-step', currentStep.toString());
  }, [currentStep]);

  // Persist CV data — debounced so we don't serialize the whole document
  // (including the base64 photo) on every keystroke, and guarded against the
  // localStorage quota so a failure surfaces instead of silently losing data.
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem('cv-builder-data-v2', JSON.stringify(cvData));
      } catch (e) {
        console.warn('Persist failed:', e);
        if (e?.name === 'QuotaExceededError' || /quota/i.test(e?.message || '')) {
          toast.warning("Sauvegarde locale pleine : réduisez la taille de la photo ou allégez le contenu pour éviter de perdre des données.");
        }
      }
    }, 400);
    return () => clearTimeout(id);
  }, [cvData]);

  const navigate = (page, step = 0) => {
    setCurrentPage(page);
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const nextStep = (maxSteps = 7) => {
    if (currentStep < maxSteps - 1) {
      setCurrentStep(s => s + 1);
      window.scrollTo(0, 0);
    } else {
      navigate('final');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
      window.scrollTo(0, 0);
    } else {
      navigate('landing');
    }
  };

  const updatePersonalInfo = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addItem = (field, item) => {
    setCvData(prev => {
      const existingList = prev[field] || [];
      const newItem = { id: item.id || uuidv4(), ...item };
      return {
        ...prev,
        [field]: [...existingList, newItem],
      };
    });
  };

  const updateItem = (field, id, updatedItem) => {
    setCvData(prev => ({
      ...prev,
      [field]: prev[field].map(item => (item.id === id ? { ...item, ...updatedItem } : item)),
    }));
  };

  const removeItem = (field, id) => {
    setCvData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item.id !== id),
    }));
  };

  const updateTemplateSettings = (field, value) => {
    setCvData(prev => ({ ...prev, [field]: value }));
  };

  const loadExampleData = () => {
    setCvData({
      personalInfo: {
        fullName: 'Jean Dupont',
        jobTitle: 'Développeur Full Stack Senior',
        email: 'jean.dupont@email.com',
        phone: '+33 6 12 34 56 78',
        location: 'Paris, France',
        birthDate: '1993-05-15',
        linkedin: 'linkedin.com/in/jeandupont',
        website: 'jeandupont.dev',
        summary: 'Développeur passionné avec 5 ans d\'expérience dans la création d\'applications web scalables. Expertise forte en React et Node.js. Orienté résultats et toujours en quête de solutions innovantes.',
      },
      experience: [
        {
          id: uuidv4(),
          company: 'TechCorp Industries',
          position: 'Développeur Full Stack Senior',
          startDate: '2020-01',
          endDate: '',
          current: true,
          description: '- Architecture et développement de la nouvelle plateforme SaaS\n- Réduction du temps de chargement de 40% grâce à une refonte de l\'API\n- Mentorat de 3 développeurs juniors',
        },
        {
          id: uuidv4(),
          company: 'WebSolutions Agence',
          position: 'Développeur Frontend',
          startDate: '2018-03',
          endDate: '2019-12',
          current: false,
          description: '- Création de sites e-commerce sur mesure pour des PME\n- Intégration de maquettes pixel-perfect avec React et Redux',
        }
      ],
      education: [
        {
          id: uuidv4(),
          school: 'Université de Technologie de Troyes (UTT)',
          degree: 'Diplôme d\'Ingénieur',
          field: 'Informatique et Systèmes d\'Information',
          startDate: '2013-09',
          endDate: '2018-07',
          current: false,
          description: 'Spécialisation en génie logiciel.',
        }
      ],
      skills: [
        { id: uuidv4(), name: 'React', level: 'Expert', showLevel: true },
        { id: uuidv4(), name: 'Node.js', level: 'Avancé', showLevel: true },
        { id: uuidv4(), name: 'TypeScript', level: 'Expert', showLevel: true },
        { id: uuidv4(), name: 'CSS / Tailwind', level: 'Expert', showLevel: true },
      ],
      languages: [
        { id: uuidv4(), name: 'Français', level: 'Natif / Bilingue', showLevel: true },
        { id: uuidv4(), name: 'Anglais', level: 'Courant', showLevel: true },
      ],
      interests: [
        { id: uuidv4(), name: 'Photographie' },
        { id: uuidv4(), name: 'Randonnée' },
      ],
      certifications: [
        { id: uuidv4(), name: 'AWS Certified Developer', date: '2022', org: 'Amazon Web Services' },
      ],
      projects: [
        {
          id: uuidv4(),
          title: 'CV Builder Pro',
          type: 'Projet Personnel',
          bullets: [
            'Conception et développement d\'une application web de création de CV',
            'Intégration de l\'API Gemini pour l\'analyse de contenu et suggestions',
            'Export PDF pixel-perfect et génération de documents Word (.docx)'
          ]
        }
      ],
      extracurricular: [
        {
          id: uuidv4(),
          name: 'Bénévole — Croix-Rouge Française (2022 - Présent) : Secourisme et aide logistique lors de manifestations locales'
        }
      ],
      customSections: [
        {
          id: uuidv4(),
          name: 'Publications',
          content: '• Dupont J., "L\'avenir du développement Full Stack", Tech Journal, 2024.'
        }
      ],
      sectionsOrder: ['experience', 'education', 'skills', 'languages', 'projects', 'extracurricular', 'certifications', 'interests', 'customSections'],
      template: 'modern',
      themeColor: '#3b82f6',
      typography: {
        fontFamily: 'Inter',
        fontSize: 'medium',
        lineHeight: 'normal',
      },
    });
  };

  const clearData = () => {
    setCvData(initialCvData);
    navigate('landing');
    localStorage.removeItem('cv-builder-page');
    localStorage.removeItem('cv-builder-step');
    localStorage.removeItem('cv-builder-data-v2');
  };

  return (
    <CvContext.Provider value={{
      cvData,
      currentPage,
      currentStep,
      navigate,
      nextStep,
      prevStep,
      updatePersonalInfo,
      addItem,
      updateItem,
      removeItem,
      updateTemplateSettings,
      loadExampleData,
      clearData,
      setCvData,
    }}>
      {children}
    </CvContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCv = () => {
  const context = useContext(CvContext);
  if (!context) throw new Error('useCv must be used within CvProvider');
  return context;
};
