import { designerCopy } from '../../content/designer';
import { canResize, reorderNeighbor } from '../../domain/bouquet/draft';
import type { DraftAction } from '../../domain/bouquet/draft';
import type { PlacedStem } from '../../domain/bouquet/types';

interface StemActionsProps {
  stem: PlacedStem;
  stems: readonly PlacedStem[];
  dispatch: (action: DraftAction) => void;
}

export function StemActions({ stem, stems, dispatch }: StemActionsProps) {
  const { instanceId } = stem;
  const { actions } = designerCopy;
  const buttons: { label: string; action: DraftAction; disabled?: boolean }[] =
    [
      {
        label: actions.rotateLeft,
        action: { type: 'rotate', instanceId, direction: -1 },
      },
      {
        label: actions.rotateRight,
        action: { type: 'rotate', instanceId, direction: 1 },
      },
      {
        label: actions.smaller,
        action: { type: 'resize', instanceId, direction: -1 },
        disabled: !canResize(stem, -1),
      },
      {
        label: actions.larger,
        action: { type: 'resize', instanceId, direction: 1 },
        disabled: !canResize(stem, 1),
      },
      {
        label: actions.forward,
        action: { type: 'reorder', instanceId, direction: 'forward' },
        disabled: !reorderNeighbor(stems, instanceId, 'forward'),
      },
      {
        label: actions.backward,
        action: { type: 'reorder', instanceId, direction: 'backward' },
        disabled: !reorderNeighbor(stems, instanceId, 'backward'),
      },
      { label: actions.remove, action: { type: 'remove', instanceId } },
    ];

  return (
    <div
      className="context-row stem-actions"
      role="toolbar"
      aria-label={designerCopy.actionsLabel}
    >
      {buttons.map(({ label, action, disabled }) => (
        <button
          key={label}
          type="button"
          className="action-chip"
          disabled={disabled}
          onClick={() => dispatch(action)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
