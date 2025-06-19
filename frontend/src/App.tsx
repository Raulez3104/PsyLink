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
import "./App.css";
import { locale, addLocale } from 'primereact/api';

addLocale('es', {
  accept: 'Aceptar',
  reject: 'Cancelar',
  choose: 'Elegir',
  upload: 'Subir',
  cancel: 'Cancelar',
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ],
  monthNamesShort: [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
  ],
  today: 'Hoy',
  clear: 'Limpiar',
  weekHeader: 'Sm',
  firstDayOfWeek: 1,
  dateFormat: 'dd/mm/yy',
  weak: 'Débil',
  medium: 'Medio',
  strong: 'Fuerte',
  passwordPrompt: 'Ingrese una contraseña',
  emptyFilterMessage: 'No se encontraron resultados',
  emptyMessage: 'No hay opciones disponibles'
});

locale('es');

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