// routes/MiscRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import NotFound from "../pages/NotFound";

export function MiscRoutes() {
  return (
    <>
      <Route path="*" element={<NotFound />} />
    </>
  );
}