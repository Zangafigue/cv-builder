import { useRef, useState } from 'react';
import { useCv } from '../context/CvContext';
import { Download, Printer, ArrowLeft, LayoutTemplate, Palette, Check, ChevronDown, ChevronUp, Type, FileJson } from 'lucide-react';
import Preview from '../components/Preview/Preview';

const COLORS = [
  { hex: '#1e293b', name: 'Ardoise' },
  { hex: '#3b82f6', name: 'Bleu Royal' },
  { hex: '#0f172a', name: 'Marine' },
  { hex: '#059669', name: 'Vert Forêt' },
  { hex: '#dc2626', name: 'Rouge Bourgogne' },
  { hex: '#7c3aed', name: 'Violet Profond' },
  { hex: '#ea580c', name: 'Orange Brûlé' },
  { hex: '#854d0e', name: 'Or Antique' },
];

const TEMPLATES = [
  { id: 'modern', label: 'Moderne' },
  { id: 'classic', label: 'Classique' },
  { id: 'minimalist', label: 'Minimaliste' },
  { id: 'executive', label: 'Dirigeant' },
  { id: 'creative', label: 'Créatif' },
  { id: 'technical', label: 'Technique' },
  { id: 'elegant', label: 'Élégant' },
  { id: 'modern-alt', label: 'Impactant' },
  { id: 'timeline', label: 'Historique' },
  { id: 'ats-1', label: 'ATS Linear ✓' },
  { id: 'ats-2', label: 'ATS Executive ✓' },
  { id: 'ats-3', label: 'ATS Tech ✓' },
  { id: 'jobleads', label: 'JobLeads Pro ✓' },
];

const FONTS = [
  { id: 'Inter', label: 'Inter (Moderne)' },
  { id: 'Merriweather', label: 'Merriweather (Classique)' },
  { id: 'Roboto Mono', label: 'Roboto Mono (Tech)' },
  { id: '"Playfair Display"', label: 'Playfair (Élégant)' },
];

const FONT_SIZES = [
  { id: 'small', label: 'Petit' },
  { id: 'medium', label: 'Normal' },
  { id: 'large', label: 'Grand' },
];

const LINE_HEIGHTS = [
  { id: 'compact', label: 'Compact' },
  { id: 'normal', label: 'Normal' },
  { id: 'relaxed', label: 'Aéré' },
];

const Panel = ({ title, icon, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', overflow: 'hidden', backgroundColor: 'white' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--surface-700)' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>{icon} {title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border-color)' }}>
          {children}
        </div>
      )}
    </div>
  );
};

