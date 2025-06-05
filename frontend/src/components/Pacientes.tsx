import React from 'react';
import styles from '../css/Pacientes.module.scss';

// Interfaz para los datos de un paciente
interface Paciente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

const Pacientes: React.FC = () => {
  // Ejemplo de datos tipados (puedes reemplazar con tu lógica de estado)
  const pacientes: Paciente[] = [
    {
      id: 1,
      nombre: "Juan Ramirez",
      email: "juanchorami@gmail.com",
      telefono: "6884795"
    }
  ];

  // Handlers tipados para eventos
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // Lógica para filtrar por nombre
    console.log(event.target.value);
  };

  const handleDniChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // Lógica para filtrar por DNI
    console.log(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    // Lógica para cambiar filtro de estado
    console.log(event.target.value);
  };

  const handleObraSocialChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    // Lógica para cambiar filtro de obra social
    console.log(event.target.value);
  };

  const handleImport = (): void => {
    // Lógica para importar
    console.log('Importar');
  };

  const handleExport = (): void => {
    // Lógica para exportar
    console.log('Exportar');
  };

  const handleNewPatient = (): void => {
    // Lógica para crear nuevo paciente
    console.log('Nuevo paciente');
  };

  return (
    <div className={`container ${styles.container}`}>
      <h2 className="mb-3">Pacientes</h2>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <a 
            className={`nav-link active ${styles.navLinkActive}`} 
            href="#"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
          >
            Pacientes
          </a>
        </li>
        <li className="nav-item">
          <a 
            className="nav-link" 
            href="#"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
          >
            Notificaciones por WhatsApp
          </a>
        </li>
        <li className="nav-item">
          <a 
            className="nav-link" 
            href="#"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
          >
            Contactos asociados al paciente
          </a>
        </li>
      </ul>

      <div className={`card p-4 ${styles.card}`}>
        <div className="d-flex flex-wrap gap-2 mb-3">
          <input 
            type="text" 
            className={`form-control ${styles.inputControl}`} 
            placeholder="Filtrar por nombre"
            onChange={handleFilterChange}
          />
          <input 
            type="text" 
            className={`form-control ${styles.inputControl}`} 
            placeholder="DNI"
            onChange={handleDniChange}
          />
          <select 
            className={`form-select ${styles.inputControl}`}
            onChange={handleStatusChange}
          >
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
          <select 
            className={`form-select ${styles.inputControl}`}
            onChange={handleObraSocialChange}
          >
            <option value="">Obra Social</option>
          </select>
          <button 
            className="btn btn-dark"
            onClick={handleImport}
            type="button"
          >
            Importar
          </button>
          <button 
            className="btn btn-dark"
            onClick={handleExport}
            type="button"
          >
            Exportar
          </button>
          <button 
            className="btn btn-success"
            onClick={handleNewPatient}
            type="button"
          >
            + Nuevo paciente
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className={styles.tableHead}>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente: Paciente) => (
                <tr key={paciente.id}>
                  <td>{paciente.nombre}</td>
                  <td>{paciente.email}</td>
                  <td>{paciente.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <span className={styles.pacientesLabel}>
          Pacientes: {pacientes.length}
        </span>
      </div>

      <div className={styles.hint}>
        ← Selecciona un elemento
      </div>
    </div>
  );
};

export default Pacientes;