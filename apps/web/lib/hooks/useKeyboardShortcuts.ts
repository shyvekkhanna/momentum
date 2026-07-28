"use client";

import { useEffect } from "react";

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export interface ShortcutHandlers {
  onNewTask?: () => void;
  onSearch?: () => void;
  onNavigate?: (key: "1" | "2" | "3" | "4") => void;
  onToggleTheme?: () => void;
}

/** Global, single-key shortcuts. Ignored while the user is typing in a field. */
export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;

      if (isMeta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handlers.onSearch?.();
        return;
      }

      if (isTypingTarget(e.target) || isMeta || e.altKey) return;

      switch (e.key) {
        case "n":
          e.preventDefault();
          handlers.onNewTask?.();
          break;
        case "/":
          e.preventDefault();
          handlers.onSearch?.();
          break;
        case "1":
        case "2":
        case "3":
        case "4":
          handlers.onNavigate?.(e.key);
          break;
        case "d":
          handlers.onToggleTheme?.();
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
}
