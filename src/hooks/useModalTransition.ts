import { useEffect, useState } from 'react';

/** Keeps the modal mounted after `show` is false so exit transitions can finish. */
export function useModalTransition(show: boolean, exitDurationMs = 340) {
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const t = window.setTimeout(() => setShouldRender(false), exitDurationMs);
    return () => clearTimeout(t);
  }, [show, exitDurationMs]);

  return { shouldRender, visible };
}
