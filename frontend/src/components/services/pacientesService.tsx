import { API_BASE_URL } from '../constants/pacientesConstants';
import type { Paciente, PacienteApiData } from '../types/pacienteTypes';

class PacientesService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
      throw new Error(errorData.error || `Error HTTP: ${response.status}`);
    }
    return response.json();
  }

  private transformFromApi(data: PacienteApiData): Paciente {
    return {
      ...data,
      ingreso: data.ingreso ? new Date(data.ingreso) : null,
      fecnac: data.fecnac ? new Date(data.fecnac) : null,
    };
  }

  private transformToApi(paciente: Partial<Paciente>): Record<string, unknown> {
    return {
      ...paciente,
      ingreso: paciente.ingreso?.toISOString(),
      fecnac: paciente.fecnac?.toISOString(),
    };
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAll(): Promise<Paciente[]> {
    const response = await fetch(`${API_BASE_URL}/pacientes`, {
      headers: this.getAuthHeaders(),
    });
    const data = await this.handleResponse<PacienteApiData[]>(response);
    return data.map(p => this.transformFromApi(p));
  }

  async getById(id: number): Promise<Paciente> {
    const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
      headers: this.getAuthHeaders(),
    });
    const data = await this.handleResponse<PacienteApiData>(response);
    return this.transformFromApi(data);
  }

  async create(paciente: Omit<Paciente, 'id_paciente'>): Promise<Paciente> {
    const response = await fetch(`${API_BASE_URL}/pacientes`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(this.transformToApi(paciente)),
    });
    const data = await this.handleResponse<PacienteApiData>(response);
    return this.transformFromApi(data);
  }

  async update(id: number, paciente: Partial<Paciente>): Promise<Paciente> {
    const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(this.transformToApi(paciente)),
    });
    const data = await this.handleResponse<PacienteApiData>(response);
    return this.transformFromApi(data);
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    await this.handleResponse<{ message: string }>(response);
  }
}

export const pacientesService = new PacientesService();