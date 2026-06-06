import { Component } from 'react';

// React error boundaries must be class components. Catches render errors in the
// subtree (e.g. a template that throws) so they don't white-screen the whole app.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    // Custom fallback: a node, or a (error, reset) => node render function.
    if (typeof this.props.fallback === 'function') {
      return this.props.fallback(error, this.reset);
    }
    if (this.props.fallback !== undefined) {
      return this.props.fallback;
    }

    return <DefaultFallback error={error} />;
  }
}

function DefaultFallback({ error }) {
  const clearAndReload = () => {
    try {
      localStorage.removeItem('cv-builder-data-v2');
      localStorage.removeItem('cv-builder-page');
      localStorage.removeItem('cv-builder-step');
    } catch { /* ignore */ }
    window.location.hash = '';
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem',
      padding: '2rem', textAlign: 'center', backgroundColor: 'var(--surface-50)',
    }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--surface-800)' }}>
        Une erreur est survenue
      </h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: 460, fontSize: '0.95rem' }}>
        L'application a rencontré un problème inattendu. Vous pouvez recharger la page.
        Si le problème persiste, réinitialiser les données locales corrige souvent une sauvegarde corrompue.
      </p>
      <p style={{ color: 'var(--surface-400)', fontSize: '0.8rem', fontFamily: 'monospace', maxWidth: 460, wordBreak: 'break-word' }}>
        {error?.message}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Recharger la page
        </button>
        <button className="btn btn-secondary" onClick={clearAndReload}>
          Réinitialiser les données
        </button>
      </div>
    </div>
  );
}
