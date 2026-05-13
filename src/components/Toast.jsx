import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ── Global toast queue ──
let toastListeners = [];
let toastId = 0;

export const toast = {
  success: (msg, opts) => emit('success', msg, opts),
  error:   (msg, opts) => emit('error',   msg, opts),
  warning: (msg, opts) => emit('warning', msg, opts),
  info:    (msg, opts) => emit('info',    msg, opts),
};

function emit(type, message, opts = {}) {
  const id = ++toastId;
  toastListeners.forEach(fn => fn({ id, type, message, duration: opts.duration ?? 4000 }));
}

const ICONS = {
  success: <CheckCircle2 size={16} />,
  error:   <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info:    <Info size={16} />,
};

const STYLES = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  error:   'border-red-500/30 bg-red-500/10 text-red-400',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  info:    'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
};

function ToastItem({ id, type, message, onRemove }) {
  useEffect(() => {
    // auto-remove handled by container; nothing to do here
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl max-w-sm text-sm ${STYLES[type]}`}
    >
      <span className="mt-0.5 shrink-0">{ICONS[type]}</span>
      <span className="flex-1 leading-snug text-white/90">{message}</span>
      <button
        onClick={() => onRemove(id)}
        aria-label="Bildirimi kapat"
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity ml-1"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (t) => {
      setToasts(prev => [...prev, t]);
      timers.current[t.id] = setTimeout(() => remove(t.id), t.duration);
    };
    toastListeners.push(handler);
    return () => {
      toastListeners = toastListeners.filter(fn => fn !== handler);
    };
  }, [remove]);

  return createPortal(
    <div className="fixed bottom-24 right-6 z-[99999] flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem {...t} onRemove={remove} />
          </div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
