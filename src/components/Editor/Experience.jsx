import { useState } from 'react';
import { useCv } from '../../context/CvContext';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import SuggestionsPanel from '../Suggestions/SuggestionsPanel';
import { v4 as uuidv4 } from 'uuid';

const Experience = () => {
  const { cvData, addItem, updateItem, removeItem } = useCv();
  const { experience } = cvData;
  const [expandedId, setExpandedId] = useState(null);

  const handleAdd = () => {
    const newId = uuidv4();
    addItem('experience', {
      id: newId,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
    setExpandedId(newId);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem' }}>Expériences Professionnelles</h2>
        <button className="btn btn-secondary" onClick={handleAdd} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {experience.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--surface-50)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
          Aucune expérience ajoutée. Cliquez sur "Ajouter" pour commencer.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {experience.map((exp) => (
            <div key={exp.id} className="card" style={{ padding: '1rem' }}>
              {/* Header (Always visible) */}
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => toggleExpand(exp.id)}
              >
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>
                    {exp.position || '(Titre du poste)'}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {exp.company || 'Entreprise'} • {exp.startDate || 'Début'} - {exp.current ? 'Présent' : (exp.endDate || 'Fin')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="btn btn-ghost" 
                    onClick={(e) => { e.stopPropagation(); removeItem('experience', exp.id); }}
                    style={{ padding: '0.5rem', color: 'var(--danger)' }}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                    {expandedId === exp.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Form Body (Collapsible) */}
              {expandedId === exp.id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <div className="form-group">
                    <label className="form-label">Titre du poste</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={exp.position}
                      onChange={(e) => updateItem('experience', exp.id, { position: e.target.value })}
                      placeholder="ex: Développeur Web" 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Entreprise / Organisation</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={exp.company}
                      onChange={(e) => updateItem('experience', exp.id, { company: e.target.value })}
                      placeholder="ex: Tech Solutions" 
                    />
                  </div>
                  
                  <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Date de début</label>
                      <input 
                        type="month" 
                        className="form-input" 
                        value={exp.startDate}
                        onChange={(e) => updateItem('experience', exp.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label flex items-center justify-between">
                        <span>Date de fin</span>
                        <div className="flex items-center gap-1" style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>
                          <input 
                            type="checkbox" 
                            checked={exp.current}
                            onChange={(e) => updateItem('experience', exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
                            id={`current-${exp.id}`}
                          />
                          <label htmlFor={`current-${exp.id}`}>En cours</label>
                        </div>
                      </label>
                      <input 
                        type="month" 
                        className="form-input" 
                        value={exp.endDate}
                        onChange={(e) => updateItem('experience', exp.id, { endDate: e.target.value })}
                        disabled={exp.current}
                        style={{ opacity: exp.current ? 0.5 : 1 }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label mt-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Description des tâches &amp; réalisations</span>
                      <SuggestionsPanel field="experience" onSelect={(text) => updateItem('experience', exp.id, { description: exp.description ? exp.description + '\n- ' + text : '- ' + text })} />
                    </label>
                    <textarea 
                      className="form-textarea" 
                      value={exp.description}
                      onChange={(e) => updateItem('experience', exp.id, { description: e.target.value })}
                      placeholder="- Développement d'une API REST&#10;- Amélioration des performances de 30%..." 
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

export default Experience;
