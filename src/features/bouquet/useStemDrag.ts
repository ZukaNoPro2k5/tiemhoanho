import {
  useLayoutEffect,
  useMemo,
  useRef,
  type PointerEvent,
  type RefObject,
} from 'react';
import type { Id } from '../../domain/catalog';
import type { Point } from '../../domain/bouquet/types';

interface DragOptions {
  planeRef: RefObject<HTMLElement | null>;
  thresholdPx: number;
  clamp: (point: Point) => Point;
  onPreview: (instanceId: Id, point: Point) => void;
  onCommit: (instanceId: Id, point: Point) => void;
  onCancel: (instanceId: Id) => void;
}

interface ActiveDrag {
  instanceId: Id;
  pointerId: number;
  element: HTMLElement;
  startX: number;
  startY: number;
  origin: Point;
  rect: DOMRect;
  dragging: boolean;
  last: Point;
}

export interface StemDrag {
  down: (
    event: PointerEvent<HTMLElement>,
    stem: { instanceId: Id } & Point,
  ) => void;
  move: (event: PointerEvent<HTMLElement>) => void;
  up: (event: PointerEvent<HTMLElement>) => void;
  cancel: (event: PointerEvent<HTMLElement>) => void;
  /** True once after a drag ends, so the trailing click does not select. */
  consumeDragClick: () => boolean;
}

/**
 * Pointer drag for one stem at a time. Moves the element with the CSS
 * `translate` property during the gesture and commits once on release, so
 * React does not re-render while the finger moves.
 */
export function useStemDrag(options: DragOptions): StemDrag {
  const optionsRef = useRef(options);
  useLayoutEffect(() => {
    optionsRef.current = options;
  });
  const active = useRef<ActiveDrag | null>(null);
  const draggedRecently = useRef(false);

  return useMemo<StemDrag>(() => {
    const finish = (drag: ActiveDrag) => {
      drag.element.style.translate = '';
      delete drag.element.dataset.dragging;
      active.current = null;
    };

    return {
      down(event, stem) {
        if (active.current) return; // ignore a second finger
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        // Touch drags fire no trailing click, so reset the flag per gesture.
        draggedRecently.current = false;
        const plane = optionsRef.current.planeRef.current;
        if (!plane) return;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Synthetic events in tests have no capturable pointer.
        }
        active.current = {
          instanceId: stem.instanceId,
          pointerId: event.pointerId,
          element: event.currentTarget,
          startX: event.clientX,
          startY: event.clientY,
          origin: { x: stem.x, y: stem.y },
          rect: plane.getBoundingClientRect(),
          dragging: false,
          last: { x: stem.x, y: stem.y },
        };
      },
      move(event) {
        const drag = active.current;
        if (!drag || event.pointerId !== drag.pointerId) return;
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        if (!drag.dragging) {
          if (Math.hypot(dx, dy) < optionsRef.current.thresholdPx) return;
          drag.dragging = true;
          drag.element.dataset.dragging = 'true';
        }
        const point = optionsRef.current.clamp({
          x: drag.origin.x + dx / drag.rect.width,
          y: drag.origin.y + dy / drag.rect.height,
        });
        drag.last = point;
        drag.element.style.translate = `${(point.x - drag.origin.x) * drag.rect.width}px ${(point.y - drag.origin.y) * drag.rect.height}px`;
        optionsRef.current.onPreview(drag.instanceId, point);
      },
      up(event) {
        const drag = active.current;
        if (!drag || event.pointerId !== drag.pointerId) return;
        finish(drag);
        if (drag.dragging) {
          draggedRecently.current = true;
          optionsRef.current.onCommit(drag.instanceId, drag.last);
        }
      },
      cancel(event) {
        const drag = active.current;
        if (!drag || event.pointerId !== drag.pointerId) return;
        finish(drag);
        optionsRef.current.onCancel(drag.instanceId);
      },
      consumeDragClick() {
        const value = draggedRecently.current;
        draggedRecently.current = false;
        return value;
      },
    };
  }, []);
}
