import { generateId } from "@momentum/core";
import type { NewTaskInput, Task } from "@momentum/types";
import type { StorageDriver } from "./driver";
import { readJson, writeJson } from "./json";

const DEFAULT_STORAGE_KEY = "momentum:tasks";

/**
 * Storage-agnostic contract for task persistence. Implementations differ by
 * driver (web localStorage today, AsyncStorage or Supabase later) but every
 * consumer — context, components — talks only to this interface.
 */
export interface TaskRepository {
  getAll(): Promise<Task[]>;
  create(input: NewTaskInput & { emoji: string }): Promise<Task>;
  update(id: string, patch: Partial<Task>): Promise<Task | null>;
  remove(id: string): Promise<void>;
}

export function createTaskRepository(
  driver: StorageDriver,
  storageKey = DEFAULT_STORAGE_KEY,
): TaskRepository {
  const getAll = () => readJson<Task[]>(driver, storageKey, []);

  return {
    getAll,

    async create(input) {
      const tasks = await getAll();
      const task: Task = {
        ...input,
        id: generateId(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      await writeJson(driver, storageKey, [...tasks, task]);
      return task;
    },

    async update(id, patch) {
      const tasks = await getAll();
      let updated: Task | null = null;
      const next = tasks.map((t) => {
        if (t.id !== id) return t;
        updated = { ...t, ...patch };
        return updated;
      });
      if (updated) await writeJson(driver, storageKey, next);
      return updated;
    },

    async remove(id) {
      const tasks = await getAll();
      await writeJson(
        driver,
        storageKey,
        tasks.filter((t) => t.id !== id),
      );
    },
  };
}
