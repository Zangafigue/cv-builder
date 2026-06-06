import { useCv } from '../../context/CvContext';
import { 
  CVTemplateModern, 
  CVTemplateClassic, 
  CVTemplateMinimalist, 
  CVTemplateExecutive, 
  CVTemplateCreative, 
  CVTemplateTechnical, 
  CVTemplateElegant, 
  CVTemplateModernAlt, 
  CVTemplateTimeline,
  CVTemplateATS1, 
  CVTemplateATS2, 
  CVTemplateATS3, 
  CVTemplateJobLeads,
  CVTemplateBIT
} from '../../templates';
import { mapCvDataToTemplate } from '../../utils/templateMapper';
import ErrorBoundary from '../ui/ErrorBoundary';

const Preview = ({ overrideData } = {}) => {
  const { cvData: contextData } = useCv();
  const cvData = overrideData || contextData;

  const getFontSize = (size) => size === 'small' ? '0.9rem' : size === 'large' ? '1.1rem' : '1rem';
  const getLineHeight = (lh) => lh === 'compact' ? '1.3' : lh === 'relaxed' ? '1.8' : '1.5';

  const templateData = mapCvDataToTemplate(cvData, cvData.template);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      width: '100%',
      '--cv-font-family': cvData.typography?.fontFamily || 'sans-serif',
      '--cv-font-size': getFontSize(cvData.typography?.fontSize),
      '--cv-line-height': getLineHeight(cvData.typography?.lineHeight),
    }}>
      <ErrorBoundary
        key={cvData.template}
        fallback={
          <div style={{ width: 794, padding: '3rem', textAlign: 'center', background: '#fff', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 8 }}>
            <strong>Aperçu indisponible</strong>
            <p style={{ marginTop: 8, color: '#6b7280', fontSize: '0.9rem' }}>
              Ce modèle a rencontré une erreur d'affichage. Essayez un autre modèle.
            </p>
          </div>
        }
      >
      {cvData.template === 'modern' && <CVTemplateModern data={templateData} />}
      {cvData.template === 'classic' && <CVTemplateClassic data={templateData} />}
      {cvData.template === 'minimalist' && <CVTemplateMinimalist data={templateData} />}
      {cvData.template === 'executive' && <CVTemplateExecutive data={templateData} />}
      {cvData.template === 'creative' && <CVTemplateCreative data={templateData} />}
      {cvData.template === 'technical' && <CVTemplateTechnical data={templateData} />}
      {cvData.template === 'elegant' && <CVTemplateElegant data={templateData} />}
      {cvData.template === 'modern-alt' && <CVTemplateModernAlt data={templateData} />}
      {cvData.template === 'timeline' && <CVTemplateTimeline data={templateData} />}
      
      {/* ATS-Optimized Templates */}
      {cvData.template === 'ats-1' && <CVTemplateATS1 data={templateData} />}
      {cvData.template === 'ats-2' && <CVTemplateATS2 data={templateData} />}
      {cvData.template === 'ats-3' && <CVTemplateATS3 data={templateData} />}

      {/* JobLeads-style Template */}
      {cvData.template === 'jobleads' && <CVTemplateJobLeads data={templateData} />}

      {/* BIT Template */}
      {cvData.template === 'bit' && <CVTemplateBIT data={templateData} />}
      </ErrorBoundary>
    </div>
  );
};

export default Preview;
