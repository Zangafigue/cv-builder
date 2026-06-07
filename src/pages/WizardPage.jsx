import { useState } from 'react';
import { useCv } from '../context/CvContext';
import { ArrowLeft, ArrowRight, Eye, LayoutTemplate, User, FileText, Briefcase, GraduationCap, Zap, Settings, Globe, Sparkles, Home } from 'lucide-react';
import Preview from '../components/Preview/Preview';
import ScaledPreview from '../components/Preview/ScaledPreview';
import SuggestionsCoach from '../components/Suggestions/SuggestionsCoach';

// Import step components
import StepPersonalInfo from '../components/wizard/StepPersonalInfo';
import StepSummary from '../components/wizard/StepSummary';
import StepExperience from '../components/wizard/StepExperience';
import StepEducation from '../components/wizard/StepEducation';
import StepSkills from '../components/wizard/StepSkills';
import StepLanguages from '../components/wizard/StepLanguages';
import StepInterests from '../components/wizard/StepInterests';
import StepCertifications from '../components/wizard/StepCertifications';
import StepProjects from '../components/wizard/StepProjects';
import StepExtracurricular from '../components/wizard/StepExtracurricular';
import StepCustomSection from '../components/wizard/StepCustomSection';
import StepStructure from '../components/wizard/StepStructure';

const FIXED_STEPS_START = [
  { id: 'personalInfo', label: 'Coordonnées', icon: <User size={18} /> },
  { id: 'summary', label: 'Profil', icon: <FileText size={18} /> },
];

const FIXED_STEPS_END = [
  { id: 'structure', label: 'Structure', icon: <Settings size={18} /> },
];

const SECTION_MAP = {
  experience: { label: 'Expérience', icon: <Briefcase size={18} />, component: <StepExperience /> },
  education: { label: 'Formation', icon: <GraduationCap size={18} />, component: <StepEducation /> },
  skills: { label: 'Compétences', icon: <Zap size={18} />, component: <StepSkills /> },
  languages: { label: 'Langues', icon: <Globe size={18} />, component: <StepLanguages /> },
  projects: { label: 'Projets', icon: <FileText size={18} />, component: <StepProjects /> },
  extracurricular: { label: 'Bénévolat & Extrascolaire', icon: <Sparkles size={18} />, component: <StepExtracurricular /> },
  interests: { label: 'Loisirs', icon: <Sparkles size={18} />, component: <StepInterests /> },
  certifications: { label: 'Certifications', icon: <GraduationCap size={18} />, component: <StepCertifications /> },
  customSections: { label: 'Rubriques Perso', icon: <Settings size={18} />, component: <StepCustomSection /> },
};

