import { memo, type RefObject } from 'react';
import type { Id } from '../../domain/catalog';
import { anchorFor, stemPathD } from '../../domain/bouquet/geometry';
import type { PlacedStem, StemAnchor } from '../../domain/bouquet/types';

interface StemLayerProps {
  stems: readonly PlacedStem[];
  anchor: StemAnchor;
  pathRefs: RefObject<Map<Id, SVGPathElement>>;
}

/** Stems from each head to the binding point or basket rim. */
export const StemLayer = memo(function StemLayer({
  stems,
  anchor,
  pathRefs,
}: StemLayerProps) {
  return (
    <svg
      className="plane-layer"
      viewBox="0 0 100 125"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {stems.map((stem) => (
        <path
          key={stem.instanceId}
          ref={(element) => {
            if (element) pathRefs.current.set(stem.instanceId, element);
            else pathRefs.current.delete(stem.instanceId);
          }}
          d={stemPathD(stem, anchorFor(stem, anchor))}
          className="art-stem"
        />
      ))}
    </svg>
  );
});
