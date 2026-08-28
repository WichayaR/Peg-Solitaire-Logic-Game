import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = 'info') => {
    const id = nextId++;
    setToasts((arr) => [...arr, { id, message, type }]);
    setTimeout(() => {
      setToasts((arr) => arr.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed top-12 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              px-5 py-3 rounded-2xl shadow-soft-lg text-sm font-bold ring-2 backdrop-blur
              animate-float-up
              ${
                t.type === 'error'
                  ? 'bg-gradient-to-r from-coral to-rose text-white ring-rose-dark'
                  : t.type === 'success'
                    ? 'bg-gradient-to-r from-mint-dark to-emerald-400 text-white ring-emerald-500'
                    : 'bg-white/95 text-purple-800 ring-lavender shadow-soft'
              }
            `}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}