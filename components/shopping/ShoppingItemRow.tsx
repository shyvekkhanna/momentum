"use client";

import { motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useShopping } from "@/lib/context/ShoppingContext";
import type { ShoppingItem } from "@/lib/types/shopping";
import { cn } from "@/lib/utils";

export function ShoppingItemRow({ item }: { item: ShoppingItem }) {
  const { toggleItem, removeItem, updateQuantity } = useShopping();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
    >
      <Checkbox checked={item.checked} onClick={() => toggleItem(item.id)} />
      <span className="text-base">{item.emoji}</span>
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm font-medium", item.checked && "text-muted-foreground line-through")}>
          {item.name}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Decrease quantity"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-4 text-center text-xs tabular-nums">{item.quantity}</span>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Increase quantity"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        ${(item.estimatedPrice * item.quantity).toFixed(2)}
      </span>
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label="Remove item"
        onClick={() => removeItem(item.id)}
        className="opacity-0 group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5 text-red-500" />
      </Button>
    </motion.div>
  );
}
