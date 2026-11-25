import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useAuth } from '../context/AuthContext.jsx';
import { firebaseConfigured } from '../firebase.js';

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const { login, register, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useDocumentTitle(isRegistering ? 'Create account' : 'Log in');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }

      navigate('/dashboard');
    } catch (err) {
      const messages = {
        'auth/email-already-in-use': 'This email already has an account.',
        'auth/invalid-email': 'Enter a valid email address.',
        'auth/invalid-credential': 'Email or password is incorrect.',
        'auth/weak-password': 'Choose a stronger password (at least 6 characters).',
        'auth/popup-closed-by-user': 'Google sign-in was canceled.',
      };

      setError(messages[err.code] || 'Authentication failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleLogin() {
    setError('');
    setBusy(true);

    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.code === 'auth/popup-closed-by-user'
          ? 'Google sign-in was canceled.'
          : 'Google sign-in failed. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (user) {
    return (
      <div className="auth">
        <section className="auth__card">
          <h1 className="auth__title">You are signed in</h1>
          <p className="auth__text">{user.email}</p>
          <Link className="btn btn--primary auth__submit" to="/dashboard">
            Go to dashboard
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h1 className="auth__title">
          {isRegistering ? 'Create account' : 'Log in'}
        </h1>
        <p className="auth__text">
          {isRegistering
            ? 'Create an account to keep your visited places.'
            : 'Sign in to keep your visited places in your own account.'}
        </p>

        {!firebaseConfigured && (
          <p className="notice notice--error" role="alert">
            Google sign-in is not configured for this deployment yet. Add the Firebase app settings to its GitHub Actions variables.
          </p>
        )}

        {error && (
          <p className="notice notice--error" role="alert">
            {error}
          </p>
        )}

        <label className="field">
          <span className="field__label">Email</span>
          <input
            className="field__input"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span className="field__label">Password</span>
          <input
            className="field__input"
            type="password"
            autoComplete={isRegistering ? 'new-password' : 'current-password'}
            placeholder="At least 6 characters"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="btn btn--primary auth__submit"
          disabled={busy}
        >
          {busy
            ? 'Please wait…'
            : isRegistering
              ? 'Create account'
              : 'Log in'}
        </button>

        <button
          type="button"
          className="btn auth__submit"
          onClick={handleGoogleLogin}
          disabled={busy || !firebaseConfigured}
        >
          Continue with Google
        </button>

        <p className="auth__footer">
          {isRegistering ? 'Already have an account? ' : 'New here? '}
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
          >
            {isRegistering ? 'Log in' : 'Create an account'}
          </button>
        </p>

        <p className="auth__footer">
          <Link to="/">Back to the home page</Link>
        </p>
      </form>
    </div>
  );
}
