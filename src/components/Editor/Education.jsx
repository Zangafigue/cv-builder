import { useState } from 'react';
import { useCv } from '../../context/CvContext';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Education = () => {
  const { cvData, addItem, updateItem, removeItem } = useCv();
  const { education } = cvData;
  const [expandedId, setExpandedId] = useState(null);

  const handleAdd = () => {
    const newId = uuidv4();
    addItem('education', {
      id: newId,
      school: '',
      degree: '',
      field: '',
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
        <h2 style={{ fontSize: '1.125rem' }}>Formations & Diplômes</h2>
        <button className="btn btn-secondary" onClick={handleAdd} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {education.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--surface-50)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
          Aucune formation ajoutée. Cliquez sur "Ajouter" pour commencer.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {education.map((edu) => (
            <div key={edu.id} className="card" style={{ padding: '1rem' }}>
              {/* Header (Always visible) */}
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => toggleExpand(edu.id)}
              >
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>
                    {edu.degree || '(Diplôme)'} {edu.field && `- ${edu.field}`}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {edu.school || 'Établissement'} • {edu.startDate || 'Début'} - {edu.current ? 'Présent' : (edu.endDate || 'Fin')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="btn btn-ghost" 
                    onClick={(e) => { e.stopPropagation(); removeItem('education', edu.id); }}
                    style={{ padding: '0.5rem', color: 'var(--danger)' }}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                    {expandedId === edu.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Form Body (Collapsible) */}
              {expandedId === edu.id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <div className="form-group">
                    <label className="form-label">Diplôme / Certificat</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={edu.degree}
                      onChange={(e) => updateItem('education', edu.id, { degree: e.target.value })}
                      placeholder="ex: Master en Informatique" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Domaine d'études (Optionnel)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={edu.field}
                      onChange={(e) => updateItem('education', edu.id, { field: e.target.value })}
                      placeholder="ex: Ingénierie logicielle" 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Établissement / École</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={edu.school}
                      onChange={(e) => updateItem('education', edu.id, { school: e.target.value })}
                      placeholder="ex: Université de Paris" 
                    />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Date de début</label>
                      <input 
                        type="month" 
                        className="form-input" 
                        value={edu.startDate}
                        onChange={(e) => updateItem('education', edu.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label flex items-center justify-between">
                        <span>Date de fin</span>
                        <div className="flex items-center gap-1" style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>
                          <input 
                            type="checkbox" 
                            checked={edu.current}
                            onChange={(e) => updateItem('education', edu.id, { current: e.target.checked, endDate: e.target.checked ? '' : edu.endDate })}
                            id={`edu-current-${edu.id}`}
                          />
                          <label htmlFor={`edu-current-${edu.id}`}>En cours</label>
                        </div>
                      </label>
                      <input 
                        type="month" 
                        className="form-input" 
                        value={edu.endDate}
                        onChange={(e) => updateItem('education', edu.id, { endDate: e.target.value })}
                        disabled={edu.current}
                        style={{ opacity: edu.current ? 0.5 : 1 }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label mt-2">Description / Mentions / Projets</label>
                    <textarea 
                      className="form-textarea" 
                      value={edu.description}
                      onChange={(e) => updateItem('education', edu.id, { description: e.target.value })}
                      placeholder="- Mention Très Bien&#10;- Projet de fin d'études : Création d'un E-commerce..." 
                      style={{ minHeight: '80px' }}
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

export default Education;
