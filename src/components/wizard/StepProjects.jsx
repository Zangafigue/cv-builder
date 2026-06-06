import React, { useState } from 'react';
import { useCv } from '../../context/CvContext';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import SuggestionsPanel from '../Suggestions/SuggestionsPanel';

const StepProjects = () => {
  const { cvData, addItem, updateItem, removeItem } = useCv();
  const { projects = [] } = cvData;
  const [expandedId, setExpandedId] = useState(null);

  const handleAdd = () => {
    const newId = uuidv4();
    addItem('projects', {
      id: newId,
      title: '',
      type: '', // e.g. Projet Académique, Projet Personnel
      description: '',
      bullets: []
    });
    setExpandedId(newId);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDescriptionChange = (id, text) => {
    const bullets = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^- /, ''));
    updateItem('projects', id, { description: text, bullets });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem' }}>Projets Réalisés</h2>
        <button className="btn btn-secondary" onClick={handleAdd} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--surface-50)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
          Aucun projet ajouté. Cliquez sur "Ajouter" pour commencer.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="card" style={{ padding: '1rem' }}>
              {/* Header */}
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => toggleExpand(proj.id)}
              >
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>
                    {proj.title || '(Projet sans titre)'}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {proj.type || 'Type de projet'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="btn btn-ghost hover-danger" 
                    onClick={(e) => { e.stopPropagation(); removeItem('projects', proj.id); }}
                    style={{ padding: '0.5rem', color: 'var(--danger)' }}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                    {expandedId === proj.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Form Body */}
              {expandedId === proj.id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Titre du projet</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={proj.title}
                        onChange={(e) => updateItem('projects', proj.id, { title: e.target.value })}
                        placeholder="ex: AgroConnectBF" 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Type de projet</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={proj.type}
                        onChange={(e) => updateItem('projects', proj.id, { type: e.target.value })}
                        placeholder="ex: Projet Personnel / Académique" 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label mt-2" style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center' }}>
                      <span>Détails / Réalisations (un par ligne)</span>
                      <SuggestionsPanel 
                        field="experience" 
                        onSelect={(text) => handleDescriptionChange(proj.id, proj.description ? proj.description + '\n- ' + text : '- ' + text)} 
                      />
                    </label>
                    <textarea 
                      className="form-textarea" 
                      value={proj.description}
                      onChange={(e) => handleDescriptionChange(proj.id, e.target.value)}
                      placeholder="- Développement frontend avec React 19&#10;- Déploiement automatisé sur Vercel..." 
                      style={{ minHeight: '100px' }}
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

export default StepProjects;
