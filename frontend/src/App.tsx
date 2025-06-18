import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import Home from "./pages/Home";
import Login from "./auth/components/Login";
import Registro from "./auth/components/Registro";
import ProtectedRoute from "./auth/components/ProtectedRoute";
import App2 from "./App2";
import Inicio from "./pages/Inicio";
import Servicio from "./pages/Servicio_Web";
import AcercaDe from "./pages/AcercaDe_Web";

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("auth") === "true");

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuth(localStorage.getItem("auth") === "true");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <App2>
              <Inicio />
            </App2>
          }
        />
        <Route
          path="/servicios"
          element={
            <App2>
              <Servicio />
            </App2>
          }
        />
        <Route
          path="/acerca-de"
          element={
            <App2>
              <AcercaDe />
            </App2>
          }
        />
        <Route path="/login" element={isAuth ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;