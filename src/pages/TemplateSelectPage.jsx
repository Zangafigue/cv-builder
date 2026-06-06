import { useState } from 'react';
import { useCv } from '../context/CvContext';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { 
  CVTemplateModern, 
  CVTemplateClassic, 
  CVTemplateMinimalist, 
  CVTemplateExecutive, 
  CVTemplateCreative, 
  CVTemplateTechnical, 
  CVTemplateElegant, 
  CVTemplateModernAlt, 
  CVTemplateTimeline,
  CVTemplateATS1, 
  CVTemplateATS2, 
  CVTemplateATS3,
  CVTemplateJobLeads,
} from '../templates';
import { getMockData } from '../utils/templateMapper';
import ScaledPreview from '../components/Preview/ScaledPreview';

const COLORS = [
  { hex: '#3b82f6', name: 'Bleu' },
  { hex: '#6366f1', name: 'Indigo' },
  { hex: '#8b5cf6', name: 'Violet' },
  { hex: '#ec4899', name: 'Rose' },
  { hex: '#10b981', name: 'Émeraude' },
  { hex: '#f59e0b', name: 'Ambre' },
  { hex: '#ef4444', name: 'Rouge' },
  { hex: '#0ea5e9', name: 'Ciel' },
  { hex: '#1e293b', name: 'Ardoise' },
];

const templates = [
  { id: 'modern', name: 'Moderne', desc: 'Clean avec header centré et mise en page deux colonnes.', badge: 'Populaire', badgeColor: '#3b82f6' },
  { id: 'classic', name: 'Classique', desc: 'Sidebar sombre avec barres de compétences et timeline.', badge: 'Professionnel', badgeColor: '#1e293b' },
  { id: 'minimalist', name: 'Minimaliste', desc: 'Épuré, typographie classique, parfait pour les profils seniors.' },
  { id: 'executive', name: 'Dirigeant', desc: 'En-tête marqué, structure solide en deux colonnes denses.' },
  { id: 'creative', name: 'Créatif', desc: 'Bandeau coloré asymétrique, idéal pour le design et marketing.', badge: 'Attractif', badgeColor: '#ec4899' },
  { id: 'technical', name: 'Technique', desc: 'Design style Terminal, inspiré du code pour les développeurs.', badge: 'IT / Dev', badgeColor: '#10b981' },
  { id: 'elegant', name: 'Élégant', desc: 'Polices avec empattement, mise en page très aérée et douce.' },
  { id: 'modern-alt', name: 'Impactant', desc: 'Variante moderne avec titre pleine largeur et sidebar à droite.' },
  { id: 'timeline', name: 'Historique', desc: 'Centré sur votre évolution avec une chronologie verticale claire.' },
  { id: 'ats-1', name: 'ATS Linear', desc: 'Colonne unique, texte pur. Passe tous les parsers ATS.', badge: 'ATS', badgeColor: '#059669' },
  { id: 'ats-2', name: 'ATS Executive', desc: 'Style dirigeant sobre, typographie serif.', badge: 'ATS', badgeColor: '#059669' },
  { id: 'ats-3', name: 'ATS Tech', desc: 'Optimisé IT/Dev, section stack technique dédiée.', badge: 'ATS', badgeColor: '#059669' },
  { id: 'jobleads', name: 'JobLeads Pro', desc: 'Photo ronde, sections RESUME/EXPERIENCE/FORMATION/CONNAISSANCES/LANGUES. Format sobre inspiré du template JobLeads.', badge: 'Recommandé', badgeColor: '#0F4C75' },
];


