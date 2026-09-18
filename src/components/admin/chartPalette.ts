/**
 * The categorical palette for the admin charts.
 *
 * Every hue is a mid-tone, so the same swatch reads against the hub's warm
 * paper (#fcfbf8) and against its dark surface (#1c1e22) — the dashboard
 * follows the site's theme switch and cannot pick a palette per theme.
 * The hues themselves are the site's: house blue, the Chapter 2 teal and
 * terracotta, the gold of the masthead rule, the chapter-card violet.
 */
export const CHART_PALETTE = [
  '#3a7fa5', // house blue
  '#3fa08c', // optimist teal
  '#c29144', // ochre
  '#d0724f', // pessimist terracotta
  '#8a68d6', // chapter-three violet
  '#4a7fe0', // chapter-one cobalt
  '#8e90a2', // fundamentalist slate
  '#6aa04a', // moss
  '#b05f88', // plum
  '#d4b05c', // gold
];

/** Everything outside the top ten shares one deliberately neutral swatch. */
export const CHART_OTHER = '#9a9a9a';

/* Axis furniture follows the theme through the site's own tokens. */
export const AXIS_TICK = 'var(--ink-mute)';
export const AXIS_GRID = 'var(--rule)';
export const TOOLTIP_STYLE = {
  background: 'var(--bg-raise)',
  border: '1px solid var(--rule-hard)',
  borderRadius: 4,
  color: 'var(--ink)',
  fontSize: 12,
} as const;
