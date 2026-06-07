import { describe, it, expect } from 'vitest';
import { analyzeCv, descriptionToBullets, tipsFor } from './cvSuggestions';

const msgs = (tips) => tips.map((t) => t.message);

describe('descriptionToBullets', () => {
  it('splits lines and strips bullet markers', () => {
    expect(descriptionToBullets('- A\n• B\n* C\n\n  D  ')).toEqual(['A', 'B', 'C', 'D']);
  });
  it('returns [] for empty', () => {
    expect(descriptionToBullets('')).toEqual([]);
  });
});

describe('analyzeCv — completeness', () => {
  it('flags an empty CV with high-severity essentials and a low score', () => {
    const { score, tips } = analyzeCv({});
    const sections = tips.map((t) => t.section);
    expect(sections).toEqual(expect.arrayContaining(['personalInfo', 'summary', 'experience', 'skills']));
    expect(tips.some((t) => t.severity === 'high')).toBe(true);
    expect(score).toBeLessThan(60);
  });

  it('gives a high score to a complete, well-written CV', () => {
    const { score, tips } = analyzeCv({
      personalInfo: {
        fullName: 'Jane Doe', email: 'j@e.com', phone: '0102030405',
        location: 'Paris', jobTitle: 'Ingénieure logiciel',
        summary: 'Ingénieure logiciel avec 6 ans d’expérience en applications web performantes, spécialisée React et Node, orientée résultats et qualité produit au quotidien.',
      },
      experience: [{
        id: 'e1', position: 'Lead Dev', company: 'Acme', startDate: '2020-01', current: true,
        description: 'Conçu une plateforme SaaS\nRéduit le temps de chargement de 40%',
      }],
      education: [{ id: 'ed1', degree: 'MSc', school: 'Uni' }],
      skills: [
        { name: 'React' }, { name: 'Node' }, { name: 'TypeScript' },
        { name: 'PostgreSQL' }, { name: 'Docker' }, { name: 'CI/CD' },
      ],
    });
    expect(score).toBeGreaterThan(85);
    expect(tips.length).toBeLessThan(3);
  });
});

describe('analyzeCv — content-aware rules', () => {
  it('suggests quantifying when no bullet has a number', () => {
    const { tips } = analyzeCv({
      experience: [{ id: 'e1', position: 'Dev', company: 'X', startDate: '2020-01',
        description: 'Développé des fonctionnalités\nParticipé aux revues de code' }],
    });
    expect(msgs(tipsFor({ tips }, 'experience', 'e1')).join(' ')).toMatch(/[Qq]uantifiez/);
  });

  it('does NOT ask to quantify when a number is present', () => {
    const { tips } = analyzeCv({
      experience: [{ id: 'e1', position: 'Dev', company: 'X', startDate: '2020-01',
        description: 'Augmenté le taux de conversion de 15%' }],
    });
    expect(msgs(tipsFor({ tips }, 'experience', 'e1')).join(' ')).not.toMatch(/[Qq]uantifiez/);
  });

  it('flags weak/passive bullet openers', () => {
    const { tips } = analyzeCv({
      experience: [{ id: 'e1', position: 'Dev', company: 'X', startDate: '2020-01',
        description: 'Responsable de la migration\nAugmenté les ventes de 20%' }],
    });
    expect(msgs(tipsFor({ tips }, 'experience', 'e1')).join(' ')).toMatch(/verbe d'action/);
  });

  it('flags a too-short summary with its word count', () => {
    const { tips } = analyzeCv({ personalInfo: { summary: 'Développeur web motivé.' } });
    expect(msgs(tipsFor({ tips }, 'summary')).join(' ')).toMatch(/Étoffez/);
  });

  it('does not demand experience when projects are present (student profile)', () => {
    const { tips } = analyzeCv({ projects: [{ id: 'p1', title: 'X', bullets: ['Conçu un module'] }] });
    expect(tips.some((t) => t.section === 'experience')).toBe(false);
  });

  it('flags duplicate and too-few skills', () => {
    const { tips } = analyzeCv({ skills: [{ name: 'React' }, { name: 'react' }] });
    const s = msgs(tipsFor({ tips }, 'skills')).join(' ');
    expect(s).toMatch(/Doublon/);
    expect(s).toMatch(/Peu de compétences/);
  });
});
