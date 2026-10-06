import { useState } from 'react';
import { ShopScene } from '../components/ShopScene';
import { designerCopy } from '../content/designer';
import { shellCopy } from '../content/shell';
import { BouquetDesigner } from '../features/bouquet/BouquetDesigner';

type Screen = 'shop' | 'designer';

export function App() {
  const [screen, setScreen] = useState<Screen>('shop');

  if (screen === 'designer') {
    return <BouquetDesigner onBack={() => setScreen('shop')} />;
  }

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
        <button
          type="button"
          className="primary-action"
          onClick={() => setScreen('designer')}
        >
          {designerCopy.enter}
        </button>
      </aside>
      <footer className="shop-footer">{shellCopy.footer}</footer>
    </main>
  );
}
