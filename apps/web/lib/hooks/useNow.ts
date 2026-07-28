"use client";

import { useSyncExternalStore } from "react";

const SERVER_SNAPSHOT = new Date(0);

interface Clock {
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => Date;
}

const clocks = new Map<number, Clock>();

function getClock(intervalMs: number): Clock {
  let clock = clocks.get(intervalMs);
  if (clock) return clock;

  let value = new Date();
  let timer: ReturnType<typeof setInterval> | null = null;
  const listeners = new Set<() => void>();

  clock = {
    subscribe(callback) {
      listeners.add(callback);
      if (!timer) {
        timer = setInterval(() => {
          value = new Date();
          listeners.forEach((l) => l());
        }, intervalMs);
      }
      return () => {
        listeners.delete(callback);
        if (listeners.size === 0 && timer) {
          clearInterval(timer);
          timer = null;
        }
      };
    },
    getSnapshot: () => value,
  };
  clocks.set(intervalMs, clock);
  return clock;
}

/** Reads the wall clock as a cached external store, re-rendering every `intervalMs`. */
export function useNow(intervalMs = 60_000): Date {
  const clock = getClock(intervalMs);
  return useSyncExternalStore(clock.subscribe, clock.getSnapshot, () => SERVER_SNAPSHOT);
}
