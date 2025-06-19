import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { PacienteDialog } from './PacienteDialog';
import { usePacientes } from './hooks/usePacientes';
import { useFilters } from './hooks/useFilters';
import { DROPDOWN_OPTIONS } from './constants/pacientesConstants';
import type { Paciente } from './types/pacienteTypes';
import styles from '../css/Pacientes.module.scss'
const Pacientes: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  
  const {
    pacientes,
    loading,
    createPaciente,
    updatePaciente,
    refreshPacientes
  } = usePacientes();

  const {
    filtroNombre,
    filtroDni,
    estadoSelected,
    pacientesFiltrados,
    setFiltroNombre,
    setFiltroDni,
    setEstadoSelected
  } = useFilters(pacientes);

  useEffect(() => {
    refreshPacientes();
  }, []);

  const showToast = (severity: 'success' | 'error', summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const handleSave = async (pacienteData: Omit<Paciente, 'id_paciente'>) => {
    try {
      if (selectedPaciente) {
        await updatePaciente(selectedPaciente.id_paciente, pacienteData);
        showToast('success', 'Éxito', 'Paciente actualizado correctamente');
      } else {
        await createPaciente(pacienteData);
        showToast('success', 'Éxito', 'Paciente creado correctamente');
      }
      setShowDialog(false);
      setSelectedPaciente(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al guardar';
      showToast('error', 'Error', message);
    }
  };

  const handleEdit = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    setShowDialog(true);
  };

  

  const actionBodyTemplate = (rowData: Paciente) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success p-button-sm"
        onClick={() => handleEdit(rowData)}
      />
     
    </div>
  );

  const estadoBodyTemplate = (rowData: Paciente) => (
    <span className={`badge ${rowData.estado === 'activo' ? 'badge-success' : 'badge-danger'}`}>
      {rowData.estado}
    </span>
  );

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <Card title="Gestión de Pacientes" className="mb-4">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Buscar por nombre</label>
            <InputText
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              placeholder="Nombre del paciente"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Buscar por CI</label>
            <InputText
              value={filtroDni}
              onChange={(e) => setFiltroDni(e.target.value)}
              placeholder="CI del paciente"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Estado</label>
            <Dropdown
              value={estadoSelected}
              options={DROPDOWN_OPTIONS.estado}
              onChange={(e) => setEstadoSelected(e.value)}
              placeholder="Seleccionar estado"
              className="w-full"
            />
          </div>
          <div className="flex items-end">
            <Button
              label="Nuevo Paciente"
              icon="pi pi-plus"
              onClick={() => setShowDialog(true)}
              className={`p-button-success ${styles.botonVerde}`}
            />
          </div>
        </div>

        {/* Tabla */}
        <DataTable
          value={pacientesFiltrados}
          loading={loading}
          paginator
          rows={10}
          dataKey="id_paciente"
          emptyMessage="No se encontraron pacientes"
          className="p-datatable-sm"
        >
          <Column field="nombres" header="Nombres" sortable />
          <Column field="apellidos" header="Apellidos" sortable />
          <Column field="ci" header="CI" sortable />
          <Column field="email" header="Email" />
          <Column field="telefono" header="Teléfono" />
          <Column field="diagnostico" header="Diagnóstico" />
          <Column field="estado" header="Estado" body={estadoBodyTemplate} />
          <Column header="Acciones" body={actionBodyTemplate} style={{ width: '8rem' }} />
        </DataTable>
      </Card>

      {/* Dialog */}
      <PacienteDialog
        visible={showDialog}
        paciente={selectedPaciente}
        onHide={() => {
          setShowDialog(false);
          setSelectedPaciente(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

export default Pacientes;