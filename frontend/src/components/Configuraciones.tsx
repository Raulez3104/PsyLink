import React, { useState, useEffect } from 'react';
import { getUsuario, updateUsuario } from "../auth/services/auth";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import styles from "../css/Configuraciones.module.css";

interface Usuario {
  nombre: string;
  paterno: string;
  materno: string;
  email: string;
  especialidad: string;
  fecNac: string;
}

const Configuraciones: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const response = await getUsuario();
        setUsuario(response.data);
        setForm(response.data);
      } catch (err) {
        setError('Error al obtener los datos del usuario');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    obtenerDatosUsuario();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditar = () => setEditando(true);

  const handleCancelar = () => {
    setForm(usuario);
    setEditando(false);
    setMensaje('');
  };

  const handleGuardar = async () => {
    if (!form) return;
    setLoading(true);
    setMensaje('');
    try {
      // Llama al backend para actualizar el usuario
      await updateUsuario(form);
      setUsuario(form);
      setEditando(false);
      setMensaje('Datos actualizados correctamente');
    } catch (err) {
      setError('Error al actualizar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-content-center align-items-center min-h-screen">Cargando...</div>;
  if (error) return <div className="flex justify-content-center align-items-center min-h-screen text-red-500">{error}</div>;
  if (!usuario || !form) return <div className="flex justify-content-center align-items-center min-h-screen">No se encontraron datos del usuario</div>;

  return (
    <div className={`flex flex-column md:flex-row min-h-screen w-full bg-primary-50 ${styles.bg}`}>
      {/* Perfil visual */}
      <div className="flex flex-column align-items-center justify-content-center md:w-4 w-full py-6 bg-primary-100">
        <div className={`border-circle bg-white flex align-items-center justify-content-center mb-3 ${styles.avatar}`} style={{ width: 120, height: 120 }}>
          <span className="pi pi-user text-6xl text-primary-400"></span>
        </div>
        <h2 className="text-2xl font-bold text-primary text-center mb-1">{usuario.nombre} {usuario.paterno}</h2>
        <div className="text-center text-700 mb-2">{usuario.email}</div>
        <div className="text-center text-600">{usuario.especialidad}</div>
      </div>
      <Divider layout="vertical" className="hidden md:flex" />
      {/* Formulario de edición */}
      <div className="flex-1 flex flex-column justify-content-center align-items-center py-6">
        <div className={`w-full md:w-8 lg:w-6 px-4`}>
          <h3 className="text-primary mb-3">Datos personales</h3>
          <div className="grid">
            <div className="col-12 md:col-6 mb-3">
              <label className={`block mb-1 text-primary ${styles.label}`}>Nombre:</label>
              <InputText name="nombre" value={form.nombre} onChange={handleChange} className="w-full" readOnly={!editando} />
            </div>
            <div className="col-12 md:col-6 mb-3">
              <label className={`block mb-1 text-primary ${styles.label}`}>Apellido Paterno:</label>
              <InputText name="paterno" value={form.paterno} onChange={handleChange} className="w-full" readOnly={!editando} />
            </div>
            <div className="col-12 md:col-6 mb-3">
              <label className={`block mb-1 text-primary ${styles.label}`}>Apellido Materno:</label>
              <InputText name="materno" value={form.materno} onChange={handleChange} className="w-full" readOnly={!editando} />
            </div>
            <div className="col-12 md:col-6 mb-3">
              <label className={`block mb-1 text-primary ${styles.label}`}>Email:</label>
              <InputText name="email" value={form.email} className="w-full" readOnly />
            </div>
            <div className="col-12 md:col-6 mb-3">
              <label className={`block mb-1 text-primary ${styles.label}`}>Especialidad:</label>
              <InputText name="especialidad" value={form.especialidad} onChange={handleChange} className="w-full" readOnly={!editando} />
            </div>
            <div className="col-12 md:col-6 mb-3">
              <label className={`block mb-1 text-primary ${styles.label}`}>Fecha de Nacimiento:</label>
              <InputText name="fecNac" value={form.fecNac} onChange={handleChange} className="w-full" readOnly={!editando} />
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-content-end">
            {!editando ? (
              <Button label="Editar" icon="pi pi-pencil" className="p-button-primary" onClick={handleEditar} />
            ) : (
              <>
                <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={handleGuardar} />
                <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={handleCancelar} />
              </>
            )}
          </div>
          {mensaje && <div className="mt-3 text-green-600">{mensaje}</div>}
        </div>
      </div>
    </div>
  );
};

export default Configuraciones;