// App.tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Providers } from "./components/Providers";
import { AppRoutes } from "./components/AppRoutes";
import { Toasters } from "./components/Toasters";
import "./App.css";

function App() {
  return (
    <Providers>
      <Router>
        <div className="App min-h-screen bg-background text-foreground">
          <AppRoutes />
          <Toasters />
        </div>
      </Router>
    </Providers>
  );
}

export default App;