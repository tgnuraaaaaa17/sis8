import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import RootLayout from './layouts/RootLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Lazy-loaded pages: each one becomes a separate JavaScript chunk.
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const PlacesPage = lazy(() => import('./pages/PlacesPage.jsx'));
const PlaceDetailsPage = lazy(() => import('./pages/PlaceDetailsPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const OfflinePage = lazy(() => import('./pages/OfflinePage.jsx'));

/** App only describes the routes. */
export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="places">
          <Route index element={<PlacesPage />} />
          <Route path=":id" element={<PlaceDetailsPage />} />
        </Route>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="offline" element={<OfflinePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
