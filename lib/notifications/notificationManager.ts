import { toast } from "sonner";
import type { Task } from "@/lib/types/task";

export type NotificationPermissionState = "granted" | "denied" | "default" | "unsupported";

export function isBrowserNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getPermissionState(): NotificationPermissionState {
  if (!isBrowserNotificationSupported()) return "unsupported";
  return Notification.permission;
}

/** Ask for permission once, on first launch. Safe to call repeatedly — the
 * browser only prompts when permission is still in the "default" state. */
export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!isBrowserNotificationSupported()) return "unsupported";
  if (Notification.permission !== "default") return Notification.permission;
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return "denied";
  }
}

function reminderCopy(task: Task, minutesRemaining: number) {
  const timeLabel = minutesRemaining <= 0 ? "now" : `in ${minutesRemaining} minute${minutesRemaining === 1 ? "" : "s"}`;
  return {
    title: `${task.emoji} ${task.title}`,
    body: `Starts ${timeLabel}!`,
  };
}

/** Fires a browser notification when permitted, otherwise falls back to an
 * in-app toast so the reminder is never silently dropped. */
export function sendTaskReminder(task: Task, minutesRemaining = 5): void {
  const { title, body } = reminderCopy(task, minutesRemaining);

  if (getPermissionState() === "granted") {
    try {
      const notification = new Notification(title, {
        body,
        icon: "/favicon.ico",
        tag: `momentum-task-${task.id}`,
      });
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      return;
    } catch {
      // Fall through to in-app toast below.
    }
  }

  toast(title, { description: body, icon: task.emoji });
}
