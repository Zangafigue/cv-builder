import { useState } from 'react';
import { User, Briefcase, GraduationCap, Wrench, Languages as LangIcon } from 'lucide-react';
import PersonalInfo from './PersonalInfo';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Languages from './Languages';

const Editor = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Profil', icon: User },
    { id: 'experience', label: 'Expérience', icon: Briefcase },
    { id: 'education', label: 'Formation', icon: GraduationCap },
    { id: 'skills', label: 'Compétences', icon: Wrench },
    { id: 'languages', label: 'Langues', icon: LangIcon },
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      <nav className="flex gap-2 p-1 bg-white rounded-lg shadow-sm border border-[var(--border-color)] overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-all whitespace-nowrap"
              style={{
                backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                color: isActive ? 'var(--primary-600)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="flex-1 overflow-y-auto pr-2" style={{ pb: '2rem' }}>
        {activeTab === 'personal' && <PersonalInfo />}
        {activeTab === 'experience' && <Experience />}
        {activeTab === 'education' && <Education />}
        {activeTab === 'skills' && <Skills />}
        {activeTab === 'languages' && <Languages />}
      </div>
    </div>
  );
};

export default Editor;
