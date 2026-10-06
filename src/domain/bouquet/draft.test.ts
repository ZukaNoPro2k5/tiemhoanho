import { describe, expect, it } from 'vitest';
import { bouquetContext } from '../../content/bouquetRules';
import {
  applyDraftAction,
  canAddStem,
  canResize,
  createEmptyDraft,
  renderOrder,
  reorderNeighbor,
  usedCount,
  type DraftAction,
} from './draft';
import type { BouquetDraft } from './types';

const ctx = bouquetContext;

function run(actions: DraftAction[], start = createEmptyDraft('wrap-cream')) {
  return actions.reduce(
    (draft, action) => applyDraftAction(draft, action, ctx),
    start,
  );
}

const add = (flowerId: string): DraftAction => ({ type: 'add', flowerId });

describe('draft reducer', () => {
  it('starts as an empty Bó with the given wrap', () => {
    expect(createEmptyDraft('wrap-cream')).toEqual({
      arrangementStyle: 'bouquet',
      stems: [],
      nextStemSeq: 1,
      wrapId: 'wrap-cream',
    });
  });

  it('adds stems with deterministic, unique instance ids', () => {
    const draft = run([add('daisy'), add('daisy')]);
    expect(draft.stems.map((stem) => stem.instanceId)).toEqual([
      'daisy#1',
      'daisy#2',
    ]);
    expect(draft.nextStemSeq).toBe(3);
    expect(usedCount(draft, 'daisy')).toBe(2);
  });

  it('stops at nine stems no matter how many taps arrive', () => {
    const draft = run(Array.from({ length: 12 }, () => add('red-rose')));
    expect(draft.stems).toHaveLength(9);
    expect(canAddStem(draft, ctx.rules)).toBe(false);
  });

  it('ignores unknown flowers and unknown stems without changing the draft', () => {
    const draft = run([add('daisy')]);
    expect(applyDraftAction(draft, add('nope'), ctx)).toBe(draft);
    expect(
      applyDraftAction(draft, { type: 'remove', instanceId: 'nope#1' }, ctx),
    ).toBe(draft);
  });

  it('moves a stem and clamps it into the region', () => {
    const draft = run([
      add('daisy'),
      { type: 'move', instanceId: 'daisy#1', x: 5, y: 0.38 },
    ]);
    const { region } = ctx.profiles.bouquet;
    expect(draft.stems[0]).toMatchObject({
      x: region.cx + region.rx,
      y: 0.38,
    });
  });

  it('rotates in 15° steps and stops at ±60°', () => {
    const start = run([add('daisy')]);
    const base = start.stems[0]?.rotationDeg ?? 0;
    const once = applyDraftAction(
      start,
      { type: 'rotate', instanceId: 'daisy#1', direction: 1 },
      ctx,
    );
    expect(once.stems[0]?.rotationDeg).toBeCloseTo(base + 15);
    const many = run(
      Array.from({ length: 10 }, () => ({
        type: 'rotate' as const,
        instanceId: 'daisy#1',
        direction: 1 as const,
      })),
      start,
    );
    expect(many.stems[0]?.rotationDeg).toBe(60);
    expect(
      applyDraftAction(
        many,
        { type: 'rotate', instanceId: 'daisy#1', direction: 1 },
        ctx,
      ),
    ).toBe(many);
  });

  it('resizes through small, medium and large', () => {
    const larger = run([
      add('daisy'),
      { type: 'resize', instanceId: 'daisy#1', direction: 1 },
    ]);
    expect(larger.stems[0]).toMatchObject({ size: 'large', scale: 0.9775 });
    const stem = larger.stems[0];
    expect(stem && canResize(stem, 1)).toBe(false);
    expect(
      applyDraftAction(
        larger,
        { type: 'resize', instanceId: 'daisy#1', direction: 1 },
        ctx,
      ),
    ).toBe(larger);
  });

  it('reorders across role bands when the player asks', () => {
    const draft = run([add('red-rose'), add('eucalyptus')]);
    expect(renderOrder(draft.stems).map((s) => s.flowerId)).toEqual([
      'eucalyptus',
      'red-rose',
    ]);
    const forward = applyDraftAction(
      draft,
      { type: 'reorder', instanceId: 'eucalyptus#2', direction: 'forward' },
      ctx,
    );
    expect(renderOrder(forward.stems).map((s) => s.flowerId)).toEqual([
      'red-rose',
      'eucalyptus',
    ]);
    expect(
      reorderNeighbor(forward.stems, 'eucalyptus#2', 'forward'),
    ).toBeUndefined();
    expect(
      applyDraftAction(
        forward,
        { type: 'reorder', instanceId: 'eucalyptus#2', direction: 'forward' },
        ctx,
      ),
    ).toBe(forward);
  });

  it('removes and clears stems but keeps ids unique afterwards', () => {
    const cleared = run([add('daisy'), add('daisy'), { type: 'clear' }]);
    expect(cleared.stems).toEqual([]);
    expect(run([add('daisy')], cleared).stems[0]?.instanceId).toBe('daisy#3');
  });

  it('keeps the chosen wrap across style switches', () => {
    const draft = run([
      { type: 'setWrap', wrapId: 'wrap-kraft' },
      { type: 'setStyle', style: 'basket' },
      { type: 'setStyle', style: 'bouquet' },
    ]);
    expect(draft.wrapId).toBe('wrap-kraft');
  });

  it('re-composes every stem when the style changes', () => {
    const bouquet = run([add('red-rose'), add('daisy'), add('eucalyptus')]);
    const basket = applyDraftAction(
      bouquet,
      { type: 'setStyle', style: 'basket' },
      ctx,
    );
    expect(basket.arrangementStyle).toBe('basket');
    expect(basket.stems.map((s) => s.instanceId)).toEqual(
      bouquet.stems.map((s) => s.instanceId),
    );
    expect(basket.stems).not.toEqual(bouquet.stems);
    expect(
      applyDraftAction(basket, { type: 'setStyle', style: 'basket' }, ctx),
    ).toBe(basket);
  });

  it('reconstructs identically from JSON', () => {
    const draft = run([
      add('red-rose'),
      add('pink-tulip'),
      add('eucalyptus'),
      { type: 'rotate', instanceId: 'red-rose#1', direction: -1 },
      { type: 'move', instanceId: 'pink-tulip#2', x: 0.31, y: 0.27 },
      { type: 'setStyle', style: 'basket' },
      { type: 'resize', instanceId: 'eucalyptus#3', direction: -1 },
    ]);
    const restored = JSON.parse(JSON.stringify(draft)) as BouquetDraft;
    expect(restored).toEqual(draft);
    expect(renderOrder(restored.stems)).toEqual(renderOrder(draft.stems));
  });
});
