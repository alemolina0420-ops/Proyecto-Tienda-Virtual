import { Component, type ReactNode } from 'react';

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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Algo salió mal</h2>
            <p className="text-slate-400 mb-4">
              Hubo un error al cargar la aplicación. Intenta recargar la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:brightness-110 transition-all"
            >
              Recargar página
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-slate-500 cursor-pointer text-sm">Ver detalles del error</summary>
                <pre className="mt-2 p-4 bg-slate-900 rounded-lg text-red-400 text-xs overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
