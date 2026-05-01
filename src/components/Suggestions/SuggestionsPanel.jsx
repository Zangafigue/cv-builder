import { useState } from 'react';
import { ChevronDown, Lightbulb, X, Plus } from 'lucide-react';
import suggestionsData from '../../data/suggestions.json';

const SuggestionsPanel = ({ field, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(suggestionsData.categories[0].id);

  const currentCat = suggestionsData.categories.find(c => c.id === selectedCategory);
  const fieldSuggestions = currentCat?.suggestions[field] || [];

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost"
        style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: 'var(--primary-500)', display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--primary-100)', borderRadius: 'var(--radius-md)' }}
      >
        <Lightbulb size={12} />
        Suggestions
        <ChevronDown size={12} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 100,
            width: '380px',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)',
            padding: '1rem',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Suggestions par métier</p>
            <button onClick={() => setIsOpen(false)} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
              <X size={16} />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
            {suggestionsData.categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '0.25rem 0.625rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  backgroundColor: selectedCategory === cat.id ? 'var(--primary-100)' : 'var(--surface-100)',
                  color: selectedCategory === cat.id ? 'var(--primary-700)' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Suggestion list */}
          <div className="flex flex-col gap-2">
            {fieldSuggestions.length > 0 ? (
              fieldSuggestions.map((text, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-50)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    color: 'var(--text-main)',
                    border: '1px solid transparent',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-300)'; e.currentTarget.style.backgroundColor = 'var(--primary-50)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.backgroundColor = 'var(--surface-50)'; }}
                  onClick={() => { onSelect(text); setIsOpen(false); }}
                >
                  <Plus size={14} style={{ color: 'var(--primary-500)', flexShrink: 0, marginTop: '2px' }} />
                  {text}
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>
                Pas de suggestions pour cette catégorie et ce champ.
              </p>
            )}
          </div>
          
          {/* Skills quick-add (only for skills field) */}
          {field === 'skills' && currentCat?.suggestions?.skills && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Compétences populaires du secteur</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {currentCat.suggestions.skills.map((skill, i) => (
                  <button
                    key={i}
                    onClick={() => onSelect(skill)}
                    style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      backgroundColor: 'var(--surface-100)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--primary-50)'; e.currentTarget.style.color = 'var(--primary-600)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--surface-100)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SuggestionsPanel;
