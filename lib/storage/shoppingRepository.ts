import type { ShoppingItem, ShoppingList } from "@/lib/types/shopping";
import { generateId } from "@/lib/utils";
import { readJson, writeJson } from "./localStorage";

const STORAGE_KEY = "momentum:shopping-lists";

/**
 * Same swappable-repository pattern as `TaskRepository` — designed now so
 * the future Shopping Lists feature can move to Supabase without a rewrite.
 */
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

export class LocalStorageShoppingRepository implements ShoppingRepository {
  async getAll(): Promise<ShoppingList[]> {
    return readJson<ShoppingList[]>(STORAGE_KEY, []);
  }

  private async save(lists: ShoppingList[]) {
    writeJson(STORAGE_KEY, lists);
  }

  async createList(name: string): Promise<ShoppingList> {
    const lists = await this.getAll();
    const list: ShoppingList = {
      id: generateId(),
      name,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await this.save([...lists, list]);
    return list;
  }

  async addItem(
    listId: string,
    item: Omit<ShoppingItem, "id" | "createdAt" | "checked">,
  ): Promise<ShoppingList | null> {
    const lists = await this.getAll();
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
    if (updated) await this.save(next);
    return updated;
  }

  async updateItem(
    listId: string,
    itemId: string,
    patch: Partial<ShoppingItem>,
  ): Promise<ShoppingList | null> {
    const lists = await this.getAll();
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
    if (updated) await this.save(next);
    return updated;
  }

  async removeItem(listId: string, itemId: string): Promise<ShoppingList | null> {
    const lists = await this.getAll();
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
    if (updated) await this.save(next);
    return updated;
  }

  async removeList(listId: string): Promise<void> {
    const lists = await this.getAll();
    await this.save(lists.filter((l) => l.id !== listId));
  }
}

export const shoppingRepository: ShoppingRepository =
  new LocalStorageShoppingRepository();
