import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { loginUser } from "../services/auth";
import { AxiosError } from "axios";
import styles from "../../css/Login.module.scss";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("auth") === "true") {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, contrasena);
      alert(response.data.mensaje);
      localStorage.setItem("auth", "true");  // Aquí guardas sesión en localStorage
      navigate("/home");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          alert(error.response.data);
        } else {
          alert("Error al iniciar sesión");
        }
      } else {
        alert("Error inesperado");
        console.error(error);
      }
    }
  };

  return (
    <div
      className="flex justify-content-center align-items-center"
      style={{
        backgroundImage: "url('/fondo.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div className="grid w-full p-4 md:p-6">
        <div className="col-12 md:col-6 flex justify-content-center align-items-center">
          <Card className={`p-4 shadow-8 w-full max-w-25rem ${styles.card}`}>
            <form onSubmit={handleLogin} className="flex flex-column gap-3">
              <label htmlFor="email" className={styles.label}>
                Correo Electrónico
              </label>
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="password" className={styles.label}>
                Contraseña
              </label>
              <Password
                id="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                toggleMask
                feedback={false}
                required
              />
              <Button
                type="submit"
                label="Iniciar Sesión"
                className={styles.btnCustom}
              />
              <div className="text-center mt-3">
                <span className={styles.label}>¿No tienes una cuenta? </span>
                <Link to="/registro">Regístrate aquí</Link>
              </div>
            </form>
          </Card>
        </div>
        <div className="col-12 md:col-6 text-white flex flex-column justify-content-center align-items-center">
          <h1 className="text-5xl font-bold text-center mb-3">Psylink</h1>
          <h2 className="text-2xl text-center">
            Bienvenido, Inicie Sesión para comenzar
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Login;
