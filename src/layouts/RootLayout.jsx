import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import NavBar from '../components/NavBar.jsx';
import StateMessage from '../components/StateMessage.jsx';
import PwaStatus from '../components/PwaStatus.jsx';

/** RootLayout — NavBar + the current page (<Outlet />) + footer. */
export default function RootLayout() {
  const { pathname } = useLocation();

  // A new page starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <NavBar />
      <PwaStatus />

      <main className="app__main">
        {/* Lazy-loaded pages show this fallback while their code is downloaded. */}
        <Suspense fallback={<StateMessage variant="info" title="Loading the page…" />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="app__footer">
        <p>Data comes from the fake API in <code>src/api/fakeApi.js</code> and is stored in localStorage.</p>
      </footer>
    </div>
  );
}
