import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-[#0c0c16] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Bir şeyler ters gitti</h2>
          <p className="text-gray-400 text-sm mb-6">
            Beklenmedik bir hata oluştu. Sayfayı yenileyerek tekrar deneyebilirsiniz.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <RotateCcw size={15} />
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }
}
