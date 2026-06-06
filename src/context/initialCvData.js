// Default empty CV document. Kept in its own module (not exported from
// CvContext) so that file only exports components/hooks and Fast Refresh works.
export const initialCvData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    birthDate: '',
    birthPlace: '',
    nationality: '',
    linkedin: '',
    website: '',
    summary: '',
    photo: '', // Cropped/Final photo
    originalPhoto: '', // Source photo for re-cropping
    photoSettings: {
      shape: 'round',
      filter: 'none',
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: 1,
    }
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  interests: [],
  certifications: [],
  projects: [],
  extracurricular: [],
  customSections: [],
  sectionsOrder: ['experience', 'education', 'skills', 'languages', 'projects', 'extracurricular', 'certifications', 'interests', 'customSections'],
  template: 'modern',
  themeColor: '#3b82f6',
  typography: {
    fontFamily: 'Inter',
    fontSize: 'medium',
  },
};
