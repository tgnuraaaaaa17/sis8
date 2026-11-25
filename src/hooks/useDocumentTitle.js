import { useEffect } from 'react';

/** Sets the browser tab title for the current page. */
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Kazakhstan Places` : 'Kazakhstan Places';
  }, [title]);
}
