import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import { supabase } from '../lib/supabase';

const GlobalSignalReceiver = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showApprovalToast, setShowApprovalToast] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    // Admin kullanıcısını bu dinleyiciden hariç tut
    const isAdmin = user.email === 'hello@erpolart.com';
    if (isAdmin) return;

    // Admin panelindeyken çalışmasın
    if (location.pathname.startsWith('/admin')) return;

    const uniqueChannelName = `global_approvals_${Math.random().toString(36).substring(2, 15)}`;
    const userEmail = user.email.toLowerCase();


    const channel = supabase
      .channel(uniqueChannelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `email=eq.${userEmail}`
        },
        (payload) => {
          if (payload.new.status === 'active' && !location.pathname.includes('/order-success')) {
            setShowApprovalToast(true);
            setTimeout(() => {
              setShowApprovalToast(false);
              navigate(`/order-success/${payload.new.id}`);
            }, 3500);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.email, navigate, location.pathname]);

  return (
    <AnimatePresence>
      {showApprovalToast && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-outfit"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#0f0f18] border border-white/10 rounded-[2.5rem] p-10 max-w-lg w-full shadow-[0_0_80px_rgba(92,115,255,0.15)] flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 blur-[60px] rounded-full -translate-x-1/2 translate-y-1/2" />
            
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 relative z-10">
               <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-[spin_4s_linear_infinite]" />
               <div className="absolute inset-2 rounded-full border border-emerald-500/40 animate-[spin_3s_linear_infinite_reverse]" />
               <CheckCircle2 size={40} className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </div>

            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4 relative z-10">{t('globalSignal.title')}</h2>
            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 relative z-10">
              {t('globalSignal.message')}
            </p>

            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden relative z-10">
               <motion.div 
                 initial={{ width: "0%" }} 
                 animate={{ width: "100%" }} 
                 transition={{ duration: 3.5, ease: "linear" }}
                 className="h-full bg-indigo rounded-full shadow-[0_0_10px_rgba(92,115,255,0.8)] relative"
               >
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_1s_infinite] -translate-x-full" />
               </motion.div>
            </div>
            <p className="text-[9px] font-black text-indigo uppercase tracking-[0.3em] mt-4 animate-pulse relative z-10">{t('globalSignal.connecting')}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSignalReceiver;
