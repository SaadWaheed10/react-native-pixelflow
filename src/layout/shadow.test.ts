import { describe, expect, it } from 'vitest';
import { shadow } from './shadow';

describe('shadow', () => {
  it('returns zero elevation for none', () => {
    const s = shadow('none');
    expect(s.elevation === 0 || s.shadowOpacity === 0).toBe(true);
  });

  it('maps named levels to positive elevation / opacity', () => {
    const sm = shadow('sm');
    const lg = shadow('lg');
    const smElev = sm.elevation ?? (sm.shadowOpacity ?? 0) * 100;
    const lgElev = lg.elevation ?? (lg.shadowOpacity ?? 0) * 100;
    expect(lgElev).toBeGreaterThan(smElev);
  });

  it('accepts numeric levels and optional colors', () => {
    const s = shadow(6, { color: '#112233', backgroundColor: '#fff' });
    expect(s.shadowColor === '#112233' || s.elevation === 6).toBe(true);
    expect(s.backgroundColor).toBe('#fff');
  });
});
