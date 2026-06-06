import React, { useState } from 'react';
import { useCv } from '../../context/CvContext';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const StepCustomSection = () => {
  const { cvData, addItem, updateItem, removeItem } = useCv();
  const { customSections = [] } = cvData;
  const [expandedId, setExpandedId] = useState(null);

  const handleAdd = () => {
    const newId = uuidv4();
    addItem('customSections', {
      id: newId,
      name: '',
      content: ''
    });
    setExpandedId(newId);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem' }}>Rubriques Personnalisées</h2>
        <button className="btn btn-secondary" onClick={handleAdd} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
          <Plus size={16} /> Ajouter une rubrique
        </button>
      </div>

      {customSections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--surface-50)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
          Aucune rubrique personnalisée. Cliquez sur "Ajouter" pour en créer une (ex: Publications, Distinctions).
        </div>
      ) : (
        <div className="flex flex-col gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {customSections.map((sec) => (
            <div key={sec.id} className="card" style={{ padding: '1rem' }}>
              {/* Header */}
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => toggleExpand(sec.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>
                    {sec.name || '(Rubrique sans nom)'}
                  </h3>
                </div>
                <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-ghost hover-danger" 
                    onClick={(e) => { e.stopPropagation(); removeItem('customSections', sec.id); }}
                    style={{ padding: '0.5rem', color: 'var(--danger)' }}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                    {expandedId === sec.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Form Body */}
              {expandedId === sec.id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Nom de la rubrique</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={sec.name}
                      onChange={(e) => updateItem('customSections', sec.id, { name: e.target.value })}
                      placeholder="ex: Publications / Distinctions / Certificats de bénévolat" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contenu de la rubrique</label>
                    <textarea 
                      className="form-textarea" 
                      value={sec.content}
                      onChange={(e) => updateItem('customSections', sec.id, { content: e.target.value })}
                      placeholder="Saisissez le contenu de cette rubrique..." 
                      style={{ minHeight: '120px' }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepCustomSection;
