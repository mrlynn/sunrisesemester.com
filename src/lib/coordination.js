// Shared (client + server safe) constants for event coordination.
// No server-only imports here so this can be used inside client components.

export const BRING_CATEGORIES = ["food", "beverages", "supplies", "other"];

export const CATEGORY_META = {
  food: { label: "Food", emoji: "🍽️" },
  beverages: { label: "Beverages", emoji: "🥤" },
  supplies: { label: "Supplies", emoji: "🧺" },
  other: { label: "Other", emoji: "✨" },
};

export function normalizeCategory(value) {
  return BRING_CATEGORIES.includes(value) ? value : "other";
}
