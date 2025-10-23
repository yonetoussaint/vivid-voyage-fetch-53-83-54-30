// routes/CategoryRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import CachedRoute from "../components/CachedRoute";
import CategoriesPage from "../pages/CategoriesPage";
import FashionPage from "../pages/FashionPage";
import ElectronicsPage from "../pages/ElectronicsPage";
import HomeLivingPage from "../pages/HomeLivingPage";
import MenPage from "../pages/MenPage";
import WomenPage from "../pages/WomenPage";
import BooksHomepage from "../pages/BooksHomepage";
import SportsOutdoorsPage from "../pages/SportsOutdoorsPage";
import AutomotivePage from "../pages/AutomotivePage";
import KidsHobbiesPage from "../pages/KidsHobbiesPage";
import EntertainmentPage from "../pages/EntertainmentPage";

export function CategoryRoutes() {
  return (
    <>
      <Route path="categories" element={
        <CachedRoute>
          <CategoriesPage />
        </CachedRoute>
      } />
      <Route path="categories/fashion" element={
        <CachedRoute>
          <FashionPage />
        </CachedRoute>
      } />
      <Route path="categories/electronics" element={
        <CachedRoute>
          <ElectronicsPage />
        </CachedRoute>
      } />
      <Route path="categories/home-living" element={
        <CachedRoute>
          <HomeLivingPage />
        </CachedRoute>
      } />
      <Route path="categories/women" element={
        <CachedRoute>
          <WomenPage />
        </CachedRoute>
      } />
      <Route path="categories/men" element={
        <CachedRoute>
          <MenPage />
        </CachedRoute>
      } />
      <Route path="categories/books" element={
        <CachedRoute>
          <BooksHomepage />
        </CachedRoute>
      } />
      <Route path="categories/sports-outdoors" element={
        <CachedRoute>
          <SportsOutdoorsPage />
        </CachedRoute>
      } />
      <Route path="categories/automotive" element={
        <CachedRoute>
          <AutomotivePage />
        </CachedRoute>
      } />
      <Route path="categories/kids-hobbies" element={
        <CachedRoute>
          <KidsHobbiesPage />
        </CachedRoute>
      } />
      <Route path="categories/entertainment" element={
        <CachedRoute>
          <EntertainmentPage />
        </CachedRoute>
      } />
    </>
  );
}