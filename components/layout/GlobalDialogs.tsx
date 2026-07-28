"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { CommandPalette } from "@/components/search/CommandPalette";
import { useUI } from "@/lib/context/UIContext";

export function GlobalDialogs() {
  const { createTaskOpen, setCreateTaskOpen } = useUI();

  return (
    <>
      <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
          </DialogHeader>
          <TaskForm onDone={() => setCreateTaskOpen(false)} />
        </DialogContent>
      </Dialog>
      <CommandPalette />
    </>
  );
}
