import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";


import Contacto from "./Contacto";
import Home from "./pages/Home";
import Login from "./auth/components/Login";
import Registro from "./auth/components/Registro";
import ProtectedRoute from "./auth/components/ProtectedRoute";
import App2 from "./App2";
import Inicio from "./pages/Inicio";
import Servicio from "./pages/Servicio_Web";
import AcercaDe from "./pages/AcercaDe_Web";
import Home_Admin from "./pages/Home_Admin";
import "./App.css";
import { locale, addLocale } from "primereact/api";

addLocale("es", {
  accept: "Aceptar",
  reject: "Cancelar",
  choose: "Elegir",
  upload: "Subir",
  cancel: "Cancelar",
  dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
  dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
  dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
  monthNames: [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ],
  monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  today: "Hoy",
  clear: "Limpiar",
  weekHeader: "Sm",
  firstDayOfWeek: 1,
  dateFormat: "dd/mm/yy",
  weak: "Débil",
  medium: "Medio",
  strong: "Fuerte",
  passwordPrompt: "Ingrese una contraseña",
  emptyFilterMessage: "No se encontraron resultados",
  emptyMessage: "No hay opciones disponibles",
});

locale("es");

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("auth") === "true");

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuth(localStorage.getItem("auth") === "true");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Leer rol desde localStorage
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/"
          element={
            <App2>
              <Inicio />
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
        <Route
          path="/contacto"
          element={
            <App2>
              <Contacto />
            </App2>
          }
        />
        <Route path="/registro" element={<Registro />} />
        {/* Login solo si no está autenticado */}
        <Route
          path="/login"
          element={
            isAuth ? (
              role === "admin" ? (
                <Navigate to="/home_admin" replace />
              ) : (
                <Navigate to="/home" replace />
              )
            ) : (
              <Login />
            )
          }
        />
        {/* Rutas protegidas con rol */}
        <Route
          path="/home_admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Home_Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["psicologo"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        {/* Ruta catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
