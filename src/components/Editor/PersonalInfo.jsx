import { useCv } from '../../context/CvContext';
import SuggestionsPanel from '../Suggestions/SuggestionsPanel';

const PersonalInfo = () => {
  const { cvData, updatePersonalInfo } = useCv();
  const { personalInfo } = cvData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updatePersonalInfo(name, value);
  };

  return (
    <div className="card animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Informations Personnelles</h2>
      
      <div className="form-group">
        <label className="form-label" htmlFor="fullName">Nom complet</label>
        <input 
          type="text" 
          id="fullName"
          name="fullName"
          value={personalInfo.fullName}
          onChange={handleChange}
          className="form-input" 
          placeholder="ex: Jean Dupont" 
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="jobTitle">Titre professionnel</label>
        <input 
          type="text" 
          id="jobTitle"
          name="jobTitle"
          value={personalInfo.jobTitle}
          onChange={handleChange}
          className="form-input" 
          placeholder="ex: Développeur Full Stack" 
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={personalInfo.email}
            onChange={handleChange}
            className="form-input" 
            placeholder="jean.dupont@email.com" 
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="phone">Téléphone</label>
          <input 
            type="tel" 
            id="phone"
            name="phone"
            value={personalInfo.phone}
            onChange={handleChange}
            className="form-input" 
            placeholder="+33 6 12 34 56 78" 
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="location">Localisation</label>
        <input 
          type="text" 
          id="location"
          name="location"
          value={personalInfo.location}
          onChange={handleChange}
          className="form-input" 
          placeholder="Paris, France" 
        />
      </div>

      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} htmlFor="summary">
          <span>Profil / Résumé</span>
          <SuggestionsPanel field="summary" onSelect={(text) => updatePersonalInfo('summary', personalInfo.summary ? personalInfo.summary + '\n' + text : text)} />
        </label>
        <textarea 
          id="summary"
          name="summary"
          value={personalInfo.summary}
          onChange={handleChange}
          className="form-textarea" 
          placeholder="Un bref résumé de votre parcours et de vos objectifs..." 
        />
      </div>
    </div>
  );
};

export default PersonalInfo;
