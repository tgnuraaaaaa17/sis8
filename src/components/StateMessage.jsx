/**
 * StateMessage — loading / error / empty күйлерін көрсетуге арналған
 * әмбебап блок (тапсырманың «Handle loading, error, empty, and success states»
 * талабының көрінуші).
 */
export default function StateMessage({ variant = 'info', title, text, actionLabel, onAction }) {
  return (
    <div className={`state state--${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      <span className="state__icon" aria-hidden="true">
        {variant === 'error' ? '!' : variant === 'empty' ? '∅' : 'i'}
      </span>
      <div className="state__content">
        <p className="state__title">{title}</p>
        {text ? <p className="state__text">{text}</p> : null}
      </div>
      {actionLabel && onAction ? (
        <button type="button" className="btn btn--small" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
