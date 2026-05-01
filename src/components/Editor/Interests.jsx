import { useCv } from '../../context/CvContext';
import { Plus, Trash2 } from 'lucide-react';

const Interests = () => {
  const { cvData, addItem, updateItem, removeItem } = useCv();
  const { interests = [] } = cvData;

  const handleAdd = () => {
    addItem('interests', { name: '' });
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-4" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem' }}>Centres d'intérêt</h2>
        <button className="btn btn-secondary" onClick={handleAdd} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {interests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
          Ajoutez vos loisirs et intérêts.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {interests.map((item) => (
            <div key={item.id} className="flex gap-2 items-center" style={{ backgroundColor: 'var(--surface-50)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <input 
                type="text" 
                className="form-input" 
                value={typeof item === 'string' ? item : item.name}
                onChange={(e) => updateItem('interests', item.id, { name: e.target.value })}
                placeholder="ex: Photographie, Voyage..." 
                style={{ flex: 1, border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}
              />
              <button 
                className="btn btn-ghost" 
                onClick={() => removeItem('interests', item.id)}
                style={{ padding: '0.5rem', color: 'var(--danger)' }}
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

export default Interests;
