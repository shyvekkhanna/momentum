import type { NewTaskInput, Task } from "@/lib/types/task";
import { generateId } from "@/lib/utils";
import { readJson, writeJson } from "./localStorage";

const STORAGE_KEY = "momentum:tasks";

/**
 * Storage-agnostic contract for task persistence. The local-storage
 * implementation below can be swapped for a Supabase-backed one later
 * without touching any component or the TasksContext that consumes it.
 */
export interface TaskRepository {
  getAll(): Promise<Task[]>;
  create(input: NewTaskInput & { emoji: string }): Promise<Task>;
  update(id: string, patch: Partial<Task>): Promise<Task | null>;
  remove(id: string): Promise<void>;
}

export class LocalStorageTaskRepository implements TaskRepository {
  async getAll(): Promise<Task[]> {
    return readJson<Task[]>(STORAGE_KEY, []);
  }

  async create(input: NewTaskInput & { emoji: string }): Promise<Task> {
    const tasks = await this.getAll();
    const task: Task = {
      ...input,
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    writeJson(STORAGE_KEY, [...tasks, task]);
    return task;
  }

  async update(id: string, patch: Partial<Task>): Promise<Task | null> {
    const tasks = await this.getAll();
    let updated: Task | null = null;
    const next = tasks.map((t) => {
      if (t.id !== id) return t;
      updated = { ...t, ...patch };
      return updated;
    });
    if (updated) writeJson(STORAGE_KEY, next);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const tasks = await this.getAll();
    writeJson(
      STORAGE_KEY,
      tasks.filter((t) => t.id !== id),
    );
  }
}

export const taskRepository: TaskRepository = new LocalStorageTaskRepository();
