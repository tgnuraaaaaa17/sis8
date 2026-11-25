import { Link } from 'react-router';

export default function OfflinePage() {
  return <section className="offline-page" aria-labelledby="offline-title">
    <div className="offline-page__icon" aria-hidden="true">⛰️</div>
    <p className="app__eyebrow">Kazakhstan Places</p>
    <h1 id="offline-title">You’re offline</h1>
    <p>Your saved places and data already loaded on this device remain available. Reconnect to load anything new.</p>
    <div className="hero__actions">
      <button className="btn btn--primary" onClick={() => window.location.reload()}>Retry connection</button>
      <Link className="btn" to="/">Back to home</Link>
    </div>
  </section>;
}
