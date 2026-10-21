import { getWindowWidthClass } from '../adaptive/windowClass';
import { computeGrid } from '../adaptive/grid';
import { scalingEngine } from '../core/scalingEngine';
import { rf, rp, rr } from '../responsive/responsive';
import { getConfig } from '../core/config';

export interface LayoutFixture {
  name: string;
  width: number;
  height: number;
  fontScale?: number;
}

/** Common device fixtures for layout regression tests. */
export const LAYOUT_FIXTURES: Record<string, LayoutFixture> = {
  phone: { name: 'phone', width: 390, height: 844 },
  phoneSE: { name: 'phoneSE', width: 375, height: 667 },
  phoneLandscape: { name: 'phoneLandscape', width: 844, height: 390 },
  tablet: { name: 'tablet', width: 834, height: 1194 },
  tabletLandscape: { name: 'tabletLandscape', width: 1194, height: 834 },
  splitCompact: { name: 'splitCompact', width: 400, height: 900 },
  foldOpen: { name: 'foldOpen', width: 884, height: 1104 },
  largeFont: { name: 'largeFont', width: 390, height: 844, fontScale: 1.4 },
};

export interface LayoutSnapshot {
  fixture: string;
  width: number;
  height: number;
  widthClass: ReturnType<typeof getWindowWidthClass>;
  deviceType: string;
  rp16: number;
  rf16: number;
  rr12: number;
  scale: number;
  fontScale: number;
  density: string;
  columns160: number;
}

/** Capture scaled metrics for the current engine window. */
export function captureLayoutSnapshot(fixtureName = 'current'): LayoutSnapshot {
  const snap = scalingEngine.getSnapshot();
  const config = getConfig();
  const grid = computeGrid(snap.width, { minItemWidth: 160, gap: 12 });
  return {
    fixture: fixtureName,
    width: snap.width,
    height: snap.height,
    widthClass: getWindowWidthClass(snap.width),
    deviceType: snap.deviceType,
    rp16: rp(16),
    rf16: rf(16),
    rr12: rr(12),
    scale: snap.scale,
    fontScale: snap.fontScale,
    density: config.density,
    columns160: grid.columns,
  };
}

export interface AssertLayoutOptions {
  /** Apply fixture before asserting. */
  fixture?: LayoutFixture | keyof typeof LAYOUT_FIXTURES;
  /** Soft equality tolerance for floating metrics. Default 0.5 */
  tolerance?: number;
}

function applyFixture(fixture: LayoutFixture): void {
  scalingEngine.setWindowForTesting(
    fixture.width,
    fixture.height,
    fixture.fontScale ?? 1,
  );
}

/**
 * Assert layout metrics for CI regression tests.
 *
 * @example
 * assertLayout({
 *   fixture: 'phone',
 *   expect: { widthClass: 'compact', rp16: 16, columns160: 2 },
 * });
 */
export function assertLayout(options: {
  fixture?: AssertLayoutOptions['fixture'];
  expect: Partial<LayoutSnapshot> & {
    /** Custom predicate */
    where?: (snap: LayoutSnapshot) => boolean;
  };
  tolerance?: number;
}): LayoutSnapshot {
  if (options.fixture !== undefined) {
    const fixture =
      typeof options.fixture === 'string'
        ? LAYOUT_FIXTURES[options.fixture]
        : options.fixture;
    if (!fixture) {
      throw new Error(
        `[pixelflow/testing] Unknown fixture "${String(options.fixture)}"`,
      );
    }
    applyFixture(fixture);
  }

  const snap = captureLayoutSnapshot(
    typeof options.fixture === 'string'
      ? options.fixture
      : options.fixture?.name ?? 'current',
  );
  const tol = options.tolerance ?? 0.5;
  const exp = options.expect;

  const numKeys: (keyof LayoutSnapshot)[] = [
    'rp16',
    'rf16',
    'rr12',
    'scale',
    'fontScale',
    'width',
    'height',
    'columns160',
  ];

  for (const key of numKeys) {
    const expected = exp[key];
    if (typeof expected === 'number') {
      const actual = snap[key] as number;
      if (Math.abs(actual - expected) > tol) {
        throw new Error(
          `[pixelflow/testing] ${snap.fixture}.${key}: expected ~${expected}, got ${actual}`,
        );
      }
    }
  }

  if (exp.widthClass !== undefined && snap.widthClass !== exp.widthClass) {
    throw new Error(
      `[pixelflow/testing] ${snap.fixture}.widthClass: expected ${exp.widthClass}, got ${snap.widthClass}`,
    );
  }
  if (exp.deviceType !== undefined && snap.deviceType !== exp.deviceType) {
    throw new Error(
      `[pixelflow/testing] ${snap.fixture}.deviceType: expected ${exp.deviceType}, got ${snap.deviceType}`,
    );
  }
  if (exp.density !== undefined && snap.density !== exp.density) {
    throw new Error(
      `[pixelflow/testing] ${snap.fixture}.density: expected ${exp.density}, got ${snap.density}`,
    );
  }
  if (exp.where && !exp.where(snap)) {
    throw new Error(
      `[pixelflow/testing] ${snap.fixture}: custom where() predicate failed`,
    );
  }

  return snap;
}

/**
 * Run `fn` across multiple fixtures (does not restore window afterward).
 */
export function withFixtures(
  names: (keyof typeof LAYOUT_FIXTURES)[],
  fn: (snap: LayoutSnapshot) => void,
): void {
  for (const name of names) {
    const fixture = LAYOUT_FIXTURES[name];
    applyFixture(fixture);
    fn(captureLayoutSnapshot(name));
  }
}
