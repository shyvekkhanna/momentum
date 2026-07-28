"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddItemInput } from "@/components/shopping/AddItemInput";
import { ShoppingItemRow } from "@/components/shopping/ShoppingItemRow";
import { ShoppingProvider, useShopping } from "@/lib/context/ShoppingContext";
import { groupByCategory, suggestForgottenItems } from "@/lib/ai/shopping";
import { SHOPPING_CATEGORY_META } from "@/lib/types/shopping";

function ShoppingContent() {
  const { list, loading, addItem } = useShopping();

  if (loading || !list) {
    return <div className="h-40" />;
  }

  const groups = groupByCategory(list.items);
  const forgotten = suggestForgottenItems(list.items);
  const total = list.items.reduce((sum, i) => sum + i.estimatedPrice * i.quantity, 0);
  const remaining = list.items.filter((i) => !i.checked).length;

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Shopping</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI groups, dedupes and orders your list by aisle.
        </p>
      </div>

      <AddItemInput />

      {forgotten.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" /> Often forgotten:
          </span>
          {forgotten.map((item) => (
            <Button key={item} size="sm" variant="subtle" onClick={() => addItem(item)}>
              + {item}
            </Button>
          ))}
        </motion.div>
      )}

      {list.items.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          Your list is empty — add something above.
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {groups.map(({ category, items }) => (
                <motion.div key={category} layout>
                  <Card className="p-4">
                    <p className="mb-1.5 px-1 text-xs font-semibold text-muted-foreground">
                      {SHOPPING_CATEGORY_META[category].emoji} {SHOPPING_CATEGORY_META[category].label}
                    </p>
                    <div className="flex flex-col">
                      <AnimatePresence initial={false}>
                        {items.map((item) => (
                          <ShoppingItemRow key={item.id} item={item} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Card className="flex items-center justify-between p-4">
            <p className="text-sm text-muted-foreground">
              {remaining} item{remaining === 1 ? "" : "s"} left
            </p>
            <p className="text-sm font-semibold">Est. total ${total.toFixed(2)}</p>
          </Card>
        </>
      )}
    </div>
  );
}

export default function ShoppingPage() {
  return (
    <AppShell>
      <ShoppingProvider>
        <ShoppingContent />
      </ShoppingProvider>
    </AppShell>
  );
}
