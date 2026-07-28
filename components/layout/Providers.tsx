"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "./ThemeProvider";
import { TasksProvider } from "@/lib/context/TasksContext";
import { CelebrationProvider } from "@/lib/context/CelebrationContext";
import { UIProvider } from "@/lib/context/UIContext";
import { NotificationPermissionPrompt } from "./NotificationPermissionPrompt";
import { GlobalDialogs } from "./GlobalDialogs";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TasksProvider>
        <UIProvider>
          <CelebrationProvider>
            {children}
            <GlobalDialogs />
            <NotificationPermissionPrompt />
            <Toaster position="top-right" richColors closeButton />
          </CelebrationProvider>
        </UIProvider>
      </TasksProvider>
    </ThemeProvider>
  );
}
