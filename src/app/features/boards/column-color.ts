const DOT_COLORS = 5;

/** Status dot color for the column at `index` (cycles through --color-dot-1…5). */
export function columnColor(index: number): string {
  return `var(--color-dot-${(index % DOT_COLORS) + 1})`;
}
