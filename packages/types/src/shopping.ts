export type ShoppingCategory =
  | "produce"
  | "bakery"
  | "meat"
  | "dairy"
  | "frozen"
  | "beverages"
  | "household"
  | "other";

export const SHOPPING_CATEGORY_META: Record<
  ShoppingCategory,
  { label: string; emoji: string; walkOrder: number }
> = {
  produce: { label: "Produce", emoji: "🥬", walkOrder: 0 },
  bakery: { label: "Bakery", emoji: "🍞", walkOrder: 1 },
  meat: { label: "Meat", emoji: "🍗", walkOrder: 2 },
  dairy: { label: "Dairy", emoji: "🥛", walkOrder: 3 },
  frozen: { label: "Frozen", emoji: "🧊", walkOrder: 4 },
  beverages: { label: "Beverages", emoji: "🥤", walkOrder: 5 },
  household: { label: "Household", emoji: "🧼", walkOrder: 6 },
  other: { label: "Other", emoji: "🛒", walkOrder: 7 },
};

export interface ShoppingItem {
  id: string;
  name: string;
  emoji: string;
  category: ShoppingCategory;
  quantity: number;
  estimatedPrice: number;
  checked: boolean;
  createdAt: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: string;
  updatedAt: string;
}

export type NewShoppingItemInput = Pick<ShoppingItem, "name" | "quantity">;
