import type { FlowerRole, Id } from '../catalog';
import { clamp, clampToRegion, headDistance, roundTo } from './geometry';
import { hashString, jitter, mulberry32 } from './random';
import type {
  ArrangementStyle,
  BouquetContext,
  BouquetRules,
  PlacedStem,
  Point,
  StemSize,
} from './types';

export function stemScale(
  role: FlowerRole,
  size: StemSize,
  rules: BouquetRules,
): number {
  return roundTo(rules.roleBaseScale[role] * rules.sizeMultiplier[size]);
}

/** Next free z-index inside a role band of width 100. */
export function nextZIndex(stems: readonly PlacedStem[], band: number): number {
  const inBand = stems
    .map((stem) => stem.zIndex)
    .filter((z) => z >= band && z < band + 100);
  return inBand.length === 0 ? band : Math.max(...inBand) + 1;
}

/**
 * Deterministic assisted placement. The same stems, flower, instanceId and
 * style always produce the same stem. Returns null for an unknown flower.
 */
export function composeStem(
  stems: readonly PlacedStem[],
  flowerId: Id,
  instanceId: Id,
  style: ArrangementStyle,
  ctx: BouquetContext,
): PlacedStem | null {
  const flower = ctx.flowers[flowerId];
  if (!flower) return null;
  const { rules } = ctx;
  const profile = ctx.profiles[style];
  const random = mulberry32(hashString(`${instanceId}:${style}`));

  // Jitter every candidate up front so the chosen head is the one measured.
  const candidates = profile.slots[flower.role].map((slot) =>
    clampToRegion(
      {
        x: slot.x + jitter(random, rules.positionJitter),
        y: slot.y + jitter(random, rules.positionJitter),
      },
      profile.region,
    ),
  );

  let head: Point = { x: profile.region.cx, y: profile.region.cy };
  let bestDistance = -1;
  for (const candidate of candidates) {
    const nearest = stems.reduce(
      (min, stem) =>
        Math.min(min, headDistance(candidate, stem, rules.planeAspect)),
      Infinity,
    );
    if (nearest >= rules.minHeadDistance) {
      head = candidate;
      break;
    }
    if (nearest > bestDistance) {
      head = candidate;
      bestDistance = nearest;
    }
  }

  const tilt =
    (profile.fanAngleDeg * (head.x - profile.region.cx)) / profile.region.rx +
    jitter(random, rules.rotationJitterDeg);
  const size: StemSize = 'medium';

  return {
    instanceId,
    flowerId,
    x: head.x,
    y: head.y,
    rotationDeg: roundTo(
      clamp(tilt, -rules.maxRotationDeg, rules.maxRotationDeg),
      2,
    ),
    scale: stemScale(flower.role, size, rules),
    size,
    zIndex: nextZIndex(stems, rules.zBand[flower.role]),
    freshnessAtUse: rules.freshnessAtUse,
  };
}
