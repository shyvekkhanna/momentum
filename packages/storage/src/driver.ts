/**
 * Minimal async key-value contract every platform must provide. The web app
 * backs this with `window.localStorage`; a future Expo app backs it with
 * `@react-native-async-storage/async-storage`. Nothing above this layer is
 * allowed to touch a platform storage API directly.
 */
export interface StorageDriver {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
