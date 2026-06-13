import { useCv } from '../context/CvContext';
import { initialCvData } from '../context/initialCvData';
import { FilePlus, FileEdit, ArrowRight, Sparkles, Upload, Loader, Share2, MessageSquare } from 'lucide-react';
import { shareApp, openFeedback } from '../utils/share';
import { useRef, useState } from 'react';
import { toast } from '../utils/toast';
import { analyzeCvData } from '../utils/geminiService';
import SuggestionsReviewModal from '../components/Suggestions/SuggestionsReviewModal';

const LandingPage = () => {
  const { navigate, loadExampleData, clearData, setCvData } = useCv();
  const importInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [pendingImportData, setPendingImportData] = useState(null);
  const [geminiSuggestions, setGeminiSuggestions] = useState(null);

  const handleCreateDesignFirst = () => {
    clearData();
    navigate('template-select');
  };

  const handleCreateContentFirst = () => {
    clearData();
    navigate('wizard', 0);
  };

  const handleModify = () => {
    // Check if we have real saved data or not, if not load example to show the feature
    const saved = localStorage.getItem('cv-builder-data-v2');
    if (!saved) {
      loadExampleData();
    }
    navigate('wizard', 0);
  };

  const handleImportJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        if (!jsonData || typeof jsonData !== 'object') {
          throw new Error("Le fichier n'est pas un objet JSON valide.");
        }
        if (!jsonData.personalInfo) {
          throw new Error("Le fichier ne contient pas la section obligatoire 'personalInfo'.");
        }

        const mergedData = {
          ...initialCvData,
          ...jsonData,
          personalInfo: {
            ...initialCvData.personalInfo,
            ...(jsonData.personalInfo || {})
          },
          experience: Array.isArray(jsonData.experience) ? jsonData.experience : [],
          education: Array.isArray(jsonData.education) ? jsonData.education : [],
          skills: Array.isArray(jsonData.skills) ? jsonData.skills : [],
          languages: Array.isArray(jsonData.languages) ? jsonData.languages : [],
          interests: Array.isArray(jsonData.interests) ? jsonData.interests : [],
          certifications: Array.isArray(jsonData.certifications) ? jsonData.certifications : [],
          projects: Array.isArray(jsonData.projects) ? jsonData.projects : [],
          extracurricular: Array.isArray(jsonData.extracurricular) ? jsonData.extracurricular : [],
          customSections: Array.isArray(jsonData.customSections) ? jsonData.customSections : [],
        };

        setCvData(mergedData);
        navigate('wizard', 0);
        toast.success('CV importé avec succès !');
      } catch (error) {
        toast.error("Fichier JSON invalide. " + error.message);
        console.error("Erreur d'importation:", error);
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImporting(true);
    try {
      // Lazy-loaded so pdfjs/mammoth (~1 MB each) stay out of the main bundle.
      const { parseFile } = await import('../utils/ImportService');
      const importedData = await parseFile(file);

      // Build the merged CV data object from parsed content
      const mergedData = {
        ...initialCvData,
        personalInfo: {
          ...initialCvData.personalInfo,
          ...importedData.personalInfo,
        },
        skills: importedData.skills?.length > 0 ? importedData.skills : [],
        languages: importedData.languages?.length > 0 ? importedData.languages : [],
        experience: importedData.experience?.length > 0 ? importedData.experience : [],
        education: importedData.education?.length > 0 ? importedData.education : [],
        interests: importedData.interests?.length > 0
          ? importedData.interests.map(i => ({ id: crypto.randomUUID(), name: typeof i === 'string' ? i : i.name }))
          : [],
        certifications: importedData.certifications?.length > 0
          ? importedData.certifications.map(c => ({ id: crypto.randomUUID(), ...c }))
          : [],
        projects: [],
        extracurricular: [],
        customSections: [],
      };

      setPendingImportData(mergedData);

      // Try AI analysis via the serverless proxy. If the service is unavailable
      // (not configured, offline, rate-limited…), the catch falls back to a
      // direct import — the AI step is a non-blocking enhancement.
      setIsImporting(false);
      setIsAnalyzing(true);
      try {
        const suggestions = await analyzeCvData(mergedData);
        setGeminiSuggestions(suggestions);
        setShowSuggestionsModal(true);
      } catch (geminiErr) {
        console.warn('AI analysis unavailable, skipping suggestions:', geminiErr);
        toast.info('Analyse IA non disponible. Données importées directement.');
        applyImportedData(mergedData);
      } finally {
        setIsAnalyzing(false);
      }
    } catch (error) {
      toast.error("Erreur lors de l'importation : " + error.message);
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
      e.target.value = null;
    }
  };

  const applyImportedData = (data) => {
    clearData();
    setCvData(data);
    toast.success('CV importé avec succès ! Vérifiez et complétez les informations.');
    navigate('wizard', 0);
  };

  const handleSuggestionsConfirm = (finalData) => {
    applyImportedData(finalData);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorations */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* Logo / Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem', zIndex: 1, marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', padding: '0.75rem', borderRadius: '1rem', display: 'flex' }}>
            <Sparkles size={28} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'white' }}>CV Builder Pro</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
          fontWeight: 800,
          color: 'white',
          lineHeight: 1.1,
          maxWidth: '800px',
          marginBottom: '1.25rem',
        }}>
          Créez un CV qui fait la{' '}
          <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            différence
          </span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Des templates professionnels, des suggestions intelligentes et un éditeur intuitif pour décrocher l'emploi de vos rêves. Comment souhaitez-vous commencer ?
        </p>
      </div>

      {/* Cards - 3 Options Layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem', 
        width: '100%', 
        maxWidth: '1000px', 
        zIndex: 1 
      }}>
        
        {/* Card 1: Create - Design First */}
        <button
          onClick={handleCreateDesignFirst}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1.25rem',
            padding: '2rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(59,130,246,0.15)';
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FilePlus size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
              Choisir un modèle d'abord
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Sélectionnez le design qui vous plaît parmi nos 9 templates professionnels avant d'ajouter votre contenu.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontSize: '0.875rem', fontWeight: 600, marginTop: 'auto' }}>
            Voir les modèles <ArrowRight size={16} />
          </div>
        </button>

        {/* Card 2: Create - Content First */}
        <button
          onClick={handleCreateContentFirst}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1.25rem',
            padding: '2rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.15)';
            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileEdit size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
              Remplir le contenu d'abord
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Saisissez directement vos expériences et compétences. Vous choisirez l'apparence à la toute fin.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontSize: '0.875rem', fontWeight: 600, marginTop: 'auto' }}>
            Aller au formulaire <ArrowRight size={16} />
          </div>
        </button>

        {/* Card 3: Modify / Resume */}
        <button
          onClick={handleModify}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1.25rem',
            padding: '2rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(16,185,129,0.15)';
            e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
              Modifier un CV existant
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Reprenez vos données sauvegardées. Si vous n'en avez pas, nous chargerons un CV d'exemple pour tester.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.875rem', fontWeight: 600, marginTop: 'auto' }}>
            Continuer <ArrowRight size={16} />
          </div>
        </button>

        {/* Card 4: Import JSON / PDF / DOCX */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => importInputRef.current?.click()}
            disabled={isImporting}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px dashed rgba(255,255,255,0.3)',
              borderRadius: '1.25rem',
              padding: '2rem',
              cursor: isImporting ? 'wait' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              opacity: isImporting ? 0.7 : 1,
            }}
            onMouseEnter={e => {
              if (isImporting) return;
              e.currentTarget.style.background = 'rgba(245,158,11,0.15)';
              e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              if (isImporting) return;
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <input 
              type="file" 
              accept=".json,.pdf,.docx" 
              style={{ display: 'none' }} 
              ref={importInputRef}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file?.name.endsWith('.json')) {
                  handleImportJson(e);
                } else {
                  handleImportFile(e);
                }
              }}
            />
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={24} color="white" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
                Importer un CV existant
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Lancez-vous avec vos données ! Importez un export JSON, un PDF ou un document Word (.docx).
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '0.875rem', fontWeight: 600, marginTop: 'auto' }}>
              {isImporting ? 'Analyse en cours...' : <>Importer un fichier <ArrowRight size={16} /></>}
            </div>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        marginTop: '4rem',
        display: 'flex',
        gap: '3rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        zIndex: 1,
      }}>
        {[
          { value: '13+', label: 'Templates Pro' },
          { value: '100%', label: 'Gratuit' },
          { value: 'PDF', label: 'Export Haute Qualité' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>{stat.value}</div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Share & feedback */}
      <div style={{ marginTop: '2.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', zIndex: 1 }}>
        <button
          onClick={shareApp}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: '99px', fontSize: '0.875rem', fontWeight: 600, color: 'white', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
        >
          <Share2 size={16} /> Partager
        </button>
        <button
          onClick={openFeedback}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: '99px', fontSize: '0.875rem', fontWeight: 600, color: '#cbd5e1', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer' }}
        >
          <MessageSquare size={16} /> Donner mon avis
        </button>
      </div>

      {/* Gemini Analysis Loading Overlay */}
      {isAnalyzing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          gap: '1.5rem',
        }}>
          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', padding: '1.25rem', borderRadius: '1.5rem', display: 'flex' }}>
            <Sparkles size={36} color="white" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <Loader size={20} color="#60a5fa" className="animate-spin" />
              <span style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>Analyse IA en cours…</span>
            </div>
            <p style={{ color: '#94a3b8', maxWidth: '400px' }}>Gemini analyse votre CV et prépare des suggestions personnalisées pour améliorer la formulation et les mots-clés.</p>
          </div>
        </div>
      )}

      {/* Gemini Suggestions Review Modal */}
      <SuggestionsReviewModal
        isOpen={showSuggestionsModal}
        onClose={() => {
          setShowSuggestionsModal(false);
          if (pendingImportData) applyImportedData(pendingImportData);
        }}
        importedData={pendingImportData}
        suggestions={geminiSuggestions}
        onConfirm={handleSuggestionsConfirm}
      />
    </div>
  );
};

export default LandingPage;
