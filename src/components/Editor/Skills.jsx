import { useCv } from '../../context/CvContext';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';

const Skills = () => {
  const { cvData, addItem, updateItem, removeItem } = useCv();
  const { skills } = cvData;

  const handleAdd = () => {
    addItem('skills', { name: '', level: 'Intermédiaire', showLevel: true });
  };

  const levels = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-4" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem' }}>Compétences Techniques</h2>
        <button className="btn btn-secondary" onClick={handleAdd} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {skills.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
          Ajoutez vos compétences clés.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {skills.map((skill) => (
            <div key={skill.id} className="flex gap-2 items-center" style={{ backgroundColor: 'var(--surface-50)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <input 
                type="text" 
                className="form-input" 
                value={skill.name}
                onChange={(e) => updateItem('skills', skill.id, { name: e.target.value })}
                placeholder="ex: React.js" 
                style={{ flex: 1, border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}
              />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select 
                  className="form-input" 
                  value={skill.level}
                  onChange={(e) => updateItem('skills', skill.id, { level: e.target.value })}
                  style={{ width: '130px', border: 'none', backgroundColor: 'transparent', boxShadow: 'none', fontSize: '0.85rem' }}
                  disabled={!skill.showLevel}
                >
                  {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>

                <button 
                  onClick={() => updateItem('skills', skill.id, { showLevel: !skill.showLevel })}
                  style={{ 
                    padding: '0.4rem', border: 'none', background: 'none', cursor: 'pointer',
                    color: skill.showLevel ? 'var(--primary-600)' : 'var(--text-muted)'
                  }}
                  title={skill.showLevel ? 'Niveau visible' : 'Niveau masqué'}
                >
                  {skill.showLevel ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>

                <button 
                  className="btn btn-ghost" 
                  onClick={() => removeItem('skills', skill.id)}
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

export default Skills;
