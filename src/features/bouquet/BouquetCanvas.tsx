import { useCallback, useLayoutEffect, useRef } from 'react';
import { ContainerArt } from '../../components/art/ContainerArt';
import { bouquetContext } from '../../content/bouquetRules';
import { designerCopy } from '../../content/designer';
import type { Id } from '../../domain/catalog';
import {
  anchorFor,
  clampToRegion,
  stemPathD,
} from '../../domain/bouquet/geometry';
import type { BouquetDraft, Point } from '../../domain/bouquet/types';
import { StemLayer } from './StemLayer';
import { StemView } from './StemView';
import { useStemDrag } from './useStemDrag';

interface BouquetCanvasProps {
  draft: BouquetDraft;
  selectedId: Id | null;
  onSelect: (instanceId: Id | null) => void;
  onMove: (instanceId: Id, point: Point) => void;
}

export function BouquetCanvas({
  draft,
  selectedId,
  onSelect,
  onMove,
}: BouquetCanvasProps) {
  const { rules, profiles, flowers } = bouquetContext;
  const profile = profiles[draft.arrangementStyle];
  const planeRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef(new Map<Id, SVGPathElement>());
  const draftRef = useRef(draft);
  useLayoutEffect(() => {
    draftRef.current = draft;
  });

  const setPath = (instanceId: Id, head: Point) => {
    pathRefs.current
      .get(instanceId)
      ?.setAttribute('d', stemPathD(head, anchorFor(head, profile.anchor)));
  };

  const drag = useStemDrag({
    planeRef,
    thresholdPx: rules.dragThresholdPx,
    clamp: (point) => clampToRegion(point, profile.region),
    onPreview: setPath,
    onCommit: onMove,
    onCancel: (instanceId) => {
      const stem = draftRef.current.stems.find(
        (item) => item.instanceId === instanceId,
      );
      if (stem) setPath(instanceId, stem);
    },
  });

  const onNudge = useCallback(
    (instanceId: Id, dx: number, dy: number) => {
      const stem = draftRef.current.stems.find(
        (item) => item.instanceId === instanceId,
      );
      if (!stem) return;
      onMove(instanceId, {
        x: stem.x + dx * rules.keyboardStep,
        y: stem.y + dy * rules.keyboardStep,
      });
    },
    [onMove, rules.keyboardStep],
  );
  const onSelectStem = useCallback(
    (instanceId: Id) => onSelect(instanceId),
    [onSelect],
  );

  return (
    <div
      ref={planeRef}
      className="bouquet-plane"
      role="group"
      aria-label={designerCopy.planeLabel}
      data-style={draft.arrangementStyle}
      onClick={(event) => {
        if (event.target === event.currentTarget) onSelect(null);
      }}
    >
      <ContainerArt
        style={draft.arrangementStyle}
        wrapId={draft.wrapId}
        layer="back"
      />
      <StemLayer
        stems={draft.stems}
        anchor={profile.anchor}
        pathRefs={pathRefs}
      />
      <ContainerArt
        style={draft.arrangementStyle}
        wrapId={draft.wrapId}
        layer="front"
      />
      {draft.stems.map((stem, index) => {
        const flower = flowers[stem.flowerId];
        if (!flower) return null;
        return (
          <StemView
            key={stem.instanceId}
            stem={stem}
            assetId={flower.assetId}
            label={designerCopy.stemLabel(flower.nameVi, index + 1)}
            selected={stem.instanceId === selectedId}
            drag={drag}
            onSelect={onSelectStem}
            onNudge={onNudge}
          />
        );
      })}
      {draft.stems.length === 0 && (
        <p className="plane-hint">{designerCopy.emptyHint}</p>
      )}
    </div>
  );
}
