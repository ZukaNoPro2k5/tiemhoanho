import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { bouquetContext } from '../../content/bouquetRules';
import { designerCopy } from '../../content/designer';
import { defaultWrapId } from '../../content/wraps';
import type { Id } from '../../domain/catalog';
import { canAddStem, createEmptyDraft } from '../../domain/bouquet/draft';
import type { DraftAction } from '../../domain/bouquet/draft';
import {
  canUndo,
  createHistory,
  reduceHistory,
  type DraftHistory,
  type HistoryAction,
} from '../../domain/bouquet/history';
import type { ArrangementStyle, Point } from '../../domain/bouquet/types';
import { BouquetCanvas } from './BouquetCanvas';
import { FlowerTray } from './FlowerTray';
import { StemActions } from './StemActions';
import { WrapPicker } from './WrapPicker';

const NOTICE_MS = 2500;
const styles: ArrangementStyle[] = ['bouquet', 'basket'];

function reducer(history: DraftHistory, action: HistoryAction): DraftHistory {
  return reduceHistory(history, action, bouquetContext);
}

export function BouquetDesigner({ onBack }: { onBack: () => void }) {
  const { rules } = bouquetContext;
  const [history, dispatch] = useReducer(reducer, undefined, () =>
    createHistory(createEmptyDraft(defaultWrapId)),
  );
  const draft = history.present;
  const [selectedId, setSelectedId] = useState<Id | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => headingRef.current?.focus(), []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [notice]);

  // Selection is UI state; a stem missing from the draft is never selected.
  const selected =
    draft.stems.find((stem) => stem.instanceId === selectedId) ?? null;
  const full = !canAddStem(draft, rules);

  const onMove = useCallback(
    (instanceId: Id, point: Point) =>
      dispatch({ type: 'move', instanceId, ...point }),
    [],
  );
  const onSelect = useCallback(
    (instanceId: Id | null) => setSelectedId(instanceId),
    [],
  );
  // Removing, clearing or undoing ends the selection so a restored stem
  // does not come back already selected.
  const run = (action: HistoryAction) => {
    if (
      action.type === 'remove' ||
      action.type === 'clear' ||
      action.type === 'undo'
    ) {
      setSelectedId(null);
    }
    dispatch(action);
  };
  const onStemAction = (action: DraftAction) => run(action);
  const onStyle = (style: ArrangementStyle) => {
    if (style === draft.arrangementStyle) return;
    dispatch({ type: 'setStyle', style });
    if (draft.stems.length > 0) setNotice(designerCopy.restyled[style]);
  };

  return (
    <main className="designer">
      <header className="designer-bar">
        <button type="button" className="ghost-button" onClick={onBack}>
          ← {designerCopy.back}
        </button>
        <h1 ref={headingRef} tabIndex={-1}>
          {designerCopy.title}
        </h1>
        <div
          className="style-switch"
          role="group"
          aria-label={designerCopy.styleGroupLabel}
        >
          {styles.map((style) => (
            <button
              key={style}
              type="button"
              aria-pressed={draft.arrangementStyle === style}
              onClick={() => onStyle(style)}
            >
              {designerCopy.styles[style]}
            </button>
          ))}
        </div>
      </header>

      <BouquetCanvas
        draft={draft}
        selectedId={selected?.instanceId ?? null}
        onSelect={onSelect}
        onMove={onMove}
      />

      <p className="designer-notice" role="status">
        {notice ?? (full ? designerCopy.full(rules.maxStems) : '')}
      </p>

      {selected ? (
        <StemActions
          stem={selected}
          stems={draft.stems}
          dispatch={onStemAction}
        />
      ) : draft.arrangementStyle === 'bouquet' ? (
        <WrapPicker
          wrapId={draft.wrapId}
          onChange={(wrapId) => dispatch({ type: 'setWrap', wrapId })}
        />
      ) : (
        <div className="context-row" aria-hidden="true" />
      )}

      <FlowerTray
        draft={draft}
        disabled={full}
        onAdd={(flowerId) => dispatch({ type: 'add', flowerId })}
      />

      <footer className="designer-footer">
        <button
          type="button"
          className="ghost-button"
          disabled={!canUndo(history)}
          onClick={() => run({ type: 'undo' })}
        >
          ↶ {designerCopy.undo}
        </button>
        <span className="stem-count">
          {designerCopy.stemCount(draft.stems.length, rules.maxStems)}
        </span>
        <button
          type="button"
          className="ghost-button"
          disabled={draft.stems.length === 0}
          onClick={() => run({ type: 'clear' })}
        >
          {designerCopy.clear}
        </button>
      </footer>
    </main>
  );
}
