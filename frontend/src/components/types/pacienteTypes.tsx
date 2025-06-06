// types/pacientesTypes.ts
export interface Paciente {
  id_paciente: number;
  nombres: string;
  apellidos: string;
  diagnostico: string;
  ingreso: Date | null;
  ci: number;
  email: string;
  telefono: string;
  fecnac: Date | null;
  direccion: string;
  estado_civil: string;
  educacion: string;
  profesion: string;
  estado: 'activo' | 'inactivo';
}

export interface PacienteForm {
  nombres: string;
  apellidos: string;
  diagnostico: string;
  ingreso: Date | null;
  ci: string;
  email: string;
  telefono: string;
  fecnac: Date | null;
  direccion: string;
  estado_civil: string;
  educacion: string;
  profesion: string;
  estado: 'activo' | 'inactivo';
}

export interface DropdownOption {
  label: string;
  value: string;
}

export interface PacienteApiData {
  id_paciente: number;
  nombres: string;
  apellidos: string;
  diagnostico: string;
  ingreso: string | null;
  ci: number;
  email: string;
  telefono: string;
  fecnac: string | null;
  direccion: string;
  estado_civil: string;
  educacion: string;
  profesion: string;
  estado: 'activo' | 'inactivo';
}