// components/Toasters.tsx
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

export function Toasters() {
  return (
    <>
      <Toaster />
      <Sonner />
    </>
  );
}