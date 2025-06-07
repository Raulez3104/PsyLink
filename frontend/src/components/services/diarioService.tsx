import axios from 'axios';

export interface DiarioEntry {
  id_diario: number;
  fecha: string;
  emocion_principal: string;
  intensidad: number;
  contenido: string;
}

export interface Paciente {
  id_paciente: number;
  nombres: string;
  apellidos: string;
}

const API_URL = 'http://localhost:4000/api';

export const getPacientes = async (): Promise<Paciente[]> => {
  const res = await axios.get(`${API_URL}/pacientes`);
  return res.data;
};

export const getDiariosPorPaciente = async (id_paciente: number): Promise<DiarioEntry[]> => {
  const res = await axios.get(`${API_URL}/diarios/${id_paciente}`);
  return res.data;
};
