export function PageHeader({ eyebrow, title }) {
  return (
    <header className="page-header compact">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
    </header>
  );
}
