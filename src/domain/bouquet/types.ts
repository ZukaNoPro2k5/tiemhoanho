import type { FlowerDefinition, FlowerRole, Id } from '../catalog';

export type ArrangementStyle = 'bouquet' | 'basket';
export type StemSize = 'small' | 'medium' | 'large';
export type Freshness = 0 | 1 | 2 | 3;

export interface Point {
  x: number;
  y: number;
}

export interface PlacedStem {
  instanceId: Id;
  flowerId: Id;
  x: number;
  y: number;
  rotationDeg: number;
  scale: number;
  size: StemSize;
  zIndex: number;
  freshnessAtUse: Freshness;
}

export interface BouquetDraft {
  arrangementStyle: ArrangementStyle;
  stems: PlacedStem[];
  nextStemSeq: number;
  wrapId?: Id;
  ribbonId?: Id;
  cardId?: Id;
}

/** Allowed head area: an ellipse in plane units, cut off below yMax. */
export interface Region {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  yMax: number;
}

export type StemAnchor =
  | { kind: 'point'; x: number; y: number }
  | { kind: 'rim'; y: number; x0: number; x1: number };

export interface StyleProfile {
  style: ArrangementStyle;
  anchor: StemAnchor;
  region: Region;
  fanAngleDeg: number;
  slots: Record<FlowerRole, readonly Point[]>;
}

export interface BouquetRules {
  maxStems: number;
  minStemsToDeliver: number;
  rotateStepDeg: number;
  maxRotationDeg: number;
  sizeMultiplier: Record<StemSize, number>;
  roleBaseScale: Record<FlowerRole, number>;
  zBand: Record<FlowerRole, number>;
  minHeadDistance: number;
  positionJitter: number;
  rotationJitterDeg: number;
  /** Plane width divided by height (4:5). */
  planeAspect: number;
  undoLimit: number;
  dragThresholdPx: number;
  keyboardStep: number;
  freshnessAtUse: Freshness;
}

export interface BouquetContext {
  rules: BouquetRules;
  profiles: Record<ArrangementStyle, StyleProfile>;
  flowers: Readonly<Record<Id, FlowerDefinition>>;
}
