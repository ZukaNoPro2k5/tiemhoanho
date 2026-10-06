import { describe, expect, it } from 'vitest';
import type { FlowerRole } from '../domain/catalog';
import { bouquetContext, bouquetRules } from './bouquetRules';
import { flowers } from './flowers';
import { defaultWrapId, wraps } from './wraps';

const roles: FlowerRole[] = ['focal', 'secondary', 'filler', 'foliage'];

describe('bouquet content', () => {
  it('has unique flower ids covering every role', () => {
    expect(new Set(flowers.map((f) => f.id)).size).toBe(flowers.length);
    for (const role of roles) {
      expect(flowers.some((f) => f.role === role)).toBe(true);
    }
  });

  it('offers three wraps including the default', () => {
    expect(wraps).toHaveLength(3);
    expect(wraps.some((wrap) => wrap.id === defaultWrapId)).toBe(true);
  });

  it.each(['bouquet', 'basket'] as const)(
    'defines enough in-region slots per role for %s',
    (style) => {
      const { region, slots } = bouquetContext.profiles[style];
      for (const role of roles) {
        expect(slots[role].length).toBeGreaterThanOrEqual(
          bouquetRules.maxStems,
        );
        for (const slot of slots[role]) {
          const dx = (slot.x - region.cx) / region.rx;
          const dy = (slot.y - region.cy) / region.ry;
          expect(Math.hypot(dx, dy)).toBeLessThanOrEqual(1);
          expect(slot.y).toBeLessThanOrEqual(region.yMax);
        }
      }
    },
  );
});
