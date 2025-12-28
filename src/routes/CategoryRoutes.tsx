// routes/CategoryRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import CategoriesPage from "../pages/CategoriesPage";
import FashionPage from "../pages/FashionPage";
import ElectronicsPage from "../pages/ElectronicsPage";
import HomeLivingPage from "../pages/HomeLivingPage";
import MenPage from "../pages/MenPage";
import WomenPage from "../pages/WomenPage";
import BooksHomepage from "../pages/BooksHomepage";
import AutomotivePage from "../pages/AutomotivePage";
import KidsHobbiesPage from "../pages/KidsHobbiesPage";

export function CategoryRoutes() {
  return (
    <>
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="categories/fashion" element={<FashionPage />} />
      <Route path="categories/electronics" element={<ElectronicsPage />} />
      <Route path="categories/home-living" element={<HomeLivingPage />} />
      <Route path="categories/women" element={<WomenPage />} />
      <Route path="categories/men" element={<MenPage />} />
      <Route path="categories/books" element={<BooksHomepage />} />
      <Route path="categories/automotive" element={<AutomotivePage />} />
      <Route path="categories/kids-hobbies" element={<KidsHobbiesPage />} />
    </>
  );
}