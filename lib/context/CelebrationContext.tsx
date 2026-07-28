"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CompletionCoin, type Particle } from "@/components/animations/CompletionCoin";

const PARTICLE_COUNT = 10;

interface Celebration {
  id: string;
  x: number;
  y: number;
  particles: Particle[];
}

interface CelebrationContextValue {
  celebrate: (origin: { x: number; y: number }) => void;
}

const CelebrationContext = createContext<CelebrationContextValue | null>(null);

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.4;
    const distance = 40 + Math.random() * 30;
    return {
      id: i,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      delay: 0.55 + Math.random() * 0.1,
    };
  });
}

export function CelebrationProvider({ children }: { children: React.ReactNode }) {
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);

  const celebrate = useCallback((origin: { x: number; y: number }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setCelebrations((prev) => [
      ...prev,
      { id, x: origin.x, y: origin.y, particles: generateParticles() },
    ]);
  }, []);

  const remove = useCallback((id: string) => {
    setCelebrations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      {children}
      {celebrations.map((c) => (
        <CompletionCoin
          key={c.id}
          x={c.x}
          y={c.y}
          particles={c.particles}
          onDone={() => remove(c.id)}
        />
      ))}
    </CelebrationContext.Provider>
  );
}

export function useCelebration(): CelebrationContextValue {
  const ctx = useContext(CelebrationContext);
  if (!ctx) throw new Error("useCelebration must be used within a CelebrationProvider");
  return ctx;
}
