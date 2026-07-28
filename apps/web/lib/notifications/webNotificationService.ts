import { toast } from "sonner";
import type { NotificationPermissionState, NotificationService, ReminderContent } from "@momentum/notifications";

/**
 * The only file in this app allowed to touch the browser `Notification` API.
 * Everything else — the reminder hook, contexts, components — talks to the
 * platform-agnostic `NotificationService` interface from
 * `@momentum/notifications`. Falls back to an in-app toast whenever a real
 * OS notification can't be shown, so a reminder is never silently dropped.
 */
export const webNotificationService: NotificationService = {
  isSupported() {
    return typeof window !== "undefined" && "Notification" in window;
  },

  getPermissionState(): NotificationPermissionState {
    if (!webNotificationService.isSupported()) return "unsupported";
    return Notification.permission;
  },

  /** Ask for permission once, on first launch. Safe to call repeatedly — the
   * browser only prompts when permission is still in the "default" state. */
  async requestPermission(): Promise<NotificationPermissionState> {
    if (!webNotificationService.isSupported()) return "unsupported";
    if (Notification.permission !== "default") return Notification.permission;
    try {
      return await Notification.requestPermission();
    } catch {
      return "denied";
    }
  },

  notify({ title, body, emoji, tag }: ReminderContent) {
    if (webNotificationService.getPermissionState() === "granted") {
      try {
        const notification = new Notification(title, { body, icon: "/favicon.ico", tag });
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
        return;
      } catch {
        // Fall through to in-app toast below.
      }
    }

    toast(title, { description: body, icon: emoji });
  },
};
