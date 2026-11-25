/** PageHeader — page title with an optional description and actions. */
export default function PageHeader({ title, text, children }) {
  return (
    <div className="page-head">
      <div>
        <h1 className="page-head__title">{title}</h1>
        {text ? <p className="page-head__text">{text}</p> : null}
      </div>
      {children ? <div className="page-head__actions">{children}</div> : null}
    </div>
  );
}
