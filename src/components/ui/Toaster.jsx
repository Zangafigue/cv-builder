import { useState, useEffect } from 'react';
import { subscribe } from '../../utils/toast';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
};

const COLORS = {
  success: { bg: '#dcfce7', border: '#86efac', icon: '#16a34a', text: '#15803d' },
  error:   { bg: '#fee2e2', border: '#fca5a5', icon: '#dc2626', text: '#b91c1c' },
  info:    { bg: '#dbeafe', border: '#93c5fd', icon: '#2563eb', text: '#1d4ed8' },
  warning: { bg: '#fef9c3', border: '#fde047', icon: '#d97706', text: '#b45309' },
};

const ToastItem = ({ toast, onRemove }) => {
  const c = COLORS[toast.type] || COLORS.info;

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '0.75rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        minWidth: '280px',
        maxWidth: '400px',
        animation: 'toastIn 0.3s ease forwards',
      }}
    >
      <span style={{ color: c.icon, flexShrink: 0, marginTop: '1px' }}>{ICONS[toast.type]}</span>
      <p style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: c.text, lineHeight: 1.4 }}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.icon, flexShrink: 0, padding: '2px' }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsub = subscribe((t) => setToasts((prev) => [...prev, t]));
    return unsub;
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
          pointerEvents: 'auto',
        }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </>
  );
};

export default Toaster;
