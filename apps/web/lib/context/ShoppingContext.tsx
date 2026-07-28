"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ShoppingItem, ShoppingList } from "@momentum/types";
import { categorizeItem, estimatePrice } from "@momentum/core";
import { shoppingRepository } from "@/lib/storage";

interface ShoppingContextValue {
  list: ShoppingList | null;
  loading: boolean;
  addItem: (name: string, quantity?: number) => Promise<void>;
  toggleItem: (itemId: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
}

const ShoppingContext = createContext<ShoppingContextValue | null>(null);

export function ShoppingProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const lists = await shoppingRepository.getAll();
      if (lists.length > 0) {
        setList(lists[0]);
      } else {
        const created = await shoppingRepository.createList("Groceries");
        setList(created);
      }
      setLoading(false);
    })();
  }, []);

  const addItem = useCallback(
    async (name: string, quantity = 1) => {
      if (!list) return;
      const trimmed = name.trim();
      if (!trimmed) return;

      const existing = list.items.find((i) => i.name.toLowerCase() === trimmed.toLowerCase());
      if (existing) {
        const updated = await shoppingRepository.updateItem(list.id, existing.id, {
          quantity: existing.quantity + quantity,
        });
        if (updated) setList(updated);
        return;
      }

      const { category, emoji } = categorizeItem(trimmed);
      const updated = await shoppingRepository.addItem(list.id, {
        name: trimmed,
        emoji,
        category,
        quantity,
        estimatedPrice: estimatePrice(trimmed),
      });
      if (updated) setList(updated);
    },
    [list],
  );

  const toggleItem = useCallback(
    async (itemId: string) => {
      if (!list) return;
      const item = list.items.find((i) => i.id === itemId);
      if (!item) return;
      const updated = await shoppingRepository.updateItem(list.id, itemId, { checked: !item.checked });
      if (updated) setList(updated);
    },
    [list],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!list) return;
      const updated = await shoppingRepository.removeItem(list.id, itemId);
      if (updated) setList(updated);
    },
    [list],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!list || quantity < 1) return;
      const updated = await shoppingRepository.updateItem(list.id, itemId, { quantity });
      if (updated) setList(updated);
    },
    [list],
  );

  return (
    <ShoppingContext.Provider value={{ list, loading, addItem, toggleItem, removeItem, updateQuantity }}>
      {children}
    </ShoppingContext.Provider>
  );
}

export function useShopping(): ShoppingContextValue {
  const ctx = useContext(ShoppingContext);
  if (!ctx) throw new Error("useShopping must be used within a ShoppingProvider");
  return ctx;
}

export type { ShoppingItem };
