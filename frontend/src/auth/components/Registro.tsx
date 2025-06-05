// src/auth/components/Registro.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { registerUser } from "../services/auth";
import styles from "../../css/Registro.module.scss";


const Registro: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [paterno, setPaterno] = useState("");
  const [materno, setMaterno] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [fecNac, setFecNac] = useState<Date | null>(null);
  const [especialidad, setEspecialidad] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser({
        nombre,
        paterno,
        materno,
        email,
        contrasena,
        fecNac,
        especialidad,
      });
      alert("Registro exitoso");
      navigate("/");
    } catch (error) {
      alert("Error en el registro");
      console.error(error);
    }
  };

  return (
    <div
      className="flex justify-content-center align-items-center"
      style={{
       backgroundImage: "url('/fondo.png')",
        width: "100%",

        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <div className="grid w-full p-4 md:p-6">
        <div className="col-12 md:col-6 text-white flex flex-column justify-content-center align-items-center">
          <h1 className="text-4xl font-bold text-center mb-3">Psylink</h1>
          <h2 className="text-2xl text-center">Registro de Psicólogo</h2>
        </div>

        <div className="col-12 md:col-6 flex justify-content-center align-items-center">
          <Card className={`p-4 shadow-8 ${styles.card}`}>
            <form onSubmit={handleRegistro} className="flex flex-column gap-3">
              <label className={styles.label}>Nombre:</label>
              <InputText value={nombre} onChange={(e) => setNombre(e.target.value)} required />

              <label className={styles.label}>Apellido Paterno:</label>
              <InputText value={paterno} onChange={(e) => setPaterno(e.target.value)} required />

              <label className={styles.label}>Apellido Materno:</label>
              <InputText value={materno} onChange={(e) => setMaterno(e.target.value)} required />

              <label className={styles.label}>Email:</label>
              <InputText type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

              <label className={styles.label}>Contraseña:</label>
              <Password value={contrasena} onChange={(e) => setContrasena(e.target.value)} toggleMask feedback={false} required />

              <label className={styles.label}>Fecha de Nacimiento:</label>
              <Calendar value={fecNac} onChange={(e) => setFecNac(e.value as Date)} dateFormat="yy-mm-dd" showIcon required readOnlyInput />

              <label className={styles.label}>Especialidad:</label>
              <InputText value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} required />

              <Button type="submit" label="Registrarse" className={styles.btnCustom} />

              <div className="text-center mt-3">
                <span className={styles.label}>¿Ya tienes una cuenta? </span>
                <Link to="/">Inicia sesión</Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Registro;
