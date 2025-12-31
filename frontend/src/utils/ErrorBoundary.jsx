import React from 'react';
import PropTypes from 'prop-types';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    // Update state with error details
    this.setState(prevState => ({
      error: error,
      errorInfo: errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // In production, you might want to log to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠️</div>
            <h1>Oups ! Quelque chose s'est mal passé</h1>
            <p className="error-boundary-message">
              Une erreur inattendue s'est produite. Nous nous excusons pour la gêne occasionnée.
            </p>

            {/* Show error details in development */}
            {import.meta.env.DEV && this.state.error && (
              <details className="error-boundary-details">
                <summary>Détails de l'erreur (développement uniquement)</summary>
                <div className="error-boundary-stack">
                  <h3>Message d'erreur:</h3>
                  <pre>{this.state.error.toString()}</pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <h3>Stack trace:</h3>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div className="error-boundary-actions">
              <button 
                className="btn btn-primary" 
                onClick={this.handleReset}
              >
                Réessayer
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={this.handleReload}
              >
                Recharger la page
              </button>
            </div>

            {/* Show error count if multiple errors */}
            {this.state.errorCount > 1 && (
              <p className="error-boundary-count">
                Nombre d'erreurs: {this.state.errorCount}
              </p>
            )}
          </div>

          <style>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }

            .error-boundary-content {
              background: white;
              border-radius: 12px;
              padding: 3rem;
              max-width: 600px;
              width: 100%;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
              text-align: center;
            }

            .error-boundary-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }

            .error-boundary-content h1 {
              color: #333;
              margin-bottom: 1rem;
              font-size: 1.8rem;
            }

            .error-boundary-message {
              color: #666;
              margin-bottom: 2rem;
              line-height: 1.6;
            }

            .error-boundary-details {
              text-align: left;
              margin: 2rem 0;
              padding: 1rem;
              background: #f5f5f5;
              border-radius: 8px;
              border: 1px solid #ddd;
            }

            .error-boundary-details summary {
              cursor: pointer;
              font-weight: 600;
              color: #667eea;
              margin-bottom: 1rem;
            }

            .error-boundary-details summary:hover {
              color: #764ba2;
            }

            .error-boundary-stack {
              margin-top: 1rem;
            }

            .error-boundary-stack h3 {
              font-size: 0.9rem;
              color: #666;
              margin: 1rem 0 0.5rem 0;
            }

            .error-boundary-stack pre {
              background: white;
              padding: 1rem;
              border-radius: 4px;
              overflow-x: auto;
              font-size: 0.85rem;
              line-height: 1.4;
              color: #d63031;
              border: 1px solid #ddd;
            }

            .error-boundary-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              margin-top: 2rem;
            }

            .error-boundary-actions .btn {
              padding: 0.75rem 1.5rem;
              border: none;
              border-radius: 6px;
              font-size: 1rem;
              cursor: pointer;
              transition: all 0.3s ease;
              font-weight: 600;
            }

            .error-boundary-actions .btn-primary {
              background: #667eea;
              color: white;
            }

            .error-boundary-actions .btn-primary:hover {
              background: #764ba2;
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .error-boundary-actions .btn-secondary {
              background: #f5f5f5;
              color: #333;
            }

            .error-boundary-actions .btn-secondary:hover {
              background: #e0e0e0;
              transform: translateY(-2px);
            }

            .error-boundary-count {
              margin-top: 1.5rem;
              padding: 0.5rem 1rem;
              background: #fff3cd;
              border: 1px solid #ffc107;
              border-radius: 6px;
              color: #856404;
              font-size: 0.9rem;
            }

            @media (max-width: 768px) {
              .error-boundary-content {
                padding: 2rem;
              }

              .error-boundary-content h1 {
                font-size: 1.5rem;
              }

              .error-boundary-actions {
                flex-direction: column;
              }

              .error-boundary-actions .btn {
                width: 100%;
              }
            }
          `}</style>
        </div>
      );
    }

    // Render children normally when there's no error
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;