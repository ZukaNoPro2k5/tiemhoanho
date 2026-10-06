import { FlowerArt } from '../../components/art/FlowerArt';
import { designerCopy } from '../../content/designer';
import { flowers } from '../../content/flowers';
import type { Id } from '../../domain/catalog';
import { usedCount } from '../../domain/bouquet/draft';
import type { BouquetDraft } from '../../domain/bouquet/types';

interface FlowerTrayProps {
  draft: BouquetDraft;
  disabled: boolean;
  onAdd: (flowerId: Id) => void;
}

export function FlowerTray({ draft, disabled, onAdd }: FlowerTrayProps) {
  return (
    <ul className="flower-tray" aria-label={designerCopy.trayLabel}>
      {flowers.map((flower) => {
        const used = usedCount(draft, flower.id);
        return (
          <li key={flower.id}>
            <button
              type="button"
              className="tray-card"
              disabled={disabled}
              onClick={() => onAdd(flower.id)}
            >
              <FlowerArt assetId={flower.assetId} />
              <span className="tray-name">{flower.nameVi}</span>
              {used > 0 && (
                <span className="tray-count">
                  {designerCopy.usedCount(used)}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
