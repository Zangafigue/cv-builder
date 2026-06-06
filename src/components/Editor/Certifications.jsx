import { useCv } from '../../context/CvContext';
import { Plus, Trash2, Calendar, Landmark } from 'lucide-react';

const Certifications = () => {
  const { cvData, addItem, updateItem, removeItem } = useCv();
  const { certifications = [] } = cvData;

  const handleAdd = () => {
    addItem('certifications', { name: '', date: '', org: '' });
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-4" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem' }}>Certifications</h2>
        <button className="btn btn-secondary" onClick={handleAdd} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {certifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
          Ajoutez vos certifications et diplômes complémentaires.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="form-section" style={{ backgroundColor: 'var(--surface-50)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', position: 'relative' }}>
              <button 
                className="btn btn-ghost" 
                onClick={() => removeItem('certifications', cert.id)}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: 'var(--danger)' }}
              >
                <Trash2 size={16} />
              </button>
              
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Intitulé de la certification</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={cert.name}
                  onChange={(e) => updateItem('certifications', cert.id, { name: e.target.value })}
                  placeholder="ex: Google Project Management Certificate"
                />
              </div>

              <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Organisme</label>
                  <div style={{ position: 'relative' }}>
                    <Landmark size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ paddingLeft: '2.25rem' }}
                      value={cert.org}
                      onChange={(e) => updateItem('certifications', cert.id, { org: e.target.value })}
                      placeholder="ex: Google / Coursera"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Date d'obtention</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ paddingLeft: '2.25rem' }}
                      value={cert.date}
                      onChange={(e) => updateItem('certifications', cert.id, { date: e.target.value })}
                      placeholder="ex: Août 2025"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certifications;
