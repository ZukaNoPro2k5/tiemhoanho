import { describe, expect, it } from 'vitest';
import { hashString, jitter, mulberry32 } from './random';

describe('seeded randomness', () => {
  it('hashes strings to stable unsigned 32-bit values', () => {
    expect(hashString('pink-tulip#1:bouquet')).toBe(
      hashString('pink-tulip#1:bouquet'),
    );
    expect(hashString('a')).not.toBe(hashString('b'));
    expect(hashString('')).toBe(0x811c9dc5);
  });

  it('replays the same sequence for the same seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const first = [a(), a(), a()];
    expect([b(), b(), b()]).toEqual(first);
    for (const value of first) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('keeps jitter inside its amplitude', () => {
    const random = mulberry32(7);
    for (let index = 0; index < 200; index += 1) {
      expect(Math.abs(jitter(random, 0.02))).toBeLessThanOrEqual(0.02);
    }
  });
});
