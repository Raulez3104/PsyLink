// hooks/usePacientes.ts
import { useState, useCallback } from 'react';
import { pacientesService } from '../services/pacientesService';
import type { Paciente } from '../types/pacienteTypes';

export const usePacientes = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshPacientes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await pacientesService.getAll();
      setPacientes(data);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPaciente = useCallback(async (pacienteData: Omit<Paciente, 'id_paciente'>) => {
    setLoading(true);
    try {
      const newPaciente = await pacientesService.create(pacienteData);
      setPacientes(prev => [...prev, newPaciente]);
      await refreshPacientes(); // <-- refresca la lista después de actualizar
      return newPaciente;
    } finally {
      setLoading(false);
    }
  }, [refreshPacientes]);

const updatePaciente = useCallback(async (id: number, pacienteData: Partial<Paciente>) => {
  setLoading(true);
  try {
    await pacientesService.update(id, pacienteData);
    await refreshPacientes(); // <-- refresca la lista después de actualizar
  } finally {
    setLoading(false);
  }
}, [refreshPacientes]);

  const deletePaciente = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await pacientesService.delete(id);
      setPacientes(prev => prev.filter(p => p.id_paciente !== id));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    pacientes,
    loading,
    refreshPacientes,
    createPaciente,
    updatePaciente,
    deletePaciente
  };
};