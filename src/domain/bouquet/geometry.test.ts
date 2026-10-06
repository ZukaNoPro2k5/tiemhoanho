import { describe, expect, it } from 'vitest';
import {
  anchorFor,
  clampToRegion,
  fromPlanePixels,
  headDistance,
  roundTo,
  stemPathD,
  toPlanePixels,
} from './geometry';
import type { Region } from './types';

const region: Region = { cx: 0.5, cy: 0.4, rx: 0.3, ry: 0.2, yMax: 0.5 };

describe('plane geometry', () => {
  it('rounds to 4 digits and never returns negative zero', () => {
    expect(roundTo(0.123456)).toBe(0.1235);
    expect(Object.is(roundTo(-0.00001), 0)).toBe(true);
  });

  it('leaves points inside the region untouched', () => {
    expect(clampToRegion({ x: 0.55, y: 0.38 }, region)).toEqual({
      x: 0.55,
      y: 0.38,
    });
  });

  it('pulls outside points back onto the ellipse edge', () => {
    const point = clampToRegion({ x: 2, y: 0.4 }, region);
    expect(point).toEqual({ x: 0.8, y: 0.4 });
  });

  it('never lets a head sink below yMax', () => {
    expect(clampToRegion({ x: 0.5, y: 0.59 }, region).y).toBe(0.5);
  });

  it('anchors bouquet stems to one point and basket stems to the rim', () => {
    expect(
      anchorFor({ x: 0.1, y: 0.3 }, { kind: 'point', x: 0.5, y: 0.9 }),
    ).toEqual({ x: 0.5, y: 0.9 });
    expect(
      anchorFor({ x: 0.1, y: 0.3 }, { kind: 'rim', y: 0.6, x0: 0.2, x1: 0.8 }),
    ).toEqual({ x: 0.2, y: 0.6 });
    expect(
      anchorFor({ x: 0.5, y: 0.3 }, { kind: 'rim', y: 0.6, x0: 0.2, x1: 0.8 }),
    ).toEqual({ x: 0.5, y: 0.6 });
  });

  it('measures vertical distance in width units on the 4:5 plane', () => {
    expect(headDistance({ x: 0, y: 0 }, { x: 0, y: 0.08 }, 0.8)).toBeCloseTo(
      0.1,
    );
  });

  it('draws stems in the 100x125 viewBox', () => {
    expect(stemPathD({ x: 0.5, y: 0.2 }, { x: 0.5, y: 0.8 })).toBe(
      'M50 25Q50 66.25 50 100',
    );
  });

  it('maps the same normalized point proportionally at any plane size', () => {
    const point = { x: 0.25, y: 0.6 };
    expect(toPlanePixels(point, 320, 400)).toEqual({ x: 80, y: 240 });
    expect(toPlanePixels(point, 400, 500)).toEqual({ x: 100, y: 300 });
    expect(fromPlanePixels({ x: 100, y: 300 }, 400, 500)).toEqual(point);
  });
});
