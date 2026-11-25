import { Link } from 'react-router';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');

  return (
    <section className="not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">This page does not exist</h1>
      <p className="not-found__text">The address may be mistyped, or the page was moved.</p>
      <div className="not-found__actions">
        <Link to="/" className="btn btn--primary">
          Go to the home page
        </Link>
        <Link to="/places" className="btn">
          Browse places
        </Link>
      </div>
    </section>
  );
}
