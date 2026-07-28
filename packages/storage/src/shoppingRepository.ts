import { generateId } from "@momentum/core";
import type { ShoppingItem, ShoppingList } from "@momentum/types";
import type { StorageDriver } from "./driver";
import { readJson, writeJson } from "./json";

const DEFAULT_STORAGE_KEY = "momentum:shopping-lists";

/** Same swappable-repository pattern as `TaskRepository`. */
export interface ShoppingRepository {
  getAll(): Promise<ShoppingList[]>;
  createList(name: string): Promise<ShoppingList>;
  addItem(
    listId: string,
    item: Omit<ShoppingItem, "id" | "createdAt" | "checked">,
  ): Promise<ShoppingList | null>;
  updateItem(
    listId: string,
    itemId: string,
    patch: Partial<ShoppingItem>,
  ): Promise<ShoppingList | null>;
  removeItem(listId: string, itemId: string): Promise<ShoppingList | null>;
  removeList(listId: string): Promise<void>;
}

export function createShoppingRepository(
  driver: StorageDriver,
  storageKey = DEFAULT_STORAGE_KEY,
): ShoppingRepository {
  const save = (lists: ShoppingList[]) => writeJson(driver, storageKey, lists);
  const getAll = () => readJson<ShoppingList[]>(driver, storageKey, []);

  return {
    getAll,

    async createList(name) {
      const lists = await getAll();
      const list: ShoppingList = {
        id: generateId(),
        name,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await save([...lists, list]);
      return list;
    },

    async addItem(listId, item) {
      const lists = await getAll();
      let updated: ShoppingList | null = null;
      const next = lists.map((l) => {
        if (l.id !== listId) return l;
        updated = {
          ...l,
          updatedAt: new Date().toISOString(),
          items: [
            ...l.items,
            {
              ...item,
              id: generateId(),
              checked: false,
              createdAt: new Date().toISOString(),
            },
          ],
        };
        return updated;
      });
      if (updated) await save(next);
      return updated;
    },

    async updateItem(listId, itemId, patch) {
      const lists = await getAll();
      let updated: ShoppingList | null = null;
      const next = lists.map((l) => {
        if (l.id !== listId) return l;
        updated = {
          ...l,
          updatedAt: new Date().toISOString(),
          items: l.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
        };
        return updated;
      });
      if (updated) await save(next);
      return updated;
    },

    async removeItem(listId, itemId) {
      const lists = await getAll();
      let updated: ShoppingList | null = null;
      const next = lists.map((l) => {
        if (l.id !== listId) return l;
        updated = {
          ...l,
          updatedAt: new Date().toISOString(),
          items: l.items.filter((i) => i.id !== itemId),
        };
        return updated;
      });
      if (updated) await save(next);
      return updated;
    },

    async removeList(listId) {
      const lists = await getAll();
      await save(lists.filter((l) => l.id !== listId));
    },
  };
}
