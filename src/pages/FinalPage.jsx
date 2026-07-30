import { useRef, useState } from 'react';
import { useCv } from '../context/CvContext';
import {
  Download, Printer, ArrowLeft, LayoutTemplate, Palette, Check,
  ChevronDown, ChevronUp, Type, FileJson, FileText, Languages,
  Loader, GripVertical, Plus, Sparkles, Share2
} from 'lucide-react';
import Preview from '../components/Preview/Preview';
import ScaledPreview from '../components/Preview/ScaledPreview';
import { printCvDocument } from '../utils/printCv';
import { shareApp } from '../utils/share';
import { getGeminiKey, setGeminiKey } from '../utils/aiKey';
import { translateCvData } from '../utils/geminiService';
import { toast } from '../utils/toast';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, sortableKeyboardCoordinates, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ─── Constants ───────────────────────────────────────────────────────────────

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
  { id: 'academic', label: 'Académique ✓' },
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

const SECTION_LABELS = {
  experience: 'Expérience Professionnelle',
  education: 'Formation',
  skills: 'Compétences',
  languages: 'Langues',
  projects: 'Projets',
  extracurricular: 'Activités Extrascolaires',
  certifications: 'Certifications',
  interests: 'Loisirs',
  customSections: 'Sections Perso.',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Panel = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
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

// Drag & Drop sortable section row
const SortableSectionRow = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.85 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        marginBottom: '0.375rem',
        backgroundColor: isDragging ? 'var(--primary-50)' : 'var(--surface-50)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.8rem',
        color: 'var(--surface-700)',
        cursor: 'grab',
      }}
    >
      <div {...attributes} {...listeners} style={{ touchAction: 'none', color: 'var(--text-muted)', display: 'flex' }}>
        <GripVertical size={14} />
      </div>
      <span style={{ flex: 1 }}>{SECTION_LABELS[id] || id}</span>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const FinalPage = () => {
  const { cvData, navigate, updateTemplateSettings, setCvData } = useCv();
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedData, setTranslatedData] = useState(null); // non-null = preview in translated mode
  const [aiKey, setAiKey] = useState(() => getGeminiKey()); // BYOK Gemini key
  const previewRef = useRef(null);

  // Drag & drop sensors for section reordering
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const sectionsOrder = cvData.sectionsOrder || [
    'experience', 'education', 'skills', 'languages', 'projects', 'extracurricular', 'certifications', 'interests', 'customSections',
  ];

  const handleSectionDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionsOrder.indexOf(active.id);
      const newIndex = sectionsOrder.indexOf(over.id);
      updateTemplateSettings('sectionsOrder', arrayMove(sectionsOrder, oldIndex, newIndex));
    }
  };

  // ── Exports ─────────────────────────────────────────────────────────────────

  const printCv = () => {
    const element = previewRef.current?.querySelector('.cv-document');
    if (!element) {
      toast.error('Aperçu introuvable. Réessayez après le chargement du CV.');
      return;
    }
    printCvDocument(element, {
      filename: `CV_${cvData.personalInfo.fullName || 'Mon_CV'}`,
      container: previewRef.current,
    });
  };

  // "Télécharger PDF" → native print dialog → "Enregistrer en PDF" yields a real,
  // text-based (ATS-readable) PDF, unlike the previous html2canvas raster export.
  const handleExportPdf = () => {
    setIsExporting(true);
    try {
      printCv();
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
      // Lazy-loaded so the docx library stays out of the main bundle.
      const { exportToDocx } = await import('../utils/exportDocx');
      await exportToDocx(translatedData || cvData);
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'export Word : " + e.message);
    }
    setIsExportingDocx(false);
  };

  const handlePrint = () => printCv();

  const handleExportJson = () => {
    const dataStr = JSON.stringify(cvData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const filename = `cv_data_${(cvData.personalInfo.fullName || 'export').replace(/\s+/g, '_')}.json`;
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', filename);
    link.click();
  };

  // ── Translation ─────────────────────────────────────────────────────────────

  const handleTranslate = async (targetLang) => {
    setIsTranslating(true);
    try {
      const translated = await translateCvData(cvData, targetLang);
      setTranslatedData(translated);
    } catch (e) {
      console.error(e);
      toast.error('Erreur de traduction : ' + e.message);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleApplyTranslation = () => {
    if (translatedData) {
      setCvData({
        ...translatedData,
        template: cvData.template,
        themeColor: cvData.themeColor,
        typography: cvData.typography,
        sectionsOrder: cvData.sectionsOrder,
      });
      setTranslatedData(null);
    }
  };

  // The data shown in the preview and used for exports
  const previewData = translatedData 
    ? {
        ...translatedData,
        template: cvData.template,
        themeColor: cvData.themeColor,
        typography: cvData.typography,
        sectionsOrder: cvData.sectionsOrder,
      }
    : cvData;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface-50)' }}>
      {/* Header */}
      <header className="final-header" style={{
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
        <div className="final-header-title">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--surface-800)', textAlign: 'center' }}>
            Finalisez votre CV
          </h1>
        </div>
        <div className="final-header-buttons" style={{ display: 'flex', gap: '0.625rem' }}>
          <button onClick={handlePrint} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Printer size={16} /> Imprimer
          </button>
          <button onClick={handleExportPdf} className="btn btn-primary" disabled={isExporting} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isExporting ? 0.7 : 1 }}>
            <Download size={16} /> {isExporting ? 'Export...' : 'Télécharger PDF'}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="final-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', maxWidth: '1300px', margin: '0 auto', padding: '2rem', gap: '2rem' }}>
        {/* CV Preview Center */}
        <div
          ref={previewRef}
          className="final-preview-box"
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
          <ScaledPreview>
            <Preview overrideData={previewData} />
          </ScaledPreview>
        </div>

        {/* Right Side Options */}
        <aside className="final-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Export quick actions */}
          <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--surface-700)', marginBottom: '0.25rem' }}>Exporter le CV</p>
            <button onClick={handleExportPdf} className="btn btn-primary" disabled={isExporting} style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}>
              <Download size={16} /> {isExporting ? 'Génération...' : 'Télécharger (PDF)'}
            </button>
            <button onClick={handleExportDocx} className="btn btn-secondary" disabled={isExportingDocx} style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}>
              <FileText size={16} /> {isExportingDocx ? 'Génération...' : 'Télécharger (Word .docx)'}
            </button>
            <button onClick={handleExportJson} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'var(--surface-100)', color: 'var(--surface-700)', borderColor: 'var(--surface-300)' }}>
              <FileJson size={16} /> Exporter Données (JSON)
            </button>
            <button onClick={handlePrint} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}>
              <Printer size={16} /> Imprimer
            </button>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '0.25rem' }}>
              Le PDF s'ouvre via la boîte d'impression : choisissez « Enregistrer en PDF » comme destination. Le texte reste sélectionnable et lisible par les ATS.
            </p>
          </div>

          {/* Share the platform */}
          <button onClick={shareApp} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}>
            <Share2 size={16} /> Partager la plateforme
          </button>

          {/* Translation via Gemini */}
          <Panel title="Traduction IA (Gemini)" icon={<Languages size={16} />} defaultOpen={false}>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '0.25rem' }}>
                Traduisez automatiquement votre CV en anglais ou en français grâce à Gemini.
              </p>

              {/* BYOK: optional personal Gemini key (uses the visitor's own free quota) */}
              <div style={{ backgroundColor: 'var(--surface-50)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.625rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label htmlFor="gemini-key" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--surface-700)' }}>Ta clé Gemini (optionnel, gratuite)</label>
                <input
                  id="gemini-key"
                  type="password"
                  value={aiKey}
                  onChange={(e) => { setAiKey(e.target.value); setGeminiKey(e.target.value); }}
                  placeholder="AIza…"
                  autoComplete="off"
                  style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-300)', backgroundColor: 'white' }}
                />
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
                  Sans clé, la traduction partage un quota limité. Avec ta propre clé, tu utilises ton quota gratuit (stockée uniquement sur cet appareil).{' '}
                  <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>Obtenir une clé →</a>
                </p>
              </div>

              {translatedData && (
                <div style={{
                  backgroundColor: 'var(--primary-50)',
                  border: '1px solid var(--primary-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  fontSize: '0.8rem',
                  color: 'var(--primary-700)',
                  marginBottom: '0.25rem',
                }}>
                  <strong>Aperçu traduit actif.</strong> Cliquez sur "Appliquer" pour sauvegarder définitivement, ou "Annuler" pour revenir à l'original.
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button className="btn btn-primary" onClick={handleApplyTranslation} style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '0.375rem 0.5rem', gap: '0.25rem' }}>
                      <Check size={13} /> Appliquer
                    </button>
                    <button className="btn btn-ghost" onClick={() => setTranslatedData(null)} style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '0.375rem 0.5rem' }}>
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleTranslate('EN')}
                  disabled={isTranslating}
                  style={{ justifyContent: 'center', gap: '0.375rem', fontSize: '0.8rem' }}
                >
                  {isTranslating
                    ? <Loader size={14} className="animate-spin" />
                    : <Languages size={14} />}
                  🇬🇧 EN
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleTranslate('FR')}
                  disabled={isTranslating}
                  style={{ justifyContent: 'center', gap: '0.375rem', fontSize: '0.8rem' }}
                >
                  {isTranslating
                    ? <Loader size={14} className="animate-spin" />
                    : <Languages size={14} />}
                  🇫🇷 FR
                </button>
              </div>
            </div>
          </Panel>

          {/* Section reordering D&D */}
          <Panel title="Ordre des sections" icon={<GripVertical size={16} />} defaultOpen={false}>
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Glissez-déposez pour réorganiser les sections dans le CV.
              </p>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
                <SortableContext items={sectionsOrder} strategy={verticalListSortingStrategy}>
                  {sectionsOrder.map(id => (
                    <SortableSectionRow key={id} id={id} />
                  ))}
                </SortableContext>
              </DndContext>
              {sectionsOrder.length === 0 && (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <Sparkles size={20} style={{ marginBottom: '0.5rem', opacity: 0.4 }} /><br />
                  Aucune section active. Ajoutez-en via l'étape Structure du wizard.
                </div>
              )}
            </div>
          </Panel>

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

          {/* Typography */}
          <Panel title="Typographie" icon={<Type size={16} />} defaultOpen={false}>
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

      {/* Translation loading overlay */}
      {isTranslating && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 999, gap: '1rem',
        }}>
          <Loader size={32} color="#60a5fa" className="animate-spin" />
          <p style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700 }}>
            Traduction en cours…
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Gemini traduit votre CV, veuillez patienter.</p>
        </div>
      )}
    </div>
  );
};

export default FinalPage;
