import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import gsap from 'gsap';

// ---------------------------------------------------------------
// Toasts via useContext — the same pattern as AuthContext.
// The problem it solves: ANY component, at ANY depth, needs to say
// "show this message". Passing a showToast prop down five levels
// (prop drilling) is the thing context exists to delete.
// ---------------------------------------------------------------
const ToastContext = createContext(null);

// Custom hook = the public API of this file. Components import THIS,
// never the context object itself — so we can change the internals freely.
export const useToast = () => useContext(ToastContext);

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // A ref, not state: bumping a counter must NOT cause a re-render,
  // and we only need a value that is unique, never one we display.
  const nextId = useRef(0);

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, type = 'info') => {
    const id = nextId.current++;
    // Functional update: React may batch several toasts in one tick, and
    // `[...toasts, new]` would read a stale array and drop one.
    setToasts((list) => [...list, { id, message, type }]);
    setTimeout(() => remove(id), AUTO_DISMISS_MS);
  }, [remove]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// One toast. Split out so each gets its own ref and its own animation.
function Toast({ message, type, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    // fromTo, not from: StrictMode mounts effects TWICE in development.
    // A bare `from` would read the already-animated values as the "to" state
    // on the second run and leave the toast stuck invisible. fromTo states
    // both ends explicitly, so replaying it is harmless.
    const tween = gsap.fromTo(
      ref.current,
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
    );
    return () => tween.kill();   // cleanup — never leave a tween running on an unmounted node
  }, []);

  return (
    <div ref={ref} className={`toast toast-${type}`} onClick={onClose}>
      {message}
    </div>
  );
}
