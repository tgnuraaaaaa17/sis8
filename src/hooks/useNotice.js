import { useEffect, useState } from 'react';

/** A notification that hides itself after 4 seconds (the timer is cleaned up). */
export default function useNotice() {
  const [notice, setNotice] = useState(null); // { type: 'success' | 'error', text }

  useEffect(() => {
    if (!notice) return undefined;

    const timerId = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timerId);
  }, [notice]);

  return {
    notice,
    showNotice: (type, text) => setNotice({ type, text }),
    dismissNotice: () => setNotice(null),
  };
}
