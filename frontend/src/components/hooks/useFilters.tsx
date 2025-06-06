// hooks/useFilters.ts
import { useState, useMemo } from 'react';
import type { Paciente } from '../types/pacienteTypes';

export const useFilters = (pacientes: Paciente[]) => {
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroDni, setFiltroDni] = useState('');
  const [estadoSelected, setEstadoSelected] = useState('todos');

  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter(paciente => {
      const nombreCompleto = `${paciente.nombres} ${paciente.apellidos}`.toLowerCase();
      const filtroNombreMatch = nombreCompleto.includes(filtroNombre.toLowerCase());
      const filtroDniMatch = paciente.ci.toString().includes(filtroDni);
      const estadoMatch = estadoSelected === 'todos' || paciente.estado === estadoSelected;
      
      return filtroNombreMatch && filtroDniMatch && estadoMatch;
    });
  }, [pacientes, filtroNombre, filtroDni, estadoSelected]);

  return {
    filtroNombre,
    filtroDni,
    estadoSelected,
    pacientesFiltrados,
    setFiltroNombre,
    setFiltroDni,
    setEstadoSelected
  };
};