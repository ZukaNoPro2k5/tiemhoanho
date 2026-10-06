import { designerCopy } from '../../content/designer';
import { wraps } from '../../content/wraps';
import type { Id } from '../../domain/catalog';

interface WrapPickerProps {
  wrapId: Id | undefined;
  onChange: (wrapId: Id) => void;
}

export function WrapPicker({ wrapId, onChange }: WrapPickerProps) {
  return (
    <div
      className="context-row"
      role="group"
      aria-label={designerCopy.wrapLabel}
    >
      {wraps.map((wrap) => (
        <button
          key={wrap.id}
          type="button"
          className="wrap-swatch"
          data-wrap={wrap.id}
          aria-pressed={wrap.id === wrapId}
          aria-label={wrap.nameVi}
          onClick={() => onChange(wrap.id)}
        >
          <span className="swatch-dot" aria-hidden="true" />
          {designerCopy.wrapShort[wrap.id] ?? wrap.nameVi}
        </button>
      ))}
    </div>
  );
}
