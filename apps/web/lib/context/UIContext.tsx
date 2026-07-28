"use client";

import { createContext, useContext, useState } from "react";

interface UIContextValue {
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
  createTaskOpen: boolean;
  setCreateTaskOpen: (v: boolean) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  return (
    <UIContext.Provider
      value={{ commandPaletteOpen, setCommandPaletteOpen, createTaskOpen, setCreateTaskOpen }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within a UIProvider");
  return ctx;
}
