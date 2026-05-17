import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: '#0a0e1a',
            color: '#e8eaf6',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(245, 34, 45, 0.1)',
              border: '2px solid rgba(245, 34, 45, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              fontSize: 28,
            }}
          >
            ⚠
          </div>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 8,
              color: '#ffc107',
            }}
          >
            Something went wrong / ስህተት ተፈጥሯል
          </h3>
          <p
            style={{
              fontSize: 12,
              color: '#7986cb',
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            The map encountered an error. Please go back and try again.
            <br />
            ካርታው ስህተት ያጋጠመዋል። እባክዎ ተመለስ እና እንደገና ይሞክሩ።
          </p>
          {this.props.onBack && (
            <button
              onClick={this.props.onBack}
              style={{
                padding: '12px 28px',
                borderRadius: 12,
                background: 'rgba(0, 188, 212, 0.15)',
                border: '1px solid rgba(0, 188, 212, 0.4)',
                color: '#00bcd4',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← Go Back / ተመለስ
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
