import { Link } from 'react-router';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

const SHORTCUTS = [
  {
    to: '/places',
    title: 'Browse places',
    text: 'Search, filter and sort sights from every region.',
  },
  {
    to: '/dashboard',
    title: 'Open the dashboard',
    text: 'Ratings, prices and visit progress at a glance.',
  },
  {
    to: '/about',
    title: 'About the project',
    text: 'How the app is built and where the data comes from.',
  },
];

export default function HomePage() {
  useDocumentTitle('');

  return (
    <>
      <section className="hero">
        <div className="hero__text">
          <h1 className="hero__title">Plan your trips across Kazakhstan</h1>
          <p className="hero__lead">
            Canyons, mountain lakes, mausoleums and modern cities in one list. Pick what you want to
            see, check the details and mark the places you have already visited.
          </p>
          <div className="hero__actions">
            <Link to="/places" className="btn btn--primary">
              Browse places
            </Link>
            <Link to="/dashboard" className="btn">
              Open the dashboard
            </Link>
          </div>
        </div>

        <img className="hero__image" src="images/tau.svg" alt="Snowy mountains above a lake" />
      </section>

      <section className="shortcuts" aria-label="Where to go next">
        {SHORTCUTS.map((shortcut) => (
          <Link key={shortcut.to} to={shortcut.to} className="shortcut">
            <span className="shortcut__title">{shortcut.title}</span>
            <span className="shortcut__text">{shortcut.text}</span>
          </Link>
        ))}
      </section>
    </>
  );
}
