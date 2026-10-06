import { describe, expect, it } from 'vitest';
import { bouquetContext } from '../../content/bouquetRules';
import { createEmptyDraft } from './draft';
import {
  canUndo,
  createHistory,
  reduceHistory,
  type DraftHistory,
  type HistoryAction,
} from './history';

const ctx = bouquetContext;

function run(actions: HistoryAction[], start?: DraftHistory) {
  return actions.reduce(
    (history, action) => reduceHistory(history, action, ctx),
    start ?? createHistory(createEmptyDraft('wrap-cream')),
  );
}

describe('undo history', () => {
  it('undoes the last change and stops when empty', () => {
    const history = run([
      { type: 'add', flowerId: 'daisy' },
      { type: 'add', flowerId: 'red-rose' },
      { type: 'undo' },
    ]);
    expect(history.present.stems.map((s) => s.flowerId)).toEqual(['daisy']);
    const empty = run([{ type: 'undo' }, { type: 'undo' }], history);
    expect(empty.present.stems).toEqual([]);
    expect(canUndo(empty)).toBe(false);
    expect(reduceHistory(empty, { type: 'undo' }, ctx)).toBe(empty);
  });

  it('does not record no-op actions', () => {
    const history = run([
      { type: 'add', flowerId: 'daisy' },
      { type: 'setWrap', wrapId: 'wrap-cream' },
      { type: 'remove', instanceId: 'missing#9' },
    ]);
    expect(history.past).toHaveLength(1);
  });

  it('brings back a removed stem', () => {
    const added = run([{ type: 'add', flowerId: 'daisy' }]);
    const restored = run(
      [{ type: 'remove', instanceId: 'daisy#1' }, { type: 'undo' }],
      added,
    );
    expect(restored.present).toEqual(added.present);
  });

  it('restores manual adjustments after a style switch', () => {
    const adjusted = run([
      { type: 'add', flowerId: 'red-rose' },
      { type: 'move', instanceId: 'red-rose#1', x: 0.33, y: 0.25 },
      { type: 'resize', instanceId: 'red-rose#1', direction: 1 },
    ]);
    const back = run(
      [{ type: 'setStyle', style: 'basket' }, { type: 'undo' }],
      adjusted,
    );
    expect(back.present).toEqual(adjusted.present);
  });

  it('keeps at most undoLimit entries', () => {
    const actions: HistoryAction[] = Array.from({ length: 40 }, (_, index) => ({
      type: 'setWrap',
      wrapId: index % 2 === 0 ? 'wrap-blush' : 'wrap-kraft',
    }));
    expect(run(actions).past).toHaveLength(ctx.rules.undoLimit);
  });
});
