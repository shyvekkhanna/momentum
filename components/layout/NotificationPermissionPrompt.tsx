"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getPermissionState,
  isBrowserNotificationSupported,
  requestNotificationPermission,
} from "@/lib/notifications/notificationManager";

const DISMISS_KEY = "momentum:notif-prompt-dismissed";

export function NotificationPermissionPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isBrowserNotificationSupported()) return;
    const dismissed = window.localStorage.getItem(DISMISS_KEY);
    if (dismissed) return;
    if (getPermissionState() === "default") {
      const timer = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const enable = async () => {
    await requestNotificationPermission();
    dismiss();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-black/5 bg-white/90 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/90 sm:left-5 sm:translate-x-0"
        >
          <button
            onClick={dismiss}
            className="absolute right-3 top-3 rounded-full p-1 text-neutral-400 transition hover:bg-black/5 hover:text-neutral-600 dark:hover:bg-white/10"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-start gap-3 pr-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                Stay on schedule
              </p>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                Get a nudge 5 minutes before every task starts.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={enable}>
                  Enable notifications
                </Button>
                <Button size="sm" variant="ghost" onClick={dismiss}>
                  Not now
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
