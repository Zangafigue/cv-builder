import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CvContext = createContext();

const initialCvData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    birthDate: '',
    birthPlace: '',
    nationality: '',
    linkedin: '',
    website: '',
    summary: '',
    photo: '', // Cropped/Final photo
    originalPhoto: '', // Source photo for re-cropping
    photoSettings: {
      shape: 'round',
      filter: 'none',
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: 1,
    }
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  interests: [],
  certifications: [],
  sectionsOrder: ['experience', 'education', 'skills', 'languages'],
  template: 'modern',
  themeColor: '#3b82f6',
  typography: {
    fontFamily: 'Inter',
    fontSize: 'medium',
  },
};

// Pages: 'landing' | 'template-select' | 'wizard' | 'final'
export const CvProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('cv-builder-page') || 'landing';
  });
  
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('cv-builder-step');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [cvData, setCvData] = useState(() => {
    const saved = localStorage.getItem('cv-builder-data-v2');
    return saved ? JSON.parse(saved) : initialCvData;
  });

  useEffect(() => {
    localStorage.setItem('cv-builder-page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('cv-builder-step', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('cv-builder-data-v2', JSON.stringify(cvData));
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
      navigate('template-select');
    }
  };

  const updatePersonalInfo = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addItem = (field, item) => {
    setCvData(prev => ({
      ...prev,
      [field]: [...prev[field], { id: uuidv4(), ...item }],
    }));
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
      sectionsOrder: ['experience', 'education', 'skills', 'languages', 'interests', 'certifications'],
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
    setCurrentPage('landing');
    setCurrentStep(0);
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
