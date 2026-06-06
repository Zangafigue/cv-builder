import { describe, it, expect } from 'vitest';
import { mapCvDataToTemplate, getMockData } from './templateMapper';

const sample = {
  personalInfo: {
    fullName: 'Jane Doe', jobTitle: 'Dev', email: 'j@e.com',
    phone: '123', location: 'Paris', summary: 'Hi',
  },
  experience: [{
    id: '1', position: 'Engineer', company: 'Acme',
    startDate: '2020-01', endDate: '', current: true,
    description: '- Built X\n- Led Y',
  }],
  education: [{
    id: '2', degree: 'MSc', school: 'Uni',
    startDate: '2016-09', endDate: '2018-07', current: false, description: 'Notes',
  }],
  skills: [
    { id: 's1', name: 'React', level: 'Expert', showLevel: true },
    { id: 's2', name: 'Node', level: 'Avancé', showLevel: true },
  ],
  languages: [{ id: 'l1', name: 'FR', level: 'Natif', showLevel: true }],
  interests: [{ id: 'i1', name: 'Photo' }],
  certifications: [{ id: 'c1', name: 'AWS', date: '2022', org: 'Amazon' }],
  projects: [{ id: 'p1', title: 'Proj', type: 'Perso', bullets: ['a', 'b'] }],
  extracurricular: [{ id: 'e1', name: 'Volunteer' }],
  customSections: [{ id: 'cs1', name: 'Pubs', content: 'x' }],
  themeColor: '#000', typography: {}, sectionsOrder: ['experience'],
};

describe('mapCvDataToTemplate', () => {
  it('maps personal info to flat template fields', () => {
    const t = mapCvDataToTemplate(sample);
    expect(t.name).toBe('Jane Doe');
    expect(t.title).toBe('Dev');
    expect(t.address).toBe('Paris');
    expect(t.summary).toBe('Hi');
  });

  it('builds the experience period and splits the description into bullets', () => {
    const t = mapCvDataToTemplate(sample);
    expect(t.experience[0].title).toBe('Engineer');
    expect(t.experience[0].company).toBe('Acme');
    expect(t.experience[0].period).toBe('2020-01 - Présent');
    expect(t.experience[0].bullets).toEqual(['Built X', 'Led Y']);
  });

  it('uses English "Present" when language is EN', () => {
    const t = mapCvDataToTemplate({ ...sample, language: 'EN' });
    expect(t.experience[0].period).toBe('2020-01 - Present');
  });

  it('uses the end date when an entry is not current', () => {
    const t = mapCvDataToTemplate(sample);
    expect(t.education[0].period).toBe('2016-09 - 2018-07');
  });

  it('keeps the standard skills shape for non-bit templates', () => {
    const t = mapCvDataToTemplate(sample, 'modern');
    expect(t.skills).toEqual([
      { name: 'React', level: 'Expert', showLevel: true },
      { name: 'Node', level: 'Avancé', showLevel: true },
    ]);
  });

  it('groups skills by level for the bit template', () => {
    const t = mapCvDataToTemplate(sample, 'bit');
    expect(t.skills).toEqual([
      { label: 'Expert', value: 'React' },
      { label: 'Avancé', value: 'Node' },
    ]);
  });

  it('maps interest objects to names and passes certifications through', () => {
    const t = mapCvDataToTemplate(sample);
    expect(t.interests).toEqual(['Photo']);
    expect(t.certifications[0]).toEqual({ name: 'AWS', date: '2022', org: 'Amazon' });
  });

  it('does not throw and defaults arrays when sections are missing', () => {
    expect(() => mapCvDataToTemplate({ personalInfo: {} })).not.toThrow();
    const t = mapCvDataToTemplate({ personalInfo: {} });
    expect(t.experience).toEqual([]);
    expect(t.skills).toEqual([]);
  });
});

describe('getMockData', () => {
  it('returns a mapped template object with content', () => {
    const m = getMockData('modern');
    expect(m.name).toBeTruthy();
    expect(Array.isArray(m.experience)).toBe(true);
    expect(m.experience.length).toBeGreaterThan(0);
  });
});
