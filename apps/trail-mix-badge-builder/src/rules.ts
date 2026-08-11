export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
}

/** The whole catalogue. Category (protein/sweet/crunch) is encoded in the rules below. */
export const INGREDIENTS: readonly Ingredient[] = [
  {id: 'almonds', name: 'Almonds', emoji: '🥜'},
  {id: 'seeds', name: 'Sunflower Seeds', emoji: '🌻'},
  {id: 'chocolate', name: 'Chocolate Chips', emoji: '🍫'},
  {id: 'cranberries', name: 'Dried Cranberries', emoji: '🍒'},
  {id: 'pretzels', name: 'Pretzels', emoji: '🥨'},
];

/** Which rule fired — drives the badge pill's colour (see BADGE_STYLES in App.tsx). */
export type BadgeVariant = 'empty' | 'protein' | 'sweet' | 'balanced' | 'mixed';

export interface Verdict {
  badge: string;
  variant: BadgeVariant;
  /** Ids the winning rule fired on, highlighted in the ingredient list. */
  contributing: readonly string[];
}

/**
 * The ordered rule chain: first match wins, later rules that would also match
 * are pre-empted. The order is the lesson — do not re-sort it.
 */
export function awardBadge(selected: ReadonlySet<string>): Verdict {
  const has = (id: string) => selected.has(id);
  const inMix = INGREDIENTS.filter(i => selected.has(i.id)).map(i => i.id);

  if (inMix.length === 0) {
    return {badge: '🎒 Empty Bag', variant: 'empty', contributing: []};
  }
  const hasProtein = has('almonds') || has('seeds');
  const hasSweet = has('chocolate') || has('cranberries');
  if (hasProtein && hasSweet && has('pretzels')) {
    return {badge: '⚖️ Balanced Mix', variant: 'balanced', contributing: inMix};
  }
  if (has('almonds') && has('seeds')) {
    return {
      badge: '💪 Protein Powerhouse',
      variant: 'protein',
      contributing: ['almonds', 'seeds'],
    };
  }
  // The !almonds guard keeps "protein contaminated" sweet combos out of Sweet Tooth.
  if (has('chocolate') && has('cranberries') && !has('almonds')) {
    return {badge: '🍭 Sweet Tooth', variant: 'sweet', contributing: ['chocolate', 'cranberries']};
  }
  return {badge: '🎒 Custom Mix', variant: 'mixed', contributing: []};
}

/** "⚖️ Balanced Mix" → "Balanced Mix badge active." */
export function announcementFor(badge: string): string {
  return `${badge.replace(/[^\p{Letter} ]/gu, '').trim()} badge active.`;
}

export function mixSummary(selected: ReadonlySet<string>): string {
  const names = INGREDIENTS.filter(i => selected.has(i.id)).map(i => i.name);
  return names.length ? `In your mix: ${names.join(', ')}` : 'No ingredients selected yet.';
}
