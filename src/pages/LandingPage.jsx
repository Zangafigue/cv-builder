import { useCv } from '../context/CvContext';
import { FilePlus, FileEdit, ArrowRight, Sparkles, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { parseFile } from '../utils/ImportService';
import { toast } from '../utils/toast';

const LandingPage = () => {
  const { navigate, loadExampleData, clearData, setCvData } = useCv();
  const importInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);

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
        setCvData(jsonData);
        navigate('wizard', 0);
        toast.success('CV importé avec succès !');
      } catch (error) {
        toast.error("Fichier JSON invalide. Assurez-vous qu'il s'agit d'un export CV Builder.");
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
      const importedData = await parseFile(file);
      
      // Reset state and merge high-level personal info
      clearData();
      
      // Wait for state to clear or just set fresh
      setCvData(prev => ({
        ...prev,
        personalInfo: { 
          ...prev.personalInfo, 
          ...importedData.personalInfo,
          photo: importedData.personalInfo.photo || prev.personalInfo.photo
        },
        skills: importedData.skills.length > 0 ? importedData.skills : prev.skills,
        languages: importedData.languages.length > 0 ? importedData.languages : prev.languages,
        experience: importedData.experience.length > 0 ? importedData.experience : prev.experience,
        education: importedData.education.length > 0 ? importedData.education : prev.education,
        interests: importedData.interests?.length > 0 ? importedData.interests.map(i => ({ id: crypto.randomUUID(), name: i })) : prev.interests,
        certifications: importedData.certifications?.length > 0 ? importedData.certifications.map(c => ({ id: crypto.randomUUID(), ...c })) : prev.certifications,
      }));

      toast.info('Données extraites ! Vérifiez et complétez les informations avant de continuer.');
      navigate('wizard', 0);
    } catch (error) {
      toast.error("Erreur lors de l'importation : " + error.message);
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
      e.target.value = null;
    }
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
          { value: '12+', label: 'Templates Pro' },
          { value: '100%', label: 'Gratuit' },
          { value: 'PDF', label: 'Export Haute Qualité' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>{stat.value}</div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
