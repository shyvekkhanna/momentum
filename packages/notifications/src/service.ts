export type NotificationPermissionState = "granted" | "denied" | "default" | "unsupported";

export interface ReminderContent {
  title: string;
  body: string;
  emoji: string;
  tag?: string;
}

/**
 * Platform boundary for reminders. The web app implements this with the
 * browser `Notification` API (falling back to an in-app toast); a future
 * Expo app would implement it with `expo-notifications`. Nothing above this
 * layer is allowed to touch a platform notification API directly.
 */
export interface NotificationService {
  isSupported(): boolean;
  getPermissionState(): NotificationPermissionState;
  requestPermission(): Promise<NotificationPermissionState>;
  notify(content: ReminderContent): void | Promise<void>;
}
