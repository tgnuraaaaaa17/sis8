import { useEffect, useState } from 'react';

export default function PwaStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [cachedApiData, setCachedApiData] = useState(false);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    const handleServiceWorkerMessage = (event) => {
      if (event.data?.type === 'PUBLIC_DATA_CACHE') setCachedApiData(true);
      if (event.data?.type === 'PUBLIC_DATA_NETWORK') setCachedApiData(false);
    };
    const handleDataSource = (event) => setCachedApiData(Boolean(event.detail?.cached));
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    window.addEventListener('sis8:public-data-source', handleDataSource);
    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

    navigator.serviceWorker?.ready.then((ready) => {
      const check = () => setWaitingWorker(ready.waiting && navigator.serviceWorker.controller ? ready.waiting : null);
      check();
      ready.addEventListener('updatefound', () => {
        const installing = ready.installing;
        installing?.addEventListener('statechange', check);
      });
    }).catch(() => {});

    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
      window.removeEventListener('sis8:public-data-source', handleDataSource);
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, []);

  const applyUpdate = () => {
    if (!waitingWorker) return;
    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true });
    waitingWorker.postMessage('SKIP_WAITING');
  };

  return <div className={`pwa-status ${online ? 'pwa-status--online' : 'pwa-status--offline'}`} role="status" aria-live="polite">
    <span className="pwa-status__dot" />
    <span>{online ? 'Online' : 'Offline · viewing data saved on this device'}</span>
    {cachedApiData && <span className="pwa-status__cache">Viewing cached public data</span>}
    {!online && <a href="#/offline">Offline help</a>}
    {waitingWorker && <><span className="pwa-status__update">A new version is ready.</span><button className="btn btn--small" type="button" onClick={applyUpdate}>Update now</button></>}
  </div>;
}
