"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useShopping } from "@/lib/context/ShoppingContext";

export function AddItemInput() {
  const { addItem } = useShopping();
  const [value, setValue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    addItem(value);
    setValue("");
  };

  return (
    <form onSubmit={submit} className="relative">
      <Plus className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add an item — e.g. Milk, Chicken, Soap…"
        className="h-11 rounded-full pl-10"
      />
    </form>
  );
}
