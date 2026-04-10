import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#000000',
          color: '#fff',
          fontFamily: 'monospace',
          padding: '2rem',
        }}>
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ Application Error</h1>
            <pre style={{
              backgroundColor: '#0a0c18',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              maxHeight: '400px',
              fontSize: '0.85rem',
              border: '1px solid #ef4444',
            }}>
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ef4444',
                border: 'none',
                borderRadius: '0.3rem',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
