import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import type { DropdownChangeEvent } from "primereact/dropdown";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";

interface Paciente {
  id_paciente: number;
  nombres: string;
  apellidos: string;
}

interface Evaluacion {
  id_tarea?: number;
  id_paciente: number;
  id_psico: number;
  titulo: string;
  descripcion?: string;
  tipo: "tarea" | "evaluacion";
  fecha_asignacion: string;
  fecha_entrega?: string;
  estado?: "pendiente" | "hecha";
  paciente_nombre?: string;
}

const Evaluaciones: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [evaluacion, setEvaluacion] = useState<Evaluacion>({
    id_paciente: 0,
    id_psico: 1,
    titulo: "",
    descripcion: "",
    tipo: "tarea",
    fecha_asignacion: new Date().toISOString().slice(0, 10),
    fecha_entrega: "",
    estado: "pendiente",
  });
  const [tareas, setTareas] = useState<Evaluacion[]>([]);
  const toast = useRef<Toast>(null);

  // Cargar pacientes
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/api/pacientes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setPacientes(data);
      })
      .catch(() => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al cargar pacientes",
        });
      });
  }, []);

  // Cargar tareas asignadas
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/api/tareas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setTareas(data);
      })
      .catch(() => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al cargar tareas",
        });
      });
  }, []);

  const handleChange = (
    e:
      | DropdownChangeEvent
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEvaluacion((prev) => ({
      ...prev,
      [name]: name === "id_paciente" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:4000/api/tareas", evaluacion, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Asignación creada correctamente",
      });
      setEvaluacion({
        id_paciente: 0,
        id_psico: 1,
        titulo: "",
        descripcion: "",
        tipo: "tarea",
        fecha_asignacion: new Date().toISOString().slice(0, 10),
        fecha_entrega: "",
        estado: "pendiente",
      });
      // Recargar tareas usando el puerto correcto
      const res = await axios.get("http://localhost:4000/api/tareas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setTareas(data);
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al asignar la tarea o test",
      });
    }
  };

  return (
    <div className="mb-2 p-4">
      <Toast ref={toast} />
      <div className="grid">
        <div className="col-12 md:col-5">
          <Card title="Asignar Tarea o Test Psicológico">
            <form onSubmit={handleSubmit} className="flex flex-column gap-3">
              <span className="mb-2 p-float-label">
                <Dropdown
                  id="paciente"
                  name="id_paciente"
                  value={evaluacion.id_paciente}
                  options={pacientes.map((p) => ({
                    label: `${p.nombres} ${p.apellidos}`,
                    value: p.id_paciente,
                  }))}
                  onChange={handleChange}
                  placeholder="Seleccione un paciente"
                  className="w-full"
                  required
                />
                <label htmlFor="paciente">Paciente</label>
              </span>

              <span className="mb-2 p-float-label">
                <InputText
                  id="titulo"
                  name="titulo"
                  value={evaluacion.titulo}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
                <label htmlFor="titulo">Título</label>
              </span>

              <span className="mb-2 p-float-label">
                <InputTextarea
                  id="descripcion"
                  name="descripcion"
                  value={evaluacion.descripcion}
                  onChange={handleChange}
                  className="w-full"
                  rows={3}
                  autoResize
                />
                <label htmlFor="descripcion">Descripción</label>
              </span>

              <span className="mb-3 p-float-label">
                <Dropdown
                  id="tipo"
                  name="tipo"
                  value={evaluacion.tipo}
                  options={[
                    { label: "Tarea", value: "tarea" },
                    { label: "Test Psicológico", value: "evaluacion" },
                  ]}
                  onChange={handleChange}
                  className="w-full"
                />
                <label htmlFor="tipo">Tipo</label>
              </span>

              <span className="p-float-label">
                <Calendar
                  id="fecha_entrega"
                  name="fecha_entrega"
                  value={
                    evaluacion.fecha_entrega
                      ? new Date(evaluacion.fecha_entrega)
                      : null
                  }
                  onChange={(e) => {
                    // PrimeReact Calendar no exporta un tipo adecuado, así que usamos 'any' solo aquí
                    const value = (e as { value: Date | Date[] | null }).value;
                    setEvaluacion((prev) => ({
                      ...prev,
                      fecha_entrega: value
                        ? (value instanceof Date
                            ? value
                            : (Array.isArray(value) && value.length > 0 ? value[0] : new Date())
                          ).toISOString().slice(0, 10)
                        : "",
                    }));
                  }}
                  dateFormat="yy-mm-dd"
                  className="w-full"
                  showIcon
                />
                <label htmlFor=" mb-2 fecha_entrega">Fecha de entrega</label>
              </span>

              <Button type="submit" label="Asignar" className="p-button-success" />
            </form>
          </Card>
        </div>
        <div className="col-12 md:col-7">
          <Card title="Tareas y Tests Asignados">
            <DataTable value={tareas} paginator rows={5} className="p-datatable-sm">
              <Column
                field="paciente_nombre"
                header="Paciente"
                body={(row: Evaluacion) =>
                  row.paciente_nombre ||
                  (pacientes.find((p) => p.id_paciente === row.id_paciente)
                    ? `${pacientes.find((p) => p.id_paciente === row.id_paciente)?.nombres} ${pacientes.find((p) => p.id_paciente === row.id_paciente)?.apellidos}`
                    : "")
                }
              />
              <Column field="titulo" header="Título" />
              <Column field="tipo" header="Tipo" body={(row: Evaluacion) => row.tipo === "tarea" ? "Tarea" : "Test Psicológico"} />
              <Column
                field="fecha_entrega"
                header="Fecha de Entrega"
                body={(row: Evaluacion) =>
                  row.fecha_entrega
                    ? row.fecha_entrega.slice(0, 10)
                    : ""
                }
              />
              <Column field="estado" header="Estado" />
            </DataTable>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Evaluaciones;