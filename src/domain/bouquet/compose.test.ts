import { describe, expect, it } from 'vitest';
import { bouquetContext } from '../../content/bouquetRules';
import { composeStem, nextZIndex } from './compose';
import { applyDraftAction, createEmptyDraft } from './draft';
import { headDistance } from './geometry';
import type { ArrangementStyle, BouquetDraft, PlacedStem } from './types';

const ctx = bouquetContext;
const sequence = [
  'red-rose',
  'pink-tulip',
  'sunflower',
  'daisy',
  'daisy',
  'babys-breath',
  'babys-breath',
  'eucalyptus',
  'eucalyptus',
];

function build(style: ArrangementStyle, flowerIds = sequence): BouquetDraft {
  let draft = applyDraftAction(
    createEmptyDraft('wrap-cream'),
    { type: 'setStyle', style },
    ctx,
  );
  for (const flowerId of flowerIds) {
    draft = applyDraftAction(draft, { type: 'add', flowerId }, ctx);
  }
  return draft;
}

function insideRegion(stem: PlacedStem, style: ArrangementStyle): boolean {
  const { region } = ctx.profiles[style];
  const dx = (stem.x - region.cx) / region.rx;
  const dy = (stem.y - region.cy) / region.ry;
  return Math.hypot(dx, dy) <= 1.0001 && stem.y <= region.yMax;
}

describe.each<ArrangementStyle>(['bouquet', 'basket'])(
  'assisted placement (%s)',
  (style) => {
    it('produces an identical draft for the same add sequence', () => {
      expect(build(style)).toEqual(build(style));
      expect(build(style)).toMatchSnapshot();
    });

    it('keeps every head inside the style region', () => {
      for (const stem of build(style).stems) {
        expect(insideRegion(stem, style)).toBe(true);
      }
    });

    it('keeps heads apart while free slots exist', () => {
      const { stems } = build(style);
      for (const [index, a] of stems.entries()) {
        for (const b of stems.slice(index + 1)) {
          expect(
            headDistance(a, b, ctx.rules.planeAspect),
          ).toBeGreaterThanOrEqual(ctx.rules.minHeadDistance);
        }
      }
    });

    it('places focal flowers closer to the center than foliage', () => {
      const { region } = ctx.profiles[style];
      const { stems } = build(style);
      const meanDistance = (role: string) => {
        const group = stems.filter(
          (stem) => ctx.flowers[stem.flowerId]?.role === role,
        );
        return (
          group.reduce(
            (sum, stem) =>
              sum +
              headDistance(
                stem,
                { x: region.cx, y: region.cy },
                ctx.rules.planeAspect,
              ),
            0,
          ) / group.length
        );
      };
      expect(meanDistance('focal')).toBeLessThan(meanDistance('foliage'));
    });
  },
);

describe('composeStem details', () => {
  it('returns null for an unknown flower', () => {
    expect(composeStem([], 'no-such-flower', 'x#1', 'bouquet', ctx)).toBeNull();
  });

  it('tilts heads outward from the center', () => {
    const { stems } = build('bouquet', ['eucalyptus', 'eucalyptus']);
    const [left, right] = [...stems].sort((a, b) => a.x - b.x);
    expect(left?.rotationDeg).toBeLessThan(0);
    expect(right?.rotationDeg).toBeGreaterThan(0);
  });

  it('stacks z-index by role band, later stems on top', () => {
    const { stems } = build('bouquet', [
      'pink-tulip',
      'eucalyptus',
      'red-rose',
    ]);
    expect(stems.map((stem) => stem.zIndex)).toEqual([400, 100, 401]);
    expect(nextZIndex(stems, 100)).toBe(101);
  });

  it('starts every new stem at medium size with role scale', () => {
    const [stem] = build('bouquet', ['daisy']).stems;
    expect(stem?.size).toBe('medium');
    expect(stem?.scale).toBe(0.85);
    expect(stem?.freshnessAtUse).toBe(3);
  });
});
