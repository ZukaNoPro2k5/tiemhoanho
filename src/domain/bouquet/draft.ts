import type { Id } from '../catalog';
import { composeStem, stemScale } from './compose';
import { clamp, clampToRegion, roundTo } from './geometry';
import type {
  ArrangementStyle,
  BouquetContext,
  BouquetDraft,
  BouquetRules,
  PlacedStem,
  StemSize,
} from './types';

export type DraftAction =
  | { type: 'add'; flowerId: Id }
  | { type: 'move'; instanceId: Id; x: number; y: number }
  | { type: 'rotate'; instanceId: Id; direction: 1 | -1 }
  | { type: 'resize'; instanceId: Id; direction: 1 | -1 }
  | { type: 'reorder'; instanceId: Id; direction: 'forward' | 'backward' }
  | { type: 'remove'; instanceId: Id }
  | { type: 'clear' }
  | { type: 'setWrap'; wrapId: Id }
  | { type: 'setStyle'; style: ArrangementStyle };

const SIZES: readonly StemSize[] = ['small', 'medium', 'large'];

export function createEmptyDraft(wrapId: Id): BouquetDraft {
  return { arrangementStyle: 'bouquet', stems: [], nextStemSeq: 1, wrapId };
}

export function canAddStem(draft: BouquetDraft, rules: BouquetRules): boolean {
  return draft.stems.length < rules.maxStems;
}

export function usedCount(draft: BouquetDraft, flowerId: Id): number {
  return draft.stems.filter((stem) => stem.flowerId === flowerId).length;
}

/** Back-to-front paint order: zIndex, then add order. */
export function renderOrder(stems: readonly PlacedStem[]): PlacedStem[] {
  return stems
    .map((stem, index) => ({ stem, index }))
    .sort((a, b) => a.stem.zIndex - b.stem.zIndex || a.index - b.index)
    .map(({ stem }) => stem);
}

/** Nearest stem above (forward) or below (backward) the given stem. */
export function reorderNeighbor(
  stems: readonly PlacedStem[],
  instanceId: Id,
  direction: 'forward' | 'backward',
): PlacedStem | undefined {
  const target = stems.find((stem) => stem.instanceId === instanceId);
  if (!target) return undefined;
  let best: PlacedStem | undefined;
  for (const stem of stems) {
    if (stem === target) continue;
    const isCandidate =
      direction === 'forward'
        ? stem.zIndex > target.zIndex
        : stem.zIndex < target.zIndex;
    const isCloser =
      !best ||
      (direction === 'forward'
        ? stem.zIndex < best.zIndex
        : stem.zIndex > best.zIndex);
    if (isCandidate && isCloser) best = stem;
  }
  return best;
}

export function canResize(stem: PlacedStem, direction: 1 | -1): boolean {
  return SIZES[SIZES.indexOf(stem.size) + direction] !== undefined;
}

function updateStem(
  draft: BouquetDraft,
  instanceId: Id,
  update: (stem: PlacedStem) => PlacedStem,
): BouquetDraft {
  const index = draft.stems.findIndex((stem) => stem.instanceId === instanceId);
  const current = draft.stems[index];
  if (!current) return draft;
  const next = update(current);
  if (next === current) return draft;
  const stems = draft.stems.slice();
  stems[index] = next;
  return { ...draft, stems };
}

/**
 * Pure draft reducer. Returns the same draft reference when the action changes
 * nothing, so history can skip no-op entries.
 */
export function applyDraftAction(
  draft: BouquetDraft,
  action: DraftAction,
  ctx: BouquetContext,
): BouquetDraft {
  const { rules } = ctx;
  switch (action.type) {
    case 'add': {
      if (!canAddStem(draft, rules)) return draft;
      const stem = composeStem(
        draft.stems,
        action.flowerId,
        `${action.flowerId}#${draft.nextStemSeq}`,
        draft.arrangementStyle,
        ctx,
      );
      if (!stem) return draft;
      return {
        ...draft,
        stems: [...draft.stems, stem],
        nextStemSeq: draft.nextStemSeq + 1,
      };
    }
    case 'move': {
      const { region } = ctx.profiles[draft.arrangementStyle];
      return updateStem(draft, action.instanceId, (stem) => {
        const point = clampToRegion({ x: action.x, y: action.y }, region);
        return point.x === stem.x && point.y === stem.y
          ? stem
          : { ...stem, ...point };
      });
    }
    case 'rotate':
      return updateStem(draft, action.instanceId, (stem) => {
        const rotationDeg = roundTo(
          clamp(
            stem.rotationDeg + action.direction * rules.rotateStepDeg,
            -rules.maxRotationDeg,
            rules.maxRotationDeg,
          ),
          2,
        );
        return rotationDeg === stem.rotationDeg
          ? stem
          : { ...stem, rotationDeg };
      });
    case 'resize':
      return updateStem(draft, action.instanceId, (stem) => {
        const size = SIZES[SIZES.indexOf(stem.size) + action.direction];
        const role = ctx.flowers[stem.flowerId]?.role;
        if (!size || !role) return stem;
        return { ...stem, size, scale: stemScale(role, size, rules) };
      });
    case 'reorder': {
      const target = draft.stems.find(
        (stem) => stem.instanceId === action.instanceId,
      );
      const other = reorderNeighbor(
        draft.stems,
        action.instanceId,
        action.direction,
      );
      if (!target || !other) return draft;
      return {
        ...draft,
        stems: draft.stems.map((stem) => {
          if (stem === target) return { ...stem, zIndex: other.zIndex };
          if (stem === other) return { ...stem, zIndex: target.zIndex };
          return stem;
        }),
      };
    }
    case 'remove': {
      const stems = draft.stems.filter(
        (stem) => stem.instanceId !== action.instanceId,
      );
      return stems.length === draft.stems.length ? draft : { ...draft, stems };
    }
    case 'clear':
      return draft.stems.length === 0 ? draft : { ...draft, stems: [] };
    case 'setWrap':
      return draft.wrapId === action.wrapId
        ? draft
        : { ...draft, wrapId: action.wrapId };
    case 'setStyle': {
      if (draft.arrangementStyle === action.style) return draft;
      // Re-place every stem in add order; manual adjustments are discarded.
      const stems: PlacedStem[] = [];
      for (const stem of draft.stems) {
        const placed = composeStem(
          stems,
          stem.flowerId,
          stem.instanceId,
          action.style,
          ctx,
        );
        if (placed) stems.push(placed);
      }
      return { ...draft, arrangementStyle: action.style, stems };
    }
  }
}
