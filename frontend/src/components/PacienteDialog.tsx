// components/PacienteDialog.tsx
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { DROPDOWN_OPTIONS, FORM_INITIAL_STATE } from './constants/pacientesConstants';
import type { Paciente, PacienteForm } from './types/pacienteTypes';

interface PacienteDialogProps {
  visible: boolean;
  paciente: Paciente | null;
  onHide: () => void;
  onSave: (pacienteData: Omit<Paciente, 'id_paciente'>) => Promise<void>;
}

export const PacienteDialog: React.FC<PacienteDialogProps> = ({
  visible,
  paciente,
  onHide,
  onSave
}) => {
  const [formData, setFormData] = useState<PacienteForm>(FORM_INITIAL_STATE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paciente) {
      setFormData({
        nombres: paciente.nombres,
        apellidos: paciente.apellidos,
        diagnostico: paciente.diagnostico,
        ingreso: paciente.ingreso,
        ci: paciente.ci.toString(),
        email: paciente.email,
        telefono: paciente.telefono,
        fecnac: paciente.fecnac,
        direccion: paciente.direccion,
        estado_civil: paciente.estado_civil,
        educacion: paciente.educacion,
        profesion: paciente.profesion,
        estado: paciente.estado
      });
    } else {
      setFormData(FORM_INITIAL_STATE);
    }
  }, [paciente, visible]);

  const handleInputChange = (field: keyof PacienteForm, value: string | Date | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.nombres.trim() || !formData.apellidos.trim() || 
        !formData.ci.trim() || !formData.email.trim()) {
      alert('Complete los campos obligatorios');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Email inválido');
      return false;
    }
    
    if (isNaN(Number(formData.ci))) {
      alert('CI debe ser numérico');
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const pacienteData = {
        ...formData,
        ci: Number(formData.ci)
      };
      await onSave(pacienteData);
    } finally {
      setLoading(false);
    }
  };

  const dialogHeader = paciente ? 'Editar Paciente' : 'Nuevo Paciente';

  return (
    <Dialog
      header={dialogHeader}
      visible={visible}
      onHide={onHide}
      style={{ width: '600px' }}
      modal
      className="p-fluid"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nombres *</label>
          <InputText
            value={formData.nombres}
            onChange={(e) => handleInputChange('nombres', e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Apellidos *</label>
          <InputText
            value={formData.apellidos}
            onChange={(e) => handleInputChange('apellidos', e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">CI *</label>
          <InputText
            value={formData.ci}
            onChange={(e) => handleInputChange('ci', e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <InputText
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            type="email"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Teléfono</label>
          <InputText
            value={formData.telefono}
            onChange={(e) => handleInputChange('telefono', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Diagnóstico</label>
          <InputText
            value={formData.diagnostico}
            onChange={(e) => handleInputChange('diagnostico', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Fecha de Nacimiento</label>
          <Calendar
            value={formData.fecnac}
            onChange={(e) => handleInputChange('fecnac', e.value || null)}
            dateFormat="dd/mm/yy"
            showIcon
            readOnlyInput
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Estado Civil</label>
          <Dropdown
            value={formData.estado_civil}
            options={DROPDOWN_OPTIONS.estadoCivil}
            onChange={(e) => handleInputChange('estado_civil', e.value || null)}
            placeholder="Seleccionar"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Educación</label>
          <Dropdown
            value={formData.educacion}
            options={DROPDOWN_OPTIONS.educacion}
            onChange={(e) => handleInputChange('educacion', e.value || null)}
            placeholder="Seleccionar"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Estado</label>
          <Dropdown
            value={formData.estado}
            options={DROPDOWN_OPTIONS.estadoPaciente}
            onChange={(e) => handleInputChange('estado', e.value || null)}
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Dirección</label>
          <InputText
            value={formData.direccion}
            onChange={(e) => handleInputChange('direccion', e.target.value)}
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Profesión</label>
          <InputText
            value={formData.profesion}
            onChange={(e) => handleInputChange('profesion', e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          onClick={onHide}
          className="p-button-text"
          disabled={loading}
        />
        <Button
          label="Guardar"
          icon="pi pi-check"
          onClick={handleSave}
          disabled={loading}
          loading={loading}
        />
      </div>
    </Dialog>
  );
};