import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const PaymentResultPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const status  = params.get('status');
    const rawId   = params.get('orderId') || '';
    const orderId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(rawId) ? rawId : null;

    const target = status === 'success' && orderId
      ? `/order-success/${orderId}`
      : '/order-cancel';

    if (window.top !== window.self) {
      // PayTR iframe içinden üst pencereyi yönlendir
      window.top.location.href = target;
    } else {
      navigate(target, { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-deep-black flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="text-indigo animate-spin" size={48} strokeWidth={1} />
        <div className="absolute inset-0 bg-indigo/20 blur-xl rounded-full animate-pulse" />
      </div>
      <p className="text-white/25 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
        Processing Payment
      </p>
    </div>
  );
};

export default PaymentResultPage;
