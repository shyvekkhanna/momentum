import type { StorageDriver } from "./driver";

export async function readJson<T>(
  driver: StorageDriver,
  key: string,
  fallback: T,
): Promise<T> {
  try {
    const raw = await driver.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(
  driver: StorageDriver,
  key: string,
  value: T,
): Promise<void> {
  try {
    await driver.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (e.g. private browsing) — fail silently.
  }
}