const WizardPage = () => {
  const { cvData, currentStep, nextStep, prevStep, navigate } = useCv();
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  const dynamicSteps = cvData.sectionsOrder
    .filter(id => SECTION_MAP[id])
    .map(id => ({ id, ...SECTION_MAP[id] }));

  const STEPS = [...FIXED_STEPS_START, ...dynamicSteps, ...FIXED_STEPS_END];
  const progress = Math.round(((currentStep + 1) / STEPS.length) * 100);

  const renderStep = () => {
    const step = STEPS[currentStep];
    if (!step) return null;
    if (step.id === 'personalInfo') return <StepPersonalInfo />;
    if (step.id === 'summary') return <StepSummary />;
    if (step.id === 'structure') return <StepStructure />;
    
    return SECTION_MAP[step.id]?.component || null;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Header bar */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.875rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        boxShadow: 'var(--shadow-sm)',
      }}>
        <button
          onClick={() => navigate('landing')}
          className="btn btn-ghost"
          style={{ padding: '0.5rem', color: 'var(--text-muted)' }}
          title="Retour à l'accueil"
          aria-label="Retour à l'accueil"
        >
          <Home size={18} />
        </button>
        <button
          onClick={() => navigate('template-select')}
          className="btn btn-ghost"
          style={{ padding: '0.5rem', color: 'var(--text-muted)' }}
          title="Changer de template"
          aria-label="Changer de template"
        >
          <LayoutTemplate size={18} />
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary-600)', fontSize: '1.0625rem', marginRight: '1rem' }}>
          CV Builder Pro
        </div>

        {/* Step pills */}
        <nav style={{ display: 'flex', gap: '0.375rem', flex: 1, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {STEPS.map((step, i) => (
            <button
              key={i}
              onClick={() => navigate('wizard', i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.375rem 0.75rem',
                borderRadius: '99px',
                fontSize: '0.8rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                backgroundColor: i === currentStep
                  ? 'var(--primary-600)'
                  : i < currentStep
                    ? 'var(--primary-50)'
                    : 'var(--surface-100)',
                color: i === currentStep
                  ? 'white'
                  : i < currentStep
                    ? 'var(--primary-700)'
                    : 'var(--text-muted)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span>{step.icon}</span>
              <span>{step.label}</span>
              {i < currentStep && <span style={{ fontSize: '0.75rem' }}>✓</span>}
            </button>
          ))}
        </nav>

        {/* Progress text */}
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {currentStep + 1} / {STEPS.length}
        </span>

        {/* Mobile preview toggle */}
        <button
          className="btn btn-secondary mobile-only-btn"
          onClick={() => setShowPreviewMobile(s => !s)}
          style={{ padding: '0.5rem 0.875rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <Eye size={15} /> {showPreviewMobile ? 'Formulaire' : 'Aperçu'}
        </button>
      </header>

      {/* Progress bar */}
      <div style={{ height: '3px', backgroundColor: 'var(--surface-200)', position: 'sticky', top: '56px', zIndex: 19 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--primary-500), var(--primary-400))', transition: 'width 0.5s ease', borderRadius: '0 99px 99px 0' }} />
      </div>

      {/* Main layout */}
      <div className="wizard-layout-container">
        {/* Left — Wizard Form */}
        <main className={`wizard-form-panel ${showPreviewMobile ? 'hide-mobile' : ''}`}>
          {/* Step label */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--primary-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.375rem' }}>
              Étape {currentStep + 1} sur {STEPS.length}
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {STEPS[currentStep]?.icon} {STEPS[currentStep]?.label}
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.375rem', fontSize: '0.9375rem' }}>
              {STEPS[currentStep]?.id === 'personalInfo' ? 'Renseignez vos informations de contact.' :
               STEPS[currentStep]?.id === 'summary' ? 'Présentez-vous en quelques phrases percutantes.' :
               STEPS[currentStep]?.id === 'experience' ? 'Ajoutez vos expériences professionnelles.' :
               STEPS[currentStep]?.id === 'education' ? 'Listez vos diplômes et formations.' :
               STEPS[currentStep]?.id === 'skills' ? 'Indiquez vos compétences opérationnelles.' :
               STEPS[currentStep]?.id === 'languages' ? 'Précisez les langues que vous maîtrisez.' :
               STEPS[currentStep]?.id === 'structure' ? 'Modifiez l\'ordre d\'apparition des sections.' :
               'Complétez cette section de votre CV.'}
            </p>
          </div>

          {/* Active Step Component */}
          <div className="animate-fade-in">
            {renderStep()}
          </div>

          {/* Live, content-aware suggestions */}
          <SuggestionsCoach />

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-color)',
          }}>
            <button
              onClick={prevStep}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
            >
              <ArrowLeft size={16} /> Retour
            </button>
            <button
              onClick={() => nextStep(STEPS.length)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', fontSize: '0.9375rem' }}
            >
              {currentStep < STEPS.length - 1 ? 'Enregistrer et continuer' : 'Finalisez votre CV'}
              <ArrowRight size={16} />
            </button>
          </div>
        </main>

        {/* Right — Live Preview */}
        <aside className={`wizard-preview-sidebar ${showPreviewMobile ? 'show-mobile' : ''}`}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            Aperçu en direct
          </p>
          {/* Scale CV preview to fit the sidebar width (no magic numbers) */}
          <ScaledPreview style={{ pointerEvents: 'none' }}>
            <Preview />
          </ScaledPreview>
        </aside>
      </div>
    </div>
  );
};

export default WizardPage;
