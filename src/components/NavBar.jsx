import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/places', label: 'Places' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/about', label: 'About' },
];

const linkClass = ({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`;

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      setOpen(false);
    } catch (error) {
      console.error('Could not sign out:', error);
    }
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <img src="favicon.svg" alt="" width="28" height="28" />
          Kazakhstan Places
        </Link>
        <button className="navbar__toggle" type="button" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen((value) => !value)}>
          <span className="navbar__toggle-icon" aria-hidden="true">{open ? '×' : '☰'}</span>
          <span className="sr-only">{open ? 'Close navigation' : 'Open navigation'}</span>
        </button>

        <nav id="main-navigation" className={`navbar__links${open ? ' navbar__links--open' : ''}`} aria-label="Main navigation">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <span className="navbar__link navbar__user" title={user.email}>{user.displayName || user.email}</span>
              <button type="button" className="btn btn--small navbar__login" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn--small navbar__login" onClick={() => setOpen(false)}>
              Log in
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
