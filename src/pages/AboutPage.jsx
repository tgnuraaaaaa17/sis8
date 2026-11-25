import { Link } from 'react-router';
import PageHeader from '../components/PageHeader.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

const ROUTES = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/places', 'Places list with search, filters, sorting and pagination'],
  ['/places/:id', 'Details of one place'],
  ['/dashboard', 'Statistics calculated from the API data'],
  ['/login', 'Firebase sign-in with Google or email and password'],
  ['*', 'Not found page'],
];

export default function AboutPage() {
  useDocumentTitle('About');

  return (
    <>
      <PageHeader
        title="About the project"
        text="Kazakhstan Places is a small React application for collecting sights worth a trip."
      />

      <div className="about-grid">
        <section className="panel panel--flat">
          <h2 className="panel__title">What it does</h2>
          <p className="panel__description">
            You can search places, filter them by category, region and status, open a full record,
            add new places, edit or remove them and mark the ones you have visited. The dashboard
            turns the same data into statistics.
          </p>
          <p className="panel__description">
            Every request goes through a fake API with random delays and occasional errors, so all
            pages handle loading, error and empty states.
          </p>
        </section>

        <section className="panel panel--flat">
          <h2 className="panel__title">How it is built</h2>
          <ul className="plain-list">
            <li>React 18 and React Router: nested routes, dynamic URLs, URL search parameters.</li>
            <li>React.lazy and Suspense: pages are downloaded when they are opened.</li>
            <li>A service layer (services/service.js) and custom hooks for data loading.</li>
            <li>Stale responses are ignored, so a slow request never overwrites a newer one.</li>
          </ul>
        </section>

        <section className="panel panel--flat about-grid__wide">
          <h2 className="panel__title">Routes</h2>
          <dl className="details">
            {ROUTES.map(([path, text]) => (
              <div className="details__row" key={path}>
                <dt>
                  <code>{path}</code>
                </dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
          <div className="panel__actions">
            <Link to="/places" className="btn btn--primary">
              Browse places
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
