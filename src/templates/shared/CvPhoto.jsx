// Shared CV photo renderer used by templates that support a photo.
// Renders nothing when no photo is set, so it never shifts layout for photo-less CVs.
const FILTERS = {
  grayscale: 'grayscale(100%)',
  sepia: 'sepia(60%)',
  warm: 'sepia(20%) saturate(140%) brightness(1.05)',
  cold: 'saturate(80%) hue-rotate(10deg) brightness(1.05)',
  none: 'none',
};

export default function CvPhoto({ photo, settings = {}, size = 96, style }) {
  if (!photo) return null;
  return (
    <img
      src={photo}
      alt=""
      style={{
        display: 'block',
        width: size,
        height: size,
        objectFit: 'cover',
        flexShrink: 0,
        borderRadius: settings?.shape === 'square' ? '8px' : '50%',
        filter: FILTERS[settings?.filter] || 'none',
        ...style,
      }}
    />
  );
}
