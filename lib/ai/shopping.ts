import type { ShoppingCategory, ShoppingItem } from "@/lib/types/shopping";
import { SHOPPING_CATEGORY_META } from "@/lib/types/shopping";

interface CategoryRule {
  keywords: string[];
  category: ShoppingCategory;
  emoji: string;
}

const RULES: CategoryRule[] = [
  { keywords: ["milk", "butter", "cheese", "yogurt", "cream", "egg", "eggs"], category: "dairy", emoji: "🥛" },
  { keywords: ["chicken", "beef", "pork", "bacon", "turkey", "sausage", "steak"], category: "meat", emoji: "🍗" },
  { keywords: ["banana", "apple", "tomato", "tomatoes", "lettuce", "spinach", "onion", "potato", "carrot", "fruit", "vegetable", "avocado", "berries", "orange"], category: "produce", emoji: "🥬" },
  { keywords: ["bread", "bagel", "croissant", "bun", "roll"], category: "bakery", emoji: "🍞" },
  { keywords: ["ice cream", "frozen", "pizza"], category: "frozen", emoji: "🧊" },
  { keywords: ["soda", "juice", "water", "coffee", "tea", "beer", "wine"], category: "beverages", emoji: "🥤" },
  { keywords: ["soap", "detergent", "paper towel", "toilet paper", "sponge", "cleaner", "trash bag"], category: "household", emoji: "🧼" },
];

const COMMON_PRICES: Record<string, number> = {
  milk: 3.5,
  butter: 4,
  cheese: 5,
  banana: 0.5,
  bananas: 2,
  bread: 3,
  chicken: 8,
  eggs: 4,
  tomatoes: 3,
  soap: 3.5,
  coffee: 9,
};

export function categorizeItem(name: string): { category: ShoppingCategory; emoji: string } {
  const normalized = name.toLowerCase().trim();
  const match = RULES.find((rule) => rule.keywords.some((kw) => normalized.includes(kw)));
  if (match) return { category: match.category, emoji: match.emoji };
  return { category: "other", emoji: SHOPPING_CATEGORY_META.other.emoji };
}

export function estimatePrice(name: string): number {
  const normalized = name.toLowerCase().trim();
  const known = Object.entries(COMMON_PRICES).find(([key]) => normalized.includes(key));
  if (known) return known[1];
  // Deterministic pseudo-estimate so the same item always prices the same.
  const hash = [...normalized].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return Math.round((3 + (hash % 12)) * 100) / 100;
}

/** Case-insensitive merge of duplicate item names, summing quantity. */
export function combineDuplicates(items: ShoppingItem[]): ShoppingItem[] {
  const byName = new Map<string, ShoppingItem>();
  for (const item of items) {
    const key = item.name.trim().toLowerCase();
    const existing = byName.get(key);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      byName.set(key, { ...item });
    }
  }
  return [...byName.values()];
}

/** Store walking order: produce first, household/checkout last. */
export function sortByWalkingOrder(items: ShoppingItem[]): ShoppingItem[] {
  return [...items].sort((a, b) => {
    const orderA = SHOPPING_CATEGORY_META[a.category].walkOrder;
    const orderB = SHOPPING_CATEGORY_META[b.category].walkOrder;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name);
  });
}

const FORGOTTEN_STAPLES = ["milk", "bread", "eggs", "butter"];

/** Suggests commonly forgotten staples that aren't already on the list. */
export function suggestForgottenItems(items: ShoppingItem[]): string[] {
  const present = new Set(items.map((i) => i.name.trim().toLowerCase()));
  return FORGOTTEN_STAPLES.filter((staple) => !present.has(staple));
}

export function groupByCategory(
  items: ShoppingItem[],
): { category: ShoppingCategory; items: ShoppingItem[] }[] {
  const sorted = sortByWalkingOrder(items);
  const groups = new Map<ShoppingCategory, ShoppingItem[]>();
  for (const item of sorted) {
    const list = groups.get(item.category) ?? [];
    list.push(item);
    groups.set(item.category, list);
  }
  return [...groups.entries()].map(([category, items]) => ({ category, items }));
}
