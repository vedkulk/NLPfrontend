"use client";

import { Toaster as SonnerToaster } from "sonner";
import { type ReactNode } from "react";

// Cast to avoid TypeScript errors
export function AppToaster(): ReactNode {
  return <SonnerToaster position="top-right" richColors /> as ReactNode;
}