import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Providers } from "./components/Providers";
import { Toasters } from "./components/Toasters";
import Index from "./pages/Index"; // Import the Index page
import ProfilePage from "./pages/ProfilePage";
import CouponsPage from "./pages/CouponsPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Providers>
        <div className="App min-h-screen h-full bg-background text-foreground flex flex-col">
          <Routes>
            <Route path="/" element={<Index />} /> {/* Index as homepage */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/coupons" element={<CouponsPage />} />
            {/* Add other routes here as needed */}
          </Routes>
          <Toasters />
        </div>
      </Providers>
    </Router>
  );
}

export default App;