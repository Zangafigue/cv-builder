import { useCv } from '../../context/CvContext';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';

const Languages = () => {
  const { cvData, addItem, updateItem, removeItem } = useCv();
  const { languages } = cvData;

  const handleAdd = () => {
    addItem('languages', { name: '', level: 'B2', showLevel: true });
  };

  const levels = ['Notions', 'Intermédiaire', 'Avancé', 'Courant', 'Natif / Bilingue'];

  return (
    <div className="card animate-fade-in" style={{ marginTop: '1.5rem' }}>
      <div className="flex items-center justify-between mb-4" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem' }}>Langues</h2>
        <button className="btn btn-secondary" onClick={handleAdd} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {languages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
          Ajoutez les langues que vous maîtrisez.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {languages.map((lang) => (
            <div key={lang.id} className="flex gap-2 items-center" style={{ backgroundColor: 'var(--surface-50)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <input 
                type="text" 
                className="form-input" 
                value={lang.name}
                onChange={(e) => updateItem('languages', lang.id, { name: e.target.value })}
                placeholder="ex: Anglais" 
                style={{ flex: 1, border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}
              />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select 
                  className="form-input" 
                  value={lang.level}
                  onChange={(e) => updateItem('languages', lang.id, { level: e.target.value })}
                  style={{ width: '150px', border: 'none', backgroundColor: 'transparent', boxShadow: 'none', fontSize: '0.85rem' }}
                  disabled={!lang.showLevel}
                >
                  {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>

                <button 
                  onClick={() => updateItem('languages', lang.id, { showLevel: !lang.showLevel })}
                  style={{ 
                    padding: '0.4rem', border: 'none', background: 'none', cursor: 'pointer',
                    color: lang.showLevel ? 'var(--primary-600)' : 'var(--text-muted)'
                  }}
                  title={lang.showLevel ? 'Niveau visible' : 'Niveau masqué'}
                >
                  {lang.showLevel ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>

                <button 
                  className="btn btn-ghost" 
                  onClick={() => removeItem('languages', lang.id)}
                  style={{ padding: '0.5rem', color: 'var(--danger)' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Languages;
