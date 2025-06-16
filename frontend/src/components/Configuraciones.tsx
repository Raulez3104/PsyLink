import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        // Verificar autenticación
        if (localStorage.getItem('auth') !== 'true') {
          setError('No hay sesión activa');
          return;
        }

        // Hacer la petición al backend
        const response = await axios.get('http://localhost:4000/api/usuario');
        setUsuario(response.data);
      } catch (err) {
        setError('Error al obtener los datos del usuario');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    obtenerDatosUsuario();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!usuario) return <div>No se encontraron datos del usuario</div>;

  return (
    <div className="container mt-4">
      <h2>Configuración de Perfil</h2>
      <div className="card p-4">
        <div className="mb-3">
          <label className="form-label">Nombre:</label>
          <input 
            type="text" 
            className="form-control" 
            value={usuario.nombre} 
            readOnly 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido Paterno:</label>
          <input 
            type="text" 
            className="form-control" 
            value={usuario.paterno} 
            readOnly 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido Materno:</label>
          <input 
            type="text" 
            className="form-control" 
            value={usuario.materno} 
            readOnly 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input 
            type="email" 
            className="form-control" 
            value={usuario.email} 
            readOnly 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Especialidad:</label>
          <input 
            type="text" 
            className="form-control" 
            value={usuario.especialidad} 
            readOnly 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Nacimiento:</label>
          <input 
            type="date" 
            className="form-control" 
            value={usuario.fecNac} 
            readOnly 
          />
        </div>
      </div>
    </div>
  );
};

export default Configuraciones;