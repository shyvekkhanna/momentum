"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export interface Particle {
  id: number;
  dx: number;
  dy: number;
  delay: number;
}

interface CompletionCoinProps {
  x: number;
  y: number;
  particles: Particle[];
  onDone: () => void;
}

/**
 * The Mario-inspired completion celebration: a glossy green 3D coin with a
 * checkmark that bounces, sweeps a shine across itself, flies upward, and
 * explodes into a small burst of sparkle particles before disappearing.
 */
export function CompletionCoin({ x, y, particles, onDone }: CompletionCoinProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="pointer-events-none fixed z-[100]"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      <motion.div
        className="relative h-14 w-14 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, #a8f5c8 0%, #34d17c 42%, #189a55 78%, #0f7a41 100%)",
          boxShadow:
            "0 2px 4px rgba(15,122,65,0.4), 0 8px 20px rgba(15,122,65,0.35), inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -3px 4px rgba(0,0,0,0.25)",
        }}
        initial={{ scale: 0.2, opacity: 0, rotate: -20, y: 0 }}
        animate={{
          scale: [0.2, 1.15, 1, 1, 0.9],
          opacity: [0, 1, 1, 1, 0],
          rotate: [-20, 8, -6, 4, 0],
          y: [0, -6, -10, -70, -120],
        }}
        transition={{
          duration: 1.4,
          times: [0, 0.18, 0.3, 0.75, 1],
          ease: ["backOut", "easeOut", "easeInOut", "easeIn"],
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Check className="h-7 w-7 text-white drop-shadow-sm" strokeWidth={3.5} />
        </div>

        {/* shine sweep */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-full"
          initial={{ opacity: 1 }}
        >
          <motion.div
            className="absolute top-0 h-full w-4 -skew-x-12 bg-white/70"
            initial={{ left: "-30%" }}
            animate={{ left: "130%" }}
            transition={{ duration: 0.55, delay: 0.15, ease: "easeInOut" }}
          />
        </motion.div>

        {/* sparkles ring at spawn */}
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-yellow-200"
            style={{
              left: "50%",
              top: "50%",
              boxShadow: "0 0 6px 1px rgba(253,224,71,0.9)",
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: Math.cos((i / 3) * Math.PI * 2) * 26,
              y: Math.sin((i / 3) * Math.PI * 2) * 26,
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
            }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
        ))}
      </motion.div>

      {/* particle explosion on landing */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
          style={{
            background: p.id % 2 === 0 ? "#34d17c" : "#fde047",
          }}
          initial={{ x: 0, y: -70, opacity: 0, scale: 0 }}
          animate={{
            x: p.dx,
            y: -70 + p.dy,
            opacity: [0, 1, 0],
            scale: [0, 1, 0.3],
          }}
          transition={{ duration: 0.6, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
