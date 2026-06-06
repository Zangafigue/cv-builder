import React from 'react';
import { useCv } from '../../context/CvContext';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const StepExtracurricular = () => {
  const { cvData, addItem, updateItem, removeItem } = useCv();
  const { extracurricular = [] } = cvData;

  // Normalize string extracurriculars to objects if they exist
  const normalizedItems = extracurricular.map(item => {
    if (typeof item === 'string') {
      return { id: uuidv4(), name: item };
    }
    return item;
  });

  const handleAdd = () => {
    addItem('extracurricular', { name: '' });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem' }}>Activités Extrascolaires & Bénévolat</h2>
        <button className="btn btn-secondary" onClick={handleAdd} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {normalizedItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--surface-50)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
          Aucune activité extrascolaire ajoutée. Cliquez sur "Ajouter" pour commencer.
        </div>
      ) : (
        <div className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {normalizedItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                value={item.name}
                onChange={(e) => updateItem('extracurricular', item.id, { name: e.target.value })}
                placeholder="ex: Bénévole — Croix-Rouge Française (2022 - Présent)"
                style={{ flex: 1 }}
              />
              <button
                className="btn btn-ghost hover-danger"
                onClick={() => removeItem('extracurricular', item.id)}
                style={{ padding: '0.5rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepExtracurricular;
