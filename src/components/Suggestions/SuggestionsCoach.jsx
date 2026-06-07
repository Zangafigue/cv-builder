import { useMemo, useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useCv } from '../../context/CvContext';
import { analyzeCv } from '../../utils/cvSuggestions';

const SEV = {
  high: { color: '#dc2626', bg: '#fef2f2', Icon: AlertCircle },
  medium: { color: '#d97706', bg: '#fffbeb', Icon: AlertTriangle },
  low: { color: '#64748b', bg: '#f8fafc', Icon: Info },
};
const ORDER = { high: 0, medium: 1, low: 2 };

// Live, content-aware CV coach. Recomputes local heuristic suggestions from the
// current cvData on every edit (no AI, no network).
export default function SuggestionsCoach({ defaultOpen = true, maxVisible = 6 }) {
  const { cvData } = useCv();
  const [open, setOpen] = useState(defaultOpen);
  const { score, tips } = useMemo(() => analyzeCv(cvData), [cvData]);

  const sorted = useMemo(() => [...tips].sort((a, b) => ORDER[a.severity] - ORDER[b.severity]), [tips]);
  const visible = sorted.slice(0, maxVisible);
  const hidden = sorted.length - visible.length;
  const scoreColor = score >= 80 ? '#16a34a' : score >= 55 ? '#d97706' : '#dc2626';

  return (
    <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', backgroundColor: 'white', overflow: 'hidden', marginTop: '2rem' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <Lightbulb size={18} style={{ color: 'var(--primary-500)' }} />
        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--surface-700)' }}>Coach CV</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: scoreColor }}>{score}/100</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {tips.length} suggestion{tips.length > 1 ? 's' : ''}
          </span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      <div style={{ height: 4, backgroundColor: 'var(--surface-200)' }}>
        <div style={{ height: '100%', width: `${score}%`, backgroundColor: scoreColor, transition: 'width 0.4s ease' }} />
      </div>

      {open && (
        <div style={{ padding: '0.75rem 1rem 1rem' }}>
          {tips.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} /> Beau travail — rien à signaler pour l'instant.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {visible.map((t) => {
                const s = SEV[t.severity] || SEV.low;
                const Icon = s.Icon;
                return (
                  <div key={t.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.45rem 0.6rem', borderRadius: 'var(--radius-md)', backgroundColor: s.bg, fontSize: '0.8rem', lineHeight: 1.45, color: 'var(--surface-700)' }}>
                    <Icon size={14} style={{ color: s.color, flexShrink: 0, marginTop: 2 }} />
                    <span>{t.message}</span>
                  </div>
                );
              })}
              {hidden > 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  + {hidden} autre{hidden > 1 ? 's' : ''} suggestion{hidden > 1 ? 's' : ''}…
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
