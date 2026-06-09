import { useState, useCallback } from 'react';
import { useCv } from '../../context/CvContext';
import { Upload, X, Camera, Square, Circle, Sparkles, Check, ZoomIn, Maximize } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';
import { downscaleDataUrl } from '../../utils/downscaleImage';
import { templateSupportsPhoto } from '../../templates/templateMeta';

const StepPersonalInfo = () => {
  const { cvData, updatePersonalInfo } = useCv();
  const { personalInfo } = cvData;
  const photoSupported = templateSupportsPhoto(cvData.template);
  const [isEditing, setIsEditing] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  const handle = e => updatePersonalInfo(e.target.name, e.target.value);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        // Bound the source photo (kept for re-cropping) so the base64 stored in
        // localStorage stays small; the cropped result is bounded again in cropImage.
        const bounded = await downscaleDataUrl(reader.result, { maxDim: 1024 });
        updatePersonalInfo('originalPhoto', bounded);
        updatePersonalInfo('photo', bounded); // Initial preview until cropping
        setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const saveCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(
        personalInfo.originalPhoto,
        croppedAreaPixels
      );
      updatePersonalInfo('photo', croppedImage);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  const removePhoto = () => {
    updatePersonalInfo('photo', '');
    updatePersonalInfo('originalPhoto', '');
  };
  
  const updatePhotoSetting = (setting, value) => {
    updatePersonalInfo('photoSettings', {
      ...personalInfo.photoSettings,
      [setting]: value
    });
  };

  const field = (id, label, type = 'text', placeholder = '') => (
    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
      <label className="form-label" htmlFor={id} style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--surface-700)', marginBottom: '0.5rem' }}>
        {label}
      </label>
      <input 
        type={type} 
        id={id} 
        name={id} 
        value={personalInfo[id] || ''} 
        onChange={handle} 
        className="form-input" 
        placeholder={placeholder}
        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.925rem' }} 
      />
    </div>
  );

  const getFilterStyle = (filter) => {
    switch (filter) {
      case 'grayscale': return 'grayscale(100%)';
      case 'sepia': return 'sepia(60%)';
      case 'warm': return 'sepia(20%) saturate(140%) brightness(1.05)';
      case 'cold': return 'saturate(80%) hue-rotate(10deg) brightness(1.05)';
      default: return 'none';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Editor Modal Overlay */}
      {isEditing && personalInfo.originalPhoto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{ 
            width: '100%', 
            maxWidth: '600px', 
            height: '400px', 
            position: 'relative', 
            backgroundColor: '#111',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <Cropper
              image={personalInfo.originalPhoto}
              crop={personalInfo.photoSettings?.crop || { x: 0, y: 0 }}
              zoom={personalInfo.photoSettings?.zoom || 1}
              aspect={personalInfo.photoSettings?.aspect || 1}
              onCropChange={(crop) => updatePhotoSetting('crop', crop)}
              onZoomChange={(zoom) => updatePhotoSetting('zoom', zoom)}
              onCropComplete={onCropComplete}
            />
          </div>
          
          <div style={{ 
            marginTop: '1.5rem', 
            width: '100%', 
            maxWidth: '600px', 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <ZoomIn size={18} color="var(--text-muted)" />
              <input
                type="range"
                value={personalInfo.photoSettings?.zoom || 1}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => updatePhotoSetting('zoom', parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--primary-600)' }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => updatePhotoSetting('aspect', 1)}
                  className="btn btn-ghost"
                  style={{ 
                    padding: '0.5rem 1rem', 
                    fontSize: '0.8rem',
                    backgroundColor: personalInfo.photoSettings?.aspect === 1 ? 'var(--primary-50)' : 'transparent',
                    color: personalInfo.photoSettings?.aspect === 1 ? 'var(--primary-700)' : 'var(--text-muted)'
                  }}
                >
                  1:1
                </button>
                <button 
                  onClick={() => updatePhotoSetting('aspect', 4/3)}
                  className="btn btn-ghost"
                  style={{ 
                    padding: '0.5rem 1rem', 
                    fontSize: '0.8rem',
                    backgroundColor: personalInfo.photoSettings?.aspect === 4/3 ? 'var(--primary-50)' : 'transparent',
                    color: personalInfo.photoSettings?.aspect === 4/3 ? 'var(--primary-700)' : 'var(--text-muted)'
                  }}
                >
                  4:3
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.625rem 1.25rem' }}
                >
                  Annuler
                </button>
                <button 
                  onClick={saveCrop}
                  className="btn btn-primary"
                  style={{ padding: '0.625rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Check size={18} /> Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="personal-info-layout" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Photo Upload Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          {!photoSupported ? (
            <div style={{
              fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center',
              border: '1px dashed var(--border-color)', borderRadius: '12px',
              padding: '1.25rem 1rem', backgroundColor: 'var(--surface-50)', lineHeight: 1.5,
            }}>
              <Camera size={22} style={{ opacity: 0.5, marginBottom: '0.5rem' }} /><br />
              Ce modèle (ATS) n'affiche pas de photo — un CV optimisé ATS doit rester sans image. Choisissez un autre modèle pour ajouter une photo.
            </div>
          ) : (
          <>
          <div style={{
            width: '150px',
            height: '150px', 
            borderRadius: personalInfo.photoSettings?.shape === 'round' ? '50%' : '12px',
            border: '2px dashed var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--surface-50)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            cursor: personalInfo.photo ? 'default' : 'pointer'
          }}>
            {personalInfo.photo ? (
              <>
                <img 
                  src={personalInfo.photo} 
                  alt="Avatar" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    filter: getFilterStyle(personalInfo.photoSettings?.filter)
                  }} 
                />
                <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                  <button 
                    onClick={() => setIsEditing(true)}
                    style={{ 
                      backgroundColor: 'rgba(59, 130, 246, 0.9)', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '50%', 
                      width: '28px', 
                      height: '28px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-md)'
                    }}
                    title="Recadrer"
                  >
                    <Maximize size={14} />
                  </button>
                  <button 
                    onClick={removePhoto}
                    style={{ 
                      backgroundColor: 'rgba(239, 68, 68, 0.9)', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '50%', 
                      width: '28px', 
                      height: '28px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-md)'
                    }}
                    title="Supprimer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </>
            ) : (
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <Camera size={28} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Ajouter Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          {/* Photo Settings UI */}
          {personalInfo.photo && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => updatePhotoSetting('shape', 'round')}
                  style={{ 
                    padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', 
                    backgroundColor: personalInfo.photoSettings?.shape === 'round' ? 'var(--primary-50)' : 'white',
                    color: personalInfo.photoSettings?.shape === 'round' ? 'var(--primary-600)' : 'var(--text-muted)'
                  }}
                  title="Cercle"
                >
                  <Circle size={16} />
                </button>
                <button 
                  onClick={() => updatePhotoSetting('shape', 'square')}
                  style={{ 
                    padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', 
                    backgroundColor: personalInfo.photoSettings?.shape === 'square' ? 'var(--primary-50)' : 'white',
                    color: personalInfo.photoSettings?.shape === 'square' ? 'var(--primary-600)' : 'var(--text-muted)'
                  }}
                  title="Carré"
                >
                  <Square size={16} />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
                {['none', 'grayscale', 'sepia', 'warm', 'cold'].map(f => (
                  <button
                    key={f}
                    onClick={() => updatePhotoSetting('filter', f)}
                    style={{
                      fontSize: '0.7rem', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-color)',
                      backgroundColor: personalInfo.photoSettings?.filter === f ? 'var(--primary-600)' : 'white',
                      color: personalInfo.photoSettings?.filter === f ? 'white' : 'var(--text-muted)',
                      textTransform: 'capitalize'
                    }}
                  >
                    {f === 'none' ? 'Normal' : f}
                  </button>
                ))}
              </div>
            </div>
          )}
          </>
          )}
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {field('fullName', 'Prénom et Nom', 'text', 'Jean Dupont')}
            {field('jobTitle', 'Titre du CV / Intitulé de poste', 'text', 'Développeur Web')}
          </div>
          <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {field('email', 'Adresse e-mail', 'email', 'jean.dupont@email.com')}
            {field('phone', 'Téléphone', 'tel', '+33 6 12 34 56 78')}
          </div>
          <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {field('location', 'Ville / Adresse', 'text', 'Paris, France')}
            {field('birthDate', 'Date de naissance', 'date', '')}
          </div>
          <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {field('birthPlace', 'Lieu de naissance', 'text', 'Paris')}
            {field('linkedin', 'LinkedIn (optionnel)', 'url', 'linkedin.com/in/votre-profil')}
          </div>
          <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {field('github', 'GitHub (optionnel)', 'url', 'github.com/votre-pseudo')}
            {field('website', 'Site web / Portfolio', 'url', 'monsite.com')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepPersonalInfo;
