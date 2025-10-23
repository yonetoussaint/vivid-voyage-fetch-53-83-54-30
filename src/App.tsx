// App.tsx
import React from "react";
import { Providers } from "./components/Providers";
import { AppRoutes } from "./components/AppRoutes";
import { Toasters } from "./components/Toasters";
import "./App.css";

function App() {
  return (
    <Providers>
      <div className="App min-h-screen bg-background text-foreground">
        <AppRoutes />
        <Toasters />
      </div>
    </Providers>
  );
}

export default App;