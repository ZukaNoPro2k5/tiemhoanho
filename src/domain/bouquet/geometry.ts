import type { Point, Region, StemAnchor } from './types';

/** SVG viewBox matching the 4:5 composition plane. */
export const PLANE_VIEWBOX = { width: 100, height: 125 } as const;

export function roundTo(value: number, digits = 4): number {
  const factor = 10 ** digits;
  const rounded = Math.round(value * factor) / factor;
  // Normalize -0 so JSON round-trips compare equal.
  return rounded === 0 ? 0 : rounded;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampToRegion(point: Point, region: Region): Point {
  const dx = (point.x - region.cx) / region.rx;
  const dy = (point.y - region.cy) / region.ry;
  const distance = Math.hypot(dx, dy);
  let { x, y } = point;
  if (distance > 1) {
    x = region.cx + (dx / distance) * region.rx;
    y = region.cy + (dy / distance) * region.ry;
  }
  return { x: roundTo(x), y: roundTo(Math.min(y, region.yMax)) };
}

export function anchorFor(head: Point, anchor: StemAnchor): Point {
  return anchor.kind === 'point'
    ? { x: anchor.x, y: anchor.y }
    : { x: clamp(head.x, anchor.x0, anchor.x1), y: anchor.y };
}

/** Distance in plane-width units, correcting for the taller plane. */
export function headDistance(a: Point, b: Point, planeAspect: number): number {
  return Math.hypot(a.x - b.x, (a.y - b.y) / planeAspect);
}

/** Quadratic stem path in PLANE_VIEWBOX units, from head to anchor. */
export function stemPathD(head: Point, anchor: Point): string {
  const { width, height } = PLANE_VIEWBOX;
  const controlX = anchor.x + (head.x - anchor.x) * 0.2;
  const controlY = head.y + (anchor.y - head.y) * 0.55;
  const f = (value: number) => roundTo(value, 2);
  return `M${f(head.x * width)} ${f(head.y * height)}Q${f(controlX * width)} ${f(controlY * height)} ${f(anchor.x * width)} ${f(anchor.y * height)}`;
}

export function toPlanePixels(
  point: Point,
  width: number,
  height: number,
): Point {
  return { x: point.x * width, y: point.y * height };
}

export function fromPlanePixels(
  pixels: Point,
  width: number,
  height: number,
): Point {
  return { x: pixels.x / width, y: pixels.y / height };
}
