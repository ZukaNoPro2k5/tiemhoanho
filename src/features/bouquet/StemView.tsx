import { memo, type KeyboardEvent } from 'react';
import { FlowerArt } from '../../components/art/FlowerArt';
import type { Id } from '../../domain/catalog';
import type { PlacedStem } from '../../domain/bouquet/types';
import type { StemDrag } from './useStemDrag';

interface StemViewProps {
  stem: PlacedStem;
  assetId: Id;
  label: string;
  selected: boolean;
  drag: StemDrag;
  onSelect: (instanceId: Id) => void;
  onNudge: (instanceId: Id, dx: number, dy: number) => void;
}

const arrowSteps: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

export const StemView = memo(function StemView({
  stem,
  assetId,
  label,
  selected,
  drag,
  onSelect,
  onNudge,
}: StemViewProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = arrowSteps[event.key];
    if (!step) return;
    event.preventDefault();
    onNudge(stem.instanceId, step[0], step[1]);
  };

  return (
    <button
      type="button"
      className="stem-head"
      data-stem-id={stem.instanceId}
      aria-label={label}
      aria-pressed={selected}
      style={{
        left: `${stem.x * 100}%`,
        top: `${stem.y * 100}%`,
        zIndex: stem.zIndex,
        transform: `translate(-50%, -50%) rotate(${stem.rotationDeg}deg) scale(${stem.scale})`,
      }}
      onPointerDown={(event) => drag.down(event, stem)}
      onPointerMove={drag.move}
      onPointerUp={drag.up}
      onPointerCancel={drag.cancel}
      onClick={() => {
        if (!drag.consumeDragClick()) onSelect(stem.instanceId);
      }}
      onKeyDown={onKeyDown}
    >
      <FlowerArt assetId={assetId} />
    </button>
  );
});