const FinalPage = () => {
  const { cvData, navigate, updateTemplateSettings } = useCv();
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef(null);

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = previewRef.current?.querySelector('.cv-document');
      if (!element) { setIsExporting(false); return; }
      const opt = {
        margin: 0,
        filename: `CV_${cvData.personalInfo.fullName || 'Mon_CV'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        enableLinks: true
      };
      await html2pdf().set(opt).from(element).save();
    } catch (e) { console.error(e); }
    setIsExporting(false);
  };

  const handlePrint = () => window.print();

  const handleExportJson = () => {
    const dataStr = JSON.stringify(cvData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `cv_data_${cvData.personalInfo.fullName ? cvData.personalInfo.fullName.replace(/\s+/g, '_') : 'export'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface-50)' }}>
      {/* Header */}
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
        <button onClick={() => navigate('wizard', 4)} className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Retour à l'édition
        </button>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--surface-800)', textAlign: 'center' }}>
            Finalisez votre CV
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button onClick={handlePrint} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Printer size={16} /> Imprimer
          </button>
          <button onClick={handleExportPdf} className="btn btn-primary" disabled={isExporting} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isExporting ? 0.7 : 1 }}>
            <Download size={16} /> {isExporting ? 'Export...' : 'Télécharger PDF'}
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', maxWidth: '1300px', margin: '0 auto', padding: '2rem', gap: '2rem' }}>
        {/* CV Preview Center */}
        <div
          ref={previewRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#d1d5db',
            borderRadius: 'var(--radius-2xl)',
            backgroundImage: 'radial-gradient(circle at 1px 1px, #9ca3af 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        >
          <Preview />
        </div>

        {/* Right Side Options */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Download quick actions */}
          <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--surface-700)', marginBottom: '0.25rem' }}>Exporter le CV</p>
            <button onClick={handleExportPdf} className="btn btn-primary" disabled={isExporting} style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}>
              <Download size={16} /> {isExporting ? 'Génération...' : 'Télécharger (PDF)'}
            </button>
            <button onClick={handleExportJson} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'var(--surface-100)', color: 'var(--surface-700)', borderColor: 'var(--surface-300)' }}>
              <FileJson size={16} /> Exporter Données (JSON)
            </button>
            <button onClick={handlePrint} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}>
              <Printer size={16} /> Imprimer
            </button>
          </div>

          {/* Models & Colors */}
          <Panel title="Modèles & Couleurs" icon={<Palette size={16} />}>
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Template</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => updateTemplateSettings('template', t.id)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)',
                      cursor: 'pointer', width: '100%', textAlign: 'left',
                      fontWeight: cvData.template === t.id ? 600 : 400,
                      backgroundColor: cvData.template === t.id ? 'var(--primary-50)' : 'var(--surface-50)',
                      color: cvData.template === t.id ? 'var(--primary-700)' : 'var(--text-main)',
                      border: cvData.template === t.id ? '1px solid var(--primary-200)' : '1px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <LayoutTemplate size={14} /> {t.label}
                    </div>
                    {cvData.template === t.id && <Check size={14} />}
                  </button>
                ))}
              </div>

              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Couleur</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {COLORS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => updateTemplateSettings('themeColor', c.hex)}
                    title={c.name}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', backgroundColor: c.hex,
                      border: 'none', cursor: 'pointer',
                      outline: cvData.themeColor === c.hex ? `2px solid ${c.hex}` : 'none',
                      outlineOffset: '2px',
                      transform: cvData.themeColor === c.hex ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--surface-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <input 
                  type="color" 
                  value={cvData.themeColor} 
                  onChange={e => updateTemplateSettings('themeColor', e.target.value)}
                  style={{ width: '32px', height: '32px', padding: 0, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--surface-600)' }}>Couleur personnalisée</span>
              </div>
            </div>
          </Panel>

          {/* Typography options */}
          <Panel title="Typographie" icon={<Type size={16} />}>
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Police Globale</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {FONTS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => updateTemplateSettings('typography', { ...cvData.typography, fontFamily: f.id })}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)',
                      cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: f.id,
                      fontWeight: cvData.typography?.fontFamily === f.id ? 600 : 400,
                      backgroundColor: cvData.typography?.fontFamily === f.id ? 'var(--primary-50)' : 'var(--surface-50)',
                      color: cvData.typography?.fontFamily === f.id ? 'var(--primary-700)' : 'var(--text-main)',
                      border: cvData.typography?.fontFamily === f.id ? '1px solid var(--primary-200)' : '1px solid transparent',
                    }}
                  >
                    {f.label}
                    {cvData.typography?.fontFamily === f.id && <Check size={14} />}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Taille</p>
                  <select 
                    value={cvData.typography?.fontSize || 'medium'} 
                    onChange={e => updateTemplateSettings('typography', { ...cvData.typography, fontSize: e.target.value })}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-300)', backgroundColor: 'var(--surface-50)', color: 'var(--text-main)', fontSize: '0.875rem' }}
                  >
                    {FONT_SIZES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interligne</p>
                  <select 
                    value={cvData.typography?.lineHeight || 'normal'} 
                    onChange={e => updateTemplateSettings('typography', { ...cvData.typography, lineHeight: e.target.value })}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-300)', backgroundColor: 'var(--surface-50)', color: 'var(--text-main)', fontSize: '0.875rem' }}
                  >
                    {LINE_HEIGHTS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </Panel>

          {/* Back to wizard */}
          <button
            onClick={() => navigate('wizard', 0)}
            className="btn btn-ghost"
            style={{ width: '100%', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--surface-300)', padding: '0.875rem', color: 'var(--text-muted)', justifyContent: 'center' }}
          >
            ← Modifier le contenu
          </button>
        </aside>
      </div>
    </div>
  );
};

export default FinalPage;
