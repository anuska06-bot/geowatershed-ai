import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="py-12 px-4 max-w-xl mx-auto text-center">
          <div className="bg-[#181f23] border border-amber-500/40 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold font-mono text-[#f1f0eb]">
                {this.props.fallbackTitle || 'Telemetry View Recovery Protocol'}
              </h3>
              <p className="text-xs text-[#9ba3a7]">
                A rendering anomaly occurred while processing hydrological GIS datasets.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-[#121619] border border-[#2c373d] p-3 rounded-md font-mono text-[11px] text-rose-400 overflow-x-auto max-h-32">
                {this.state.error.message || 'Unknown runtime exception'}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Recover &amp; Retry
              </button>
              {this.props.onReset && (
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    this.props.onReset?.();
                  }}
                  className="px-4 py-2 rounded-lg bg-[#222a2e] hover:bg-[#2c373d] text-[#f1f0eb] border border-[#3d4b52] text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Home className="w-3.5 h-3.5" />
                  Return to Overview
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
