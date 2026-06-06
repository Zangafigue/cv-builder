import React, { useState } from 'react';
import { Check, X, Sparkles, ChevronRight, HelpCircle, ArrowRight, BookOpen, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const SuggestionsReviewModal = ({ isOpen, onClose, importedData, suggestions, onConfirm }) => {
  const [currentCvData, setCurrentCvData] = useState(importedData);
  const [reviewedBullets, setReviewedBullets] = useState({}); // { index: 'accepted' | 'rejected' }
  const [reviewedKeywords, setReviewedKeywords] = useState({}); // { index: 'accepted' | 'rejected' }

  // Reset the review state each time the modal transitions to open — done during
  // render (React-recommended) rather than in an effect, to avoid a cascading render.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setCurrentCvData(importedData);
      setReviewedBullets({});
      setReviewedKeywords({});
    }
  }

  if (!isOpen) return null;

  const bulletImprovements = suggestions?.bulletImprovements || [];
  const missingKeywords = suggestions?.missingKeywords || [];
  const structuralSuggestions = suggestions?.structural || [];

  const handleAcceptBullet = (index, imp) => {
    setReviewedBullets(prev => ({ ...prev, [index]: 'accepted' }));
    
    setCurrentCvData(prev => {
      const { section, itemId, original, suggested } = imp;
      const list = prev[section] || [];
      const updatedList = list.map(item => {
        if (item.id === itemId) {
          if (section === 'experience') {
            const desc = item.description || '';
            if (desc.includes(original)) {
              return { ...item, description: desc.replace(original, suggested) };
            }
            const lines = desc.split('\n');
            const idx = lines.findIndex(l => l.includes(original) || original.includes(l));
            if (idx !== -1) {
              lines[idx] = suggested;
              return { ...item, description: lines.join('\n') };
            }
            // Fallback: append
            return { ...item, description: desc + '\n' + suggested };
          }
          if (section === 'projects') {
            const bullets = item.bullets || [];
            const idx = bullets.indexOf(original);
            if (idx !== -1) {
              const newBullets = [...bullets];
              newBullets[idx] = suggested;
              return { ...item, bullets: newBullets };
            }
            const idx2 = bullets.findIndex(b => b.includes(original) || original.includes(b));
            if (idx2 !== -1) {
              const newBullets = [...bullets];
              newBullets[idx2] = suggested;
              return { ...item, bullets: newBullets };
            }
            return { ...item, bullets: [...bullets, suggested] };
          }
        }
        return item;
      });
      return { ...prev, [section]: updatedList };
    });
  };

  const handleRejectBullet = (index) => {
    setReviewedBullets(prev => ({ ...prev, [index]: 'rejected' }));
  };

  const handleAcceptKeyword = (index, kwObj) => {
    setReviewedKeywords(prev => ({ ...prev, [index]: 'accepted' }));
    setCurrentCvData(prev => {
      const exists = prev.skills.some(s => s.name.toLowerCase() === kwObj.keyword.toLowerCase());
      if (exists) return prev;
      return {
        ...prev,
        skills: [...prev.skills, { id: uuidv4(), name: kwObj.keyword, level: 'Avancé', showLevel: false }]
      };
    });
  };

  const handleRejectKeyword = (index) => {
    setReviewedKeywords(prev => ({ ...prev, [index]: 'rejected' }));
  };

  const handleSaveAndClose = () => {
    onConfirm(currentCvData);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem',
      animation: 'fade-in 0.3s ease',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-2xl)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-600) 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '0.5rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'white' }}>Suggestions de l'IA Gemini</h2>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '0.25rem 0 0 0' }}>
              Optimisez la formulation de vos compétences et expériences avant d'accéder au wizard.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div style={{
          padding: '2rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          backgroundColor: 'var(--surface-50)',
        }}>
          
          {/* Section 1: Bullet Point improvements */}
          {bulletImprovements.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--surface-800)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <BookOpen size={18} color="var(--primary-600)" />
                Formulation des réalisations ({bulletImprovements.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bulletImprovements.map((imp, idx) => {
                  const status = reviewedBullets[idx];
                  return (
                    <div key={idx} style={{
                      backgroundColor: 'white',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      opacity: status === 'rejected' ? 0.6 : 1,
                      transition: 'all 0.3s ease',
                      boxShadow: 'var(--shadow-sm)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--primary-600)',
                          backgroundColor: 'var(--primary-50)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                        }}>
                          {imp.section === 'experience' ? 'Expérience' : 'Projet'}
                        </span>
                        
                        {/* Status badge */}
                        {status && (
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: status === 'accepted' ? 'var(--success)' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}>
                            {status === 'accepted' ? <Check size={14} /> : <X size={14} />}
                            {status === 'accepted' ? 'Accepté' : 'Ignoré'}
                          </span>
                        )}
                      </div>

                      {/* Side by side comparison */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        gap: '1rem',
                        marginTop: '0.5rem',
                      }}>
                        <div style={{ backgroundColor: 'var(--surface-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--text-muted)', borderLeft: '3px solid var(--surface-300)' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>D'origine</div>
                          {imp.original}
                        </div>
                        <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
                        <div style={{ backgroundColor: 'var(--primary-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--primary-900)', borderLeft: '3px solid var(--primary-500)', fontWeight: 500 }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--primary-600)', marginBottom: '0.25rem' }}>Recommandé</div>
                          {imp.suggested}
                        </div>
                      </div>

                      {/* Explanation */}
                      {imp.explanation && (
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', alignItems: 'flex-start', marginTop: '0.25rem' }}>
                          <HelpCircle size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary-500)' }} />
                          <span>{imp.explanation}</span>
                        </div>
                      )}

                      {/* Actions */}
                      {!status && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <button
                            className="btn btn-ghost hover-danger"
                            onClick={() => handleRejectBullet(idx)}
                            style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}
                          >
                            <X size={14} style={{ marginRight: '0.25rem' }} /> Ignorer
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAcceptBullet(idx, imp)}
                            style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem', gap: '0.25rem' }}
                          >
                            <Check size={14} /> Appliquer
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Missing Keywords / Skills */}
          {missingKeywords.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--surface-800)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sparkles size={18} color="var(--primary-600)" />
                Mots-clés / Compétences suggérés ({missingKeywords.length})
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1rem',
              }}>
                {missingKeywords.map((kwObj, idx) => {
                  const status = reviewedKeywords[idx];
                  return (
                    <div key={idx} style={{
                      backgroundColor: 'white',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      opacity: status === 'rejected' ? 0.6 : 1,
                      boxShadow: 'var(--shadow-sm)',
                    }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <strong style={{ fontSize: '0.95rem', color: 'var(--surface-900)' }}>{kwObj.keyword}</strong>
                          {status && (
                            <span style={{ fontSize: '0.75rem', color: status === 'accepted' ? 'var(--success)' : 'var(--text-muted)' }}>
                              {status === 'accepted' ? 'Ajouté' : 'Ignoré'}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0 0 1rem 0' }}>
                          {kwObj.explanation}
                        </p>
                      </div>

                      {!status && (
                        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-ghost hover-danger"
                            onClick={() => handleRejectKeyword(idx)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            <X size={12} />
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleAcceptKeyword(idx, kwObj)}
                            style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', gap: '0.25rem' }}
                          >
                            <Plus size={12} /> Ajouter
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Structural Advice */}
          {structuralSuggestions.length > 0 && (
            <div style={{
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', marginTop: 0 }}>
                <Sparkles size={18} color="var(--primary-600)" />
                Conseils de structure & mise en page
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {structuralSuggestions.map((item, idx) => (
                  <div key={idx} style={{ fontSize: '0.875rem', color: 'var(--primary-950)', lineHeight: '1.5' }}>
                    <strong>💡 {item.suggestion}</strong> : {item.explanation}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{
          padding: '1.25rem 2rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
          <button
            className="btn btn-primary"
            onClick={handleSaveAndClose}
            style={{
              padding: '0.75rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600,
            }}
          >
            Appliquer les suggestions & continuer <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsReviewModal;
