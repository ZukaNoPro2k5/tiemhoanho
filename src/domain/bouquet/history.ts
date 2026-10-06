import { applyDraftAction, type DraftAction } from './draft';
import type { BouquetContext, BouquetDraft } from './types';

export interface DraftHistory {
  present: BouquetDraft;
  past: readonly BouquetDraft[];
}

export type HistoryAction = DraftAction | { type: 'undo' };

export function createHistory(draft: BouquetDraft): DraftHistory {
  return { present: draft, past: [] };
}

export function canUndo(history: DraftHistory): boolean {
  return history.past.length > 0;
}

export function reduceHistory(
  history: DraftHistory,
  action: HistoryAction,
  ctx: BouquetContext,
): DraftHistory {
  if (action.type === 'undo') {
    const previous = history.past.at(-1);
    if (!previous) return history;
    return { present: previous, past: history.past.slice(0, -1) };
  }
  const next = applyDraftAction(history.present, action, ctx);
  if (next === history.present) return history;
  return {
    present: next,
    past: [...history.past, history.present].slice(-ctx.rules.undoLimit),
  };
}
