import type { StorageDriver } from "@momentum/storage";

/**
 * The only file in this app allowed to touch `window.localStorage` directly.
 * Everything else — repositories, contexts, components — talks to the
 * platform-agnostic `StorageDriver` interface from `@momentum/storage`.
 * SSR-safe: reads/writes are no-ops on the server.
 */
export const webStorageDriver: StorageDriver = {
  async getItem(key) {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  },

  async setItem(key, value) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  },

  async removeItem(key) {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  },
};
