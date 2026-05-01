import './styles/components.css';
import { useCv } from './context/CvContext';
import LandingPage from './pages/LandingPage';
import TemplateSelectPage from './pages/TemplateSelectPage';
import WizardPage from './pages/WizardPage';
import FinalPage from './pages/FinalPage';
import Toaster from './components/ui/Toaster';

function App() {
  const { currentPage } = useCv();

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'template-select' && <TemplateSelectPage />}
      {currentPage === 'wizard' && <WizardPage />}
      {currentPage === 'final' && <FinalPage />}
      <Toaster />
    </div>
  );
}

export default App;
