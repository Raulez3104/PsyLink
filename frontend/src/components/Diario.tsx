import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { getDiariosPorPaciente, getPacientes } from './services/diarioService';
import type { DiarioEntry, Paciente } from './services/diarioService';

const Diario: React.FC = () => {
  // Los pacientes tendrán un campo extra para mostrar nombre completo
  const [pacientes, setPacientes] = useState<(Paciente & { nombreCompleto: string })[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [diarios, setDiarios] = useState<DiarioEntry[]>([]);

  useEffect(() => {
    getPacientes()  
      .then((data) => {
        const conNombreCompleto = data.map((p) => ({
          ...p,
          nombreCompleto: `${p.nombres} ${p.apellidos}`,
        }));
        setPacientes(conNombreCompleto);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (pacienteSeleccionado) {
      getDiariosPorPaciente(pacienteSeleccionado.id_paciente)
        .then(setDiarios)
        .catch(console.error);
    } else {
      setDiarios([]);
    }
  }, [pacienteSeleccionado]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">📓 IDiary de pacientes</h2>

      <div className="flex flex-column md:flex-row gap-3 mb-4 align-items-end">
        <div className="flex-1">
          <label htmlFor="paciente" className="block mb-2">
            Selecciona un paciente
          </label>
          <Dropdown
            id="paciente"
            value={pacienteSeleccionado}
            onChange={(e) => setPacienteSeleccionado(e.value)}
            options={pacientes}
            optionLabel="nombreCompleto"
            placeholder="Elige un paciente"
            className="w-full"
          />
        </div>
      </div>

      {pacienteSeleccionado && diarios.length > 0 ? (
        <ScrollPanel style={{ height: '500px' }}>
          <div className="flex flex-column gap-4">
            {diarios.map((entry) => (
              <Card key={entry.id_diario} className="shadow-2 border-1 surface-border">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-color-secondary">
                    {new Date(entry.fecha).toLocaleString()}
                  </span>
                  <Tag
                    severity={
                      entry.intensidad >= 7
                        ? 'danger'
                        : entry.intensidad >= 4
                        ? 'warning'
                        : 'success'
                    }
                    value={`${entry.emocion_principal} (${entry.intensidad}/10)`}
                  />
                </div>
                <Divider className="my-2" />
                <p className="text-base whitespace-pre-wrap">{entry.contenido}</p>
              </Card>
            ))}
          </div>
        </ScrollPanel>
      ) : pacienteSeleccionado ? (
        <p className="mt-4 text-color-secondary">
          Este paciente aún no ha escrito en su IDiary.
        </p>
      ) : (
        <p className="mt-4 text-color-secondary">Selecciona un paciente para ver su IDiary</p>
      )}
    </div>
  );
};

export default Diario;
