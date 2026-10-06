import type { Id } from '../../domain/catalog';
import type { ArrangementStyle } from '../../domain/bouquet/types';

/** Temporary wrap and basket layers in the 100x125 plane viewBox. */
const wrapClass: Record<Id, string> = {
  'wrap-cream': 'art-wrap-cream',
  'wrap-blush': 'art-wrap-blush',
  'wrap-kraft': 'art-wrap-kraft',
};

interface ContainerArtProps {
  style: ArrangementStyle;
  wrapId: Id | undefined;
  layer: 'back' | 'front';
}

export function ContainerArt({ style, wrapId, layer }: ContainerArtProps) {
  return (
    <svg
      className={`plane-layer plane-${layer}`}
      viewBox="0 0 100 125"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {style === 'bouquet' ? (
        <WrapLayer
          layer={layer}
          className={wrapClass[wrapId ?? ''] ?? 'art-wrap-cream'}
        />
      ) : (
        <BasketLayer layer={layer} />
      )}
    </svg>
  );
}

function WrapLayer({
  layer,
  className,
}: {
  layer: 'back' | 'front';
  className: string;
}) {
  return layer === 'back' ? (
    <path d="M14 46L50 112L86 46Q50 30 14 46Z" className={className} />
  ) : (
    <g className={className}>
      <path d="M26 72L50 118L74 72Q50 84 26 72Z" />
      <path d="M44 104H56L54 110H46Z" className="art-tie" />
    </g>
  );
}

function BasketLayer({ layer }: { layer: 'back' | 'front' }) {
  return layer === 'back' ? (
    <path d="M18 78Q50 18 82 78" className="art-basket-handle" fill="none" />
  ) : (
    <g>
      <path d="M16 76H84L76 112Q50 120 24 112Z" className="art-basket" />
      <path d="M20 88H80M23 100H77" className="art-basket-weave" />
    </g>
  );
}
