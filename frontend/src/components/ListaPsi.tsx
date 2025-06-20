import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';

type Psicologo = {
  id_psico: number;
  nombre: string;
  paterno: string | null;
  materno: string | null;
  email: string;
  especialidad: string | null;
  fecNac: string | null;
};

const ListaPsi = () => {
  const [psicologos, setPsicologos] = useState<Psicologo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerPsicologos = async () => {
      setCargando(true);
      setError('');
      try {
        const token = localStorage.getItem('token'); // o donde tengas guardado el token
        const response = await axios.get('http://localhost:4000/api/psicologos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPsicologos(response.data);
      } catch (err) {
        console.error(err);
        setError('Error al obtener los psicólogos');
      } finally {
        setCargando(false);
      }
    };

    obtenerPsicologos();
  }, []);

  const nombreCompletoTemplate = (psico: Psicologo) =>
    `${psico.nombre} ${psico.paterno || ''} ${psico.materno || ''}`;

  const fechaNacimientoTemplate = (psico: Psicologo) =>
    psico.fecNac ? new Date(psico.fecNac).toLocaleDateString() : 'N/D';

  return (
    <div className="p-d-flex p-jc-center p-mt-5">
        {cargando ? (
          <div className="p-d-flex p-jc-center p-my-5">
            <ProgressSpinner />
          </div>
        ) : error ? (
          <Message severity="error" text={error} />
        ) : (
          <DataTable
            value={psicologos}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            emptyMessage="No hay psicólogos para mostrar"
            responsiveLayout="scroll"
            className="p-datatable-sm"
          >
            <Column
              field="nombre"
              header="Nombre completo"
              body={nombreCompletoTemplate}
              sortable
              style={{ minWidth: '250px' }}
            />
            <Column field="email" header="Email" sortable style={{ minWidth: '200px' }} />
            <Column
              field="especialidad"
              header="Especialidad"
              body={(psico) => psico.especialidad || 'N/D'}
              sortable
              style={{ minWidth: '150px' }}
            />
            <Column
              field="fecNac"
              header="Fecha de nacimiento"
              body={fechaNacimientoTemplate}
              sortable
              style={{ minWidth: '150px' }}
            />
          </DataTable>
        )}
    </div>
  );
};

export default ListaPsi;
