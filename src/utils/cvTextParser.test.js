import { describe, it, expect } from 'vitest';
import { toYYYYMM, parseDateRange, detectSection, extractDataFromText } from './cvTextParser';

describe('toYYYYMM', () => {
  it('passes through YYYY-MM', () => expect(toYYYYMM('2020-03')).toBe('2020-03'));
  it('handles MM/YYYY', () => expect(toYYYYMM('03/2020')).toBe('2020-03'));
  it('handles a bare year', () => expect(toYYYYMM('2020')).toBe('2020-01'));
  it('handles French month names', () => expect(toYYYYMM('mars 2020')).toBe('2020-03'));
  it('handles English month names', () => expect(toYYYYMM('March 2020')).toBe('2020-03'));
  it('handles abbreviated months', () => expect(toYYYYMM('jan 2021')).toBe('2021-01'));
  it('returns empty string for unrecognised input', () => expect(toYYYYMM('hello')).toBe(''));
  it('returns empty string for empty input', () => expect(toYYYYMM('')).toBe(''));
});

describe('parseDateRange', () => {
  it('parses a year range', () => {
    expect(parseDateRange('2018 - 2020')).toEqual({ startDate: '2018-01', endDate: '2020-01', current: false });
  });
  it('detects an ongoing role (Présent)', () => {
    expect(parseDateRange('2020 - Présent')).toEqual({ startDate: '2020-01', endDate: '', current: true });
  });
  it('detects an ongoing role (Present, EN)', () => {
    expect(parseDateRange('Jan 2020 - Present')).toEqual({ startDate: '2020-01', endDate: '', current: true });
  });
  it('returns null without a separator', () => {
    expect(parseDateRange('2020')).toBeNull();
  });
});

describe('detectSection', () => {
  it('detects experience headers (FR/EN)', () => {
    expect(detectSection('Expérience professionnelle')).toBe('experience');
    expect(detectSection('Work Experience')).toBe('experience');
  });
  it('detects education headers', () => {
    expect(detectSection('Formation')).toBe('education');
    expect(detectSection('Education')).toBe('education');
  });
  it('detects skills and languages headers', () => {
    expect(detectSection('Compétences')).toBe('skills');
    expect(detectSection('Langues')).toBe('languages');
  });
  it('returns null for ordinary lines', () => {
    expect(detectSection('Jean Dupont')).toBeNull();
  });
});

describe('extractDataFromText', () => {
  const cv = [
    'Jean Dupont',
    'Développeur Full Stack',
    'jean.dupont@email.com',
    '+33 6 12 34 56 78',
    '',
    'Expérience',
    '2020 - Présent',
    'Développeur Senior',
    'Acme Corp',
    '- A piloté des projets importants pour le produit et les équipes techniques',
    '',
    'Compétences',
    'React, Node.js, TypeScript',
    '',
    'Langues',
    'Français - Natif',
    'Anglais (C1)',
  ].join('\n');

  it('extracts email and phone', () => {
    const d = extractDataFromText(cv);
    expect(d.personalInfo.email).toBe('jean.dupont@email.com');
    expect(d.personalInfo.phone).toContain('33');
  });

  it('extracts the full name and job title', () => {
    const d = extractDataFromText(cv);
    expect(d.personalInfo.fullName).toBe('Jean Dupont');
    expect(d.personalInfo.jobTitle).toBe('Développeur Full Stack');
  });

  it('parses skills into a deduplicated list', () => {
    const d = extractDataFromText(cv);
    const names = d.skills.map(s => s.name);
    expect(names).toContain('React');
    expect(names).toContain('Node.js');
    expect(names).toContain('TypeScript');
  });

  it('parses languages with their levels', () => {
    const d = extractDataFromText(cv);
    const fr = d.languages.find(l => l.name === 'Français');
    expect(fr).toBeTruthy();
    expect(fr.level).toBe('Natif');
  });

  it('parses an experience entry anchored by a date range', () => {
    const d = extractDataFromText(cv);
    expect(d.experience.length).toBeGreaterThan(0);
    expect(d.experience[0].position).toBe('Développeur Senior');
    expect(d.experience[0].company).toBe('Acme Corp');
    expect(d.experience[0].current).toBe(true);
    expect(d.experience[0].startDate).toBe('2020-01');
  });
});
