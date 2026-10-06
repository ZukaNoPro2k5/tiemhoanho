import type {
  BouquetContext,
  BouquetRules,
  StyleProfile,
} from '../domain/bouquet/types';
import { flowersById } from './flowers';

/** Every tunable Bouquet Designer number lives here. */
export const bouquetRules: BouquetRules = {
  maxStems: 9,
  minStemsToDeliver: 3,
  rotateStepDeg: 15,
  maxRotationDeg: 60,
  sizeMultiplier: { small: 0.85, medium: 1, large: 1.15 },
  roleBaseScale: { focal: 1, secondary: 0.85, filler: 0.75, foliage: 1.1 },
  zBand: { foliage: 100, filler: 200, secondary: 300, focal: 400 },
  minHeadDistance: 0.1,
  positionJitter: 0.015,
  rotationJitterDeg: 4,
  planeAspect: 0.8,
  undoLimit: 30,
  dragThresholdPx: 6,
  keyboardStep: 0.02,
  freshnessAtUse: 3,
};

/** Hand-tied bouquet: tall fan, stems meet at one binding point. */
const bouquetProfile: StyleProfile = {
  style: 'bouquet',
  anchor: { kind: 'point', x: 0.5, y: 0.86 },
  region: { cx: 0.5, cy: 0.38, rx: 0.36, ry: 0.3, yMax: 0.62 },
  fanAngleDeg: 28,
  slots: {
    focal: [
      { x: 0.5, y: 0.3 },
      { x: 0.38, y: 0.36 },
      { x: 0.62, y: 0.36 },
      { x: 0.5, y: 0.44 },
      { x: 0.44, y: 0.22 },
      { x: 0.56, y: 0.22 },
      { x: 0.3, y: 0.46 },
      { x: 0.7, y: 0.46 },
      { x: 0.5, y: 0.16 },
    ],
    secondary: [
      { x: 0.3, y: 0.3 },
      { x: 0.7, y: 0.3 },
      { x: 0.4, y: 0.48 },
      { x: 0.6, y: 0.48 },
      { x: 0.22, y: 0.4 },
      { x: 0.78, y: 0.4 },
      { x: 0.5, y: 0.54 },
      { x: 0.35, y: 0.18 },
      { x: 0.65, y: 0.18 },
    ],
    filler: [
      { x: 0.2, y: 0.26 },
      { x: 0.8, y: 0.26 },
      { x: 0.28, y: 0.16 },
      { x: 0.72, y: 0.16 },
      { x: 0.16, y: 0.38 },
      { x: 0.84, y: 0.38 },
      { x: 0.5, y: 0.1 },
      { x: 0.26, y: 0.52 },
      { x: 0.74, y: 0.52 },
    ],
    foliage: [
      { x: 0.18, y: 0.5 },
      { x: 0.82, y: 0.5 },
      { x: 0.15, y: 0.34 },
      { x: 0.85, y: 0.34 },
      { x: 0.26, y: 0.58 },
      { x: 0.74, y: 0.58 },
      { x: 0.22, y: 0.2 },
      { x: 0.78, y: 0.2 },
      { x: 0.5, y: 0.6 },
    ],
  },
};

/** Basket: wide, low dome, stems stand in the basket rim. */
const basketProfile: StyleProfile = {
  style: 'basket',
  anchor: { kind: 'rim', y: 0.62, x0: 0.22, x1: 0.78 },
  region: { cx: 0.5, cy: 0.44, rx: 0.46, ry: 0.22, yMax: 0.6 },
  fanAngleDeg: 40,
  slots: {
    focal: [
      { x: 0.5, y: 0.36 },
      { x: 0.38, y: 0.4 },
      { x: 0.62, y: 0.4 },
      { x: 0.5, y: 0.28 },
      { x: 0.28, y: 0.44 },
      { x: 0.72, y: 0.44 },
      { x: 0.44, y: 0.48 },
      { x: 0.56, y: 0.48 },
      { x: 0.5, y: 0.44 },
    ],
    secondary: [
      { x: 0.3, y: 0.34 },
      { x: 0.7, y: 0.34 },
      { x: 0.4, y: 0.3 },
      { x: 0.6, y: 0.3 },
      { x: 0.18, y: 0.46 },
      { x: 0.82, y: 0.46 },
      { x: 0.36, y: 0.52 },
      { x: 0.64, y: 0.52 },
      { x: 0.5, y: 0.54 },
    ],
    filler: [
      { x: 0.2, y: 0.36 },
      { x: 0.8, y: 0.36 },
      { x: 0.3, y: 0.26 },
      { x: 0.7, y: 0.26 },
      { x: 0.1, y: 0.44 },
      { x: 0.9, y: 0.44 },
      { x: 0.5, y: 0.24 },
      { x: 0.24, y: 0.54 },
      { x: 0.76, y: 0.54 },
    ],
    foliage: [
      { x: 0.1, y: 0.52 },
      { x: 0.9, y: 0.52 },
      { x: 0.16, y: 0.4 },
      { x: 0.84, y: 0.4 },
      { x: 0.26, y: 0.58 },
      { x: 0.74, y: 0.58 },
      { x: 0.06, y: 0.46 },
      { x: 0.94, y: 0.46 },
      { x: 0.5, y: 0.58 },
    ],
  },
};

export const bouquetContext: BouquetContext = {
  rules: bouquetRules,
  profiles: { bouquet: bouquetProfile, basket: basketProfile },
  flowers: flowersById,
};
