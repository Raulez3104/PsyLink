import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { Button } from 'primereact/button';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Calendar as PrimeCalendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import esLocale from '@fullcalendar/core/locales/es';
import type { EventApi } from '@fullcalendar/core';

interface EventData {
  id: string;
  title: string;
  start: string;
  end?: string;
  color?: string;
}

interface DropdownOption {
  label: string;
  value: string;
}

interface Paciente {
  id_paciente: number;
  nombres: string;
  apellidos: string;
}

interface CitaBackend {
  id_cita: number;
  id_paciente: number;
  paciente_nombre: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  repeticion: string;
  descripcion?: string;
  estado: string;
}

const Agenda: React.FC = () => {
  const [eventos, setEventos] = useState<EventData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [pacienteOptions, setPacienteOptions] = useState<DropdownOption[]>([]);
  const [nuevoPaciente, setNuevoPaciente] = useState<string>('');
  const [nuevaFecha, setNuevaFecha] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState<string>('');
  const [horaFin, setHoraFin] = useState<string>('');
  const [repeticion, setRepeticion] = useState<string>('semana');
  const [error, setError] = useState<string>('');
  const [selectedCita, setSelectedCita] = useState<CitaBackend | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/pacientes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data: Paciente[] = await res.json();
        setPacienteOptions(
          data.map((p) => ({
            label: `${p.nombres} ${p.apellidos}`,
            value: p.id_paciente.toString(),
          }))
        );
      } catch {
        setPacienteOptions([]);
      }
    };
    if (token) fetchPacientes();
  }, [token]);

  const fetchCitas = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/agenda', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: CitaBackend[] = await res.json();
      setEventos(
      data.map((cita) => ({
        id: cita.id_cita.toString(),
        title: cita.paciente_nombre,
        start: `${cita.fecha.slice(0, 10)}T${cita.hora_inicio}`,
        end: `${cita.fecha.slice(0, 10)}T${cita.hora_fin}`,
        color: cita.estado === 'cancelada' ? '#b0b0b0' : '#0d6efd', // gris si cancelada, azul si activa
      }))
    );
    } catch {
      setEventos([]);
    }
  };

  useEffect(() => {
    if (token) fetchCitas();
    // eslint-disable-next-line
  }, [token]);

  const repeticionOptions: DropdownOption[] = [
    { label: 'Una vez por semana', value: 'semana' },
    { label: 'Dos veces por semana', value: 'dos_veces' }
  ];

  const handleCrearCita = async () => {
    setError('');
    if (!nuevoPaciente || !nuevaFecha || !horaInicio || !horaFin) {
      setError('Completa todos los campos.');
      return;
    }

    try {
      const body = {
        id_paciente: parseInt(nuevoPaciente, 10),
        fecha: nuevaFecha.toISOString().split('T')[0],
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        repeticion,
      };
      const res = await fetch('http://localhost:4000/api/agenda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar cita');
      await fetchCitas();
      setModalVisible(false);
      resetModal();
    } catch {
      setError('No se pudo guardar la cita');
    }
  };

  // Usa any para máxima compatibilidad con FullCalendar
  const handleEventClick = async (clickInfo: { event: EventApi }) => {
    console.log('Evento clickeado:', clickInfo.event);
    const citaId = clickInfo.event.id;
    try {
      const res = await fetch(`http://localhost:4000/api/agenda/${citaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('No se pudo obtener la cita');
      const cita: CitaBackend = await res.json();
      setSelectedCita(cita);
      setEditModalVisible(true);
    } catch {
      setError('No se pudo cargar la cita');
    }
  };

  const handleEliminarCita = async () => {
    if (!selectedCita) return;
    try {
      const res = await fetch(`http://localhost:4000/api/agenda/${selectedCita.id_cita}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('No se pudo eliminar la cita');
      setEditModalVisible(false);
      setSelectedCita(null);
      await fetchCitas();
    } catch {
      setError('No se pudo eliminar la cita');
    }
  };

  const handleEditarCita = async () => {
    if (!selectedCita) return;
    try {
      const body = {
        fecha: selectedCita.fecha.slice(0, 10),
        hora_inicio: selectedCita.hora_inicio,
        hora_fin: selectedCita.hora_fin,
        descripcion: selectedCita.descripcion,
        estado: selectedCita.estado,
      };
      const res = await fetch(`http://localhost:4000/api/agenda/${selectedCita.id_cita}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('No se pudo editar la cita');
      setEditModalVisible(false);
      setSelectedCita(null);
      await fetchCitas();
    } catch {
      setError('No se pudo editar la cita');
    }
  };

  const resetModal = () => {
    setNuevoPaciente('');
    setNuevaFecha(null);
    setHoraInicio('');
    setHoraFin('');
    setRepeticion('semana');
    setError('');
  };

  return (
    <>
      <div className="flex flex-column p-3">
        <h2 className="mb-4">Agenda</h2>
        <div className="flex gap-2 align-items-center mb-3">
          <Button
            label="Agendar Cita"
            icon="pi pi-plus"
            onClick={() => setModalVisible(true)}
            className="p-button-rounded p-button-success"
          />
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={[esLocale]}
          locale="es"
          headerToolbar={{
            left: 'today prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          events={eventos}
          eventClick={handleEventClick}
          height="auto"
        />
        {/* Modal para crear cita */}
        <Dialog
          header="Agendar Cita"
          visible={modalVisible}
          style={{ width: '400px' }}
          onHide={() => { setModalVisible(false); resetModal(); }}
          footer={
            <div>
              <Button label="Cancelar" icon="pi pi-times" onClick={() => { setModalVisible(false); resetModal(); }} className="p-button-text" />
              <Button label="Crear" icon="pi pi-check" onClick={handleCrearCita} autoFocus />
            </div>
          }
        >
          <div className="p-fluid">
            <label className="block mb-2">Paciente</label>
            <Dropdown
              value={nuevoPaciente}
              options={pacienteOptions}
              onChange={e => setNuevoPaciente(e.value)}
              placeholder="Seleccionar Paciente"
              className="mb-3"
            />
            <label className="block mb-2">Fecha</label>
            <PrimeCalendar
              value={nuevaFecha}
              onChange={e => setNuevaFecha(e.value as Date)}
              dateFormat="yy-mm-dd"
              className="mb-3 w-full"
              showIcon
            />
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label className="block mb-2">Hora de inicio</label>
                <InputText
                  type="time"
                  value={horaInicio}
                  onChange={e => setHoraInicio(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2">Hora final</label>
                <InputText
                  type="time"
                  value={horaFin}
                  onChange={e => setHoraFin(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <label className="block mb-2">Repetición</label>
            <Dropdown
              value={repeticion}
              options={repeticionOptions}
              onChange={e => setRepeticion(e.value)}
              className="mb-3"
            />
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </Dialog>
        {/* Modal para editar/eliminar cita */}
        <Dialog
          header="Editar o Eliminar Cita"
          visible={editModalVisible}
          style={{ width: '400px' }}
          onHide={() => { setEditModalVisible(false); setSelectedCita(null); }}
          footer={
            <div>
              <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={handleEliminarCita} />
              <Button label="Guardar Cambios" icon="pi pi-check" onClick={handleEditarCita} autoFocus />
            </div>
          }
        >
          {selectedCita && (
            <div className="p-fluid">
              <label className="block mb-2">Paciente</label>
              <InputText value={selectedCita.paciente_nombre} disabled className="mb-3" />
              <label className="block mb-2">Fecha</label>
              <InputText
                type="date"
                value={selectedCita.fecha.slice(0, 10)}
                onChange={e => setSelectedCita({ ...selectedCita, fecha: e.target.value })}
                className="mb-3"
              />
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="block mb-2">Hora de inicio</label>
                  <InputText
                    type="time"
                    value={selectedCita.hora_inicio}
                    onChange={e => setSelectedCita({ ...selectedCita, hora_inicio: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2">Hora final</label>
                  <InputText
                    type="time"
                    value={selectedCita.hora_fin}
                    onChange={e => setSelectedCita({ ...selectedCita, hora_fin: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>
              <label className="block mb-2">Descripción</label>
              <InputText
                value={selectedCita.descripcion || ''}
                onChange={e => setSelectedCita({ ...selectedCita, descripcion: e.target.value })}
                className="mb-3"
              />
              <label className="block mb-2">Estado</label>
              <Dropdown
                value={selectedCita.estado}
                options={[
                  { label: 'Activa', value: 'activa' },
                  { label: 'Cancelada', value: 'cancelada' }
                ]}
                onChange={e => setSelectedCita({ ...selectedCita, estado: e.value })}
                className="mb-3"
              />
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>
          )}
        </Dialog>
      </div>
    </>
  );
};

export default Agenda;