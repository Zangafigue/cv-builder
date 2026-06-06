import { useCv } from '../../context/CvContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, Sparkles } from 'lucide-react';

const SECTION_LABELS = {
  experience: 'Expérience Professionnelle',
  education: 'Formation',
  skills: 'Compétences Clés',
  languages: 'Langues Parlées',
  projects: 'Projets Réalisés',
  extracurricular: 'Activités Extrascolaires & Bénévolat',
  certifications: 'Certifications',
  interests: 'Loisirs & Intérêts',
  customSections: 'Rubriques Personnalisées',
};

const SortableItem = ({ id, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        padding: '0.875rem 1rem',
        marginBottom: '0.75rem',
        backgroundColor: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: isDragging ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      <div 
        {...attributes} 
        {...listeners}
        style={{ cursor: 'grab', marginRight: '1rem', display: 'flex', color: 'var(--text-muted)', touchAction: 'none' }}
      >
        <GripVertical size={18} />
      </div>
      <span style={{ fontWeight: 600, color: 'var(--surface-800)', flex: 1 }}>
        {SECTION_LABELS[id]}
      </span>
      <button 
        onClick={() => onRemove(id)}
        style={{ 
          background: 'none', border: 'none', color: 'var(--text-muted)', 
          cursor: 'pointer', padding: '0.4rem', borderRadius: 'var(--radius-md)',
          transition: 'all 0.2s'
        }}
        className="hover-danger"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const StepStructure = () => {
  const { cvData, updateTemplateSettings } = useCv();
  const { sectionsOrder = ['experience', 'education', 'skills', 'languages', 'projects', 'extracurricular', 'certifications', 'interests', 'customSections'] } = cvData;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionsOrder.indexOf(active.id);
      const newIndex = sectionsOrder.indexOf(over.id);
      const newOrder = arrayMove(sectionsOrder, oldIndex, newIndex);
      updateTemplateSettings('sectionsOrder', newOrder);
    }
  };

  const removeSection = (id) => {
    const newOrder = sectionsOrder.filter(sid => sid !== id);
    updateTemplateSettings('sectionsOrder', newOrder);
  };

  const addSection = (id) => {
    if (!sectionsOrder.includes(id)) {
      updateTemplateSettings('sectionsOrder', [...sectionsOrder, id]);
    }
  };

  const availableSections = Object.keys(SECTION_LABELS).filter(id => !sectionsOrder.includes(id));

  return (
    <div className="wizard-step">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--surface-800)' }}>
            Structure du CV
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Réorganisez ou gérez vos rubriques.
          </p>
        </div>
        {availableSections.length > 0 && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {availableSections.map(id => (
                <button
                  key={id}
                  onClick={() => addSection(id)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', gap: '0.375rem' }}
                >
                  <Plus size={14} /> {SECTION_LABELS[id].split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={sectionsOrder}
          strategy={verticalListSortingStrategy}
        >
          {sectionsOrder.map(id => (
            <SortableItem key={id} id={id} onRemove={removeSection} />
          ))}
        </SortableContext>
      </DndContext>

      {sectionsOrder.length === 0 && (
        <div style={{ 
          padding: '3rem', textAlign: 'center', border: '2px dashed var(--border-color)', 
          borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' 
        }}>
          <Sparkles size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>Aucune section ajoutée. Utilisez les boutons ci-dessus pour construire votre CV.</p>
        </div>
      )}
    </div>
  );
};

export default StepStructure;
