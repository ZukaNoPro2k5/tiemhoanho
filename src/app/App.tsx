import { ShopScene } from '../components/ShopScene';
import { shellCopy } from '../content/shell';

export function App() {
  return (
    <main className="shop-shell">
      <header className="brand">
        <p className="eyebrow">{shellCopy.eyebrow}</p>
        <h1>{shellCopy.title}</h1>
        <p className="brand-subtitle">{shellCopy.subtitle}</p>
      </header>
      <ShopScene />
      <section className="welcome" aria-labelledby="welcome-title">
        <h2 id="welcome-title">{shellCopy.welcome}</h2>
        <p>{shellCopy.introduction}</p>
      </section>
      <aside className="preparation">
        <p className="preparation-status" role="status">
          <span className="status-dot" aria-hidden="true" />
          {shellCopy.status}
        </p>
        <p className="preparation-note">{shellCopy.preparation}</p>
      </aside>
      <footer className="shop-footer">{shellCopy.footer}</footer>
    </main>
  );
}
