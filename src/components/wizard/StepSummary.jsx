import { useCv } from '../../context/CvContext';
import SuggestionsPanel from '../Suggestions/SuggestionsPanel';

const StepSummary = () => {
  const { cvData, updatePersonalInfo } = useCv();
  const { personalInfo } = cvData;

  return (
    <div className="form-group">
      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
        <span>Synthèse professionnelle</span>
        <SuggestionsPanel
          field="summary"
          onSelect={(text) => updatePersonalInfo('summary', personalInfo.summary ? personalInfo.summary + ' ' + text : text)}
        />
      </label>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.5 }}>
        Présentez-vous en trois à cinq phrases en décrivant vos compétences, réalisations et votre valeur ajoutée.
      </p>
      <textarea
        name="summary"
        value={personalInfo.summary || ''}
        onChange={e => updatePersonalInfo('summary', e.target.value)}
        className="form-textarea"
        placeholder="Étudiant en Licence Informatique passionné par le développement web..."
        style={{ minHeight: '200px', fontSize: '0.9375rem', lineHeight: 1.7 }}
      />
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
        {personalInfo.summary?.length || 0} caractères
      </p>
    </div>
  );
};

export default StepSummary;
