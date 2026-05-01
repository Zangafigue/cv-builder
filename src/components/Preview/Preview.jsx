import { useCv } from '../../context/CvContext';
import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import CreativeTemplate from './CreativeTemplate';
import TechnicalTemplate from './TechnicalTemplate';
import ElegantTemplate from './ElegantTemplate';
import ModernAltTemplate from './ModernAltTemplate';
import TimelineTemplate from './TimelineTemplate';

// ATS-Optimized Templates
import { CVTemplateATS1, CVTemplateATS2, CVTemplateATS3, CVTemplateJobLeads } from '../../templates';
import { mapCvDataToTemplate } from '../../utils/templateMapper';

const Preview = () => {
  const { cvData } = useCv();

  const getFontSize = (size) => size === 'small' ? '0.9rem' : size === 'large' ? '1.1rem' : '1rem';
  const getLineHeight = (lh) => lh === 'compact' ? '1.3' : lh === 'relaxed' ? '1.8' : '1.5';

  const templateData = mapCvDataToTemplate(cvData);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      width: '100%',
      '--cv-font-family': cvData.typography?.fontFamily || 'sans-serif',
      '--cv-font-size': getFontSize(cvData.typography?.fontSize),
      '--cv-line-height': getLineHeight(cvData.typography?.lineHeight),
    }}>
      {cvData.template === 'modern' && <ModernTemplate />}
      {cvData.template === 'classic' && <ClassicTemplate />}
      {cvData.template === 'minimalist' && <MinimalistTemplate />}
      {cvData.template === 'executive' && <ExecutiveTemplate />}
      {cvData.template === 'creative' && <CreativeTemplate />}
      {cvData.template === 'technical' && <TechnicalTemplate />}
      {cvData.template === 'elegant' && <ElegantTemplate />}
      {cvData.template === 'modern-alt' && <ModernAltTemplate />}
      {cvData.template === 'timeline' && <TimelineTemplate />}
      
      {/* ATS-Optimized Templates */}
      {cvData.template === 'ats-1' && <CVTemplateATS1 data={templateData} />}
      {cvData.template === 'ats-2' && <CVTemplateATS2 data={templateData} />}
      {cvData.template === 'ats-3' && <CVTemplateATS3 data={templateData} />}

      {/* JobLeads-style Template */}
      {cvData.template === 'jobleads' && <CVTemplateJobLeads data={templateData} />}
    </div>
  );
};

export default Preview;
