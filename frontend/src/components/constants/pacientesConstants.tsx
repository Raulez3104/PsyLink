// constants/pacientesConstants.ts
import type { DropdownOption } from '../types/pacienteTypes';

export const DROPDOWN_OPTIONS = {
  estado: [
    { label: 'Todos', value: 'todos' },
    { label: 'Activos', value: 'activo' },
    { label: 'Inactivos', value: 'inactivo' }
  ] as DropdownOption[],

  estadoCivil: [
    { label: 'Soltero/a', value: 'Soltero' },
    { label: 'Casado/a', value: 'Casado' },
    { label: 'Divorciado/a', value: 'Divorciado' },
    { label: 'Viudo/a', value: 'Viudo' }
  ] as DropdownOption[],

  educacion: [
    { label: 'Primaria', value: 'Primaria' },
    { label: 'Secundaria', value: 'Secundaria' },
    { label: 'Técnico', value: 'Técnico' },
    { label: 'Universitario', value: 'Universitario' },
    { label: 'Postgrado', value: 'Postgrado' }
  ] as DropdownOption[],

  estadoPaciente: [
    { label: 'Activo', value: 'activo' },
    { label: 'Inactivo', value: 'inactivo' }
  ] as DropdownOption[]
};

export const API_BASE_URL = 'http://localhost:4000/api';

export const FORM_INITIAL_STATE = {
  nombres: '',
  apellidos: '',
  diagnostico: '',
  ingreso: new Date(),
  ci: '',
  email: '',
  telefono: '',
  fecnac: null,
  direccion: '',
  estado_civil: '',
  educacion: '',
  profesion: '',
  estado: 'activo' as const
};