// Mini scale-down wrapper for template thumbnail
const TemplateThumbnail = ({ templateId, selected }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        overflow: 'hidden',
        borderRadius: '0.5rem',
        position: 'relative',
        pointerEvents: 'none',
        background: '#f1f5f9',
      }}
    >
      <ScaledPreview clipHeight={300}>
        {templateId === 'modern' && <CVTemplateModern data={getMockData('modern')} />}
        {templateId === 'classic' && <CVTemplateClassic data={getMockData('classic')} />}
        {templateId === 'minimalist' && <CVTemplateMinimalist data={getMockData('minimalist')} />}
        {templateId === 'executive' && <CVTemplateExecutive data={getMockData('executive')} />}
        {templateId === 'creative' && <CVTemplateCreative data={getMockData('creative')} />}
        {templateId === 'technical' && <CVTemplateTechnical data={getMockData('technical')} />}
        {templateId === 'elegant' && <CVTemplateElegant data={getMockData('elegant')} />}
        {templateId === 'modern-alt' && <CVTemplateModernAlt data={getMockData('modern-alt')} />}
        {templateId === 'timeline' && <CVTemplateTimeline data={getMockData('timeline')} />}
        
        {/* ATS Templates with mock data */}
        {templateId === 'ats-1' && <CVTemplateATS1 data={getMockData('ats-1')} />}
        {templateId === 'ats-2' && <CVTemplateATS2 data={getMockData('ats-2')} />}
        {templateId === 'ats-3' && <CVTemplateATS3 data={getMockData('ats-3')} />}
        {templateId === 'jobleads' && <CVTemplateJobLeads data={getMockData('jobleads')} />}
      </ScaledPreview>
      {selected && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(59,130,246,0.08)',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: '0.75rem',
        }}>
          <div style={{ background: '#3b82f6', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={16} color="white" />
          </div>
        </div>
      )}
    </div>
  );
};

const TemplateSelectPage = () => {
  const { cvData, navigate, updateTemplateSettings } = useCv();
  const [selectedTemplate, setSelectedTemplate] = useState(cvData.template);
  const [selectedColor, setSelectedColor] = useState(cvData.themeColor);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    updateTemplateSettings('template', selectedTemplate);
    updateTemplateSettings('themeColor', selectedColor);
    
    // Tiny delay for visual feedback
    setTimeout(() => {
      navigate('wizard', 0);
    }, 300);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface-50)' }}>
      {/* Top bar */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: 'var(--shadow-sm)',
      }}>
        <button
          onClick={() => navigate('landing')}
          className="btn btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--primary-600)' }}>
          CV Builder Pro
        </div>
        <button
          onClick={handleConfirm}
          className={`btn ${isConfirming ? 'btn-ghost' : 'btn-primary'}`}
          disabled={isConfirming}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '180px', justifyContent: 'center' }}
        >
          {isConfirming ? 'Chargement...' : <>Utiliser ce template <ArrowRight size={16} /></>}
        </button>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.75rem' }}>
            Choisissez votre template
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.0625rem' }}>
            Vous pourrez toujours en changer plus tard depuis l'éditeur.
          </p>
        </div>

        {/* Color picker */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Couleur d'accent
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {COLORS.map(c => (
              <button
                key={c.hex}
                title={c.name}
                onClick={() => setSelectedColor(c.hex)}
                style={{
                  width: 36, height: 36,
                  borderRadius: '50%',
                  backgroundColor: c.hex,
                  border: 'none',
                  cursor: 'pointer',
                  outline: selectedColor === c.hex ? `3px solid ${c.hex}` : '2px solid transparent',
                  outlineOffset: '3px',
                  transform: selectedColor === c.hex ? 'scale(1.25)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {selectedColor === c.hex && <Check size={14} color="white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Templates grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {templates.map(t => (
            <div
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              style={{
                cursor: 'pointer',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: selectedTemplate === t.id ? `2px solid var(--primary-500)` : '2px solid transparent',
                boxShadow: selectedTemplate === t.id ? '0 0 0 4px rgba(59,130,246,0.1)' : 'var(--shadow-md)',
                transition: 'all 0.25s ease',
                background: 'white',
              }}
            >
              {/* Thumbnail */}
              <div style={{ position: 'relative' }}>
                <TemplateThumbnail templateId={t.id} selected={selectedTemplate === t.id} />
                {t.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    background: selectedColor,
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '99px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>
                    {t.badge}
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.125rem' }}>{t.name}</h3>
                  {selectedTemplate === t.id && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 600, background: 'var(--primary-50)', padding: '0.2rem 0.6rem', borderRadius: '99px' }}>
                      ✓ Sélectionné
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Confirm button bottom */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button
            onClick={handleConfirm}
            className="btn btn-primary"
            style={{ padding: '0.875rem 2.5rem', fontSize: '1rem', gap: '0.5rem', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}
          >
            Utiliser "{templates.find(t => t.id === selectedTemplate)?.name}" — Commencer
            <ArrowRight size={18} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default TemplateSelectPage;
