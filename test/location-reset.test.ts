import { describe, expect, it } from 'vitest';
import { getResetLocationHref } from '../utils/location';

describe('getResetLocationHref', () => {
  it('returns the current pathname when present', () => {
    expect(getResetLocationHref('/tips')).toBe('/tips');
  });

  it('falls back to home when pathname is missing', () => {
    expect(getResetLocationHref(null)).toBe('/');
    expect(getResetLocationHref(undefined)).toBe('/');
  });
});
