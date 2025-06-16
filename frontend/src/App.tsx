import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import Home_Admin from "./pages/Home_Admin";
import Home from "./pages/Home";
import Login from "./auth/components/Login";
import Registro from "./auth/components/Registro";
import ProtectedRoute from "./auth/components/ProtectedRoute";

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("auth") === "true");

  // Escuchar cambios en localStorage para detectar logout/login en otras pestañas
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
            isAuth ? <Navigate to="/home" replace /> : <Login />
          }
        />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
