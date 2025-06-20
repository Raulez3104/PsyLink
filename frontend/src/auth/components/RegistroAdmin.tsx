import { useState } from 'react';
import axios from 'axios';

const RegistroAdmin = () => {
  const [form, setForm] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    email: '',
    password: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/api/register-admin', form);
      setMensaje(response.data.mensaje || 'Registro exitoso');
      setForm({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        fecha_nacimiento: '',
        email: '',
        password: ''
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data || 'Error al registrar');
      } else {
        setError('Error inesperado');
      }
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Registro de Administrador</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input type="text" name="apellido_paterno" placeholder="Apellido paterno" value={form.apellido_paterno} onChange={handleChange} required />
        <input type="text" name="apellido_materno" placeholder="Apellido materno" value={form.apellido_materno} onChange={handleChange} required />
        <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
        <button type="submit">Registrarse</button>
      </form>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RegistroAdmin;
