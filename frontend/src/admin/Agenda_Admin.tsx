import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { Button } from 'primereact/button';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Dropdown } from 'primereact/dropdown';
import 'primeflex/primeflex.css';

interface EventData {
  title: string;
  startTime: string;
  daysOfWeek: number[];
  startRecur: string;
  endRecur: string;
  display: string;
  color: string;
}

interface DropdownOption {
  label: string;
  value: string;
}

const Agenda_Admin: React.FC = () => {
  const [selectedPaciente, setSelectedPaciente] = useState<string>('');
  const [selectedConsultorio, setSelectedConsultorio] = useState<string>('');

  const eventos: EventData[] = [
    {
      title: '8 Turno recurrente',
      startTime: '08:00:00',
      daysOfWeek: [6], // Sábado
      startRecur: '2025-05-01',
      endRecur: '2025-05-24',
      display: 'block',
      color: '#20c997'
    }
  ];

  const pacienteOptions: DropdownOption[] = [
    { label: 'Paciente', value: '' },
    { label: 'Juan Pérez', value: 'juan' },
    { label: 'María García', value: 'maria' }
  ];

  const consultorioOptions: DropdownOption[] = [
    { label: 'Consultorio', value: '' },
    { label: 'Consultorio 1', value: 'consultorio1' },
    { label: 'Consultorio 2', value: 'consultorio2' }
  ];

  

  const calendarStyles = `
    .fc .fc-button {
      background-color: #212529 !important;
      border: none !important;
    }
    .fc .fc-button-primary:not(:disabled):active,
    .fc .fc-button-primary:not(:disabled).fc-button-active {
      background-color: #0d6efd !important;
    }
    .fc-event {
      font-size: 0.85rem !important;
      padding: 2px 4px !important;
      border-radius: 4px !important;
    }
    .fc-toolbar-title {
      text-decoration: none !important;
    }
    .fc-daygrid-day-number {
      text-decoration: none !important;
      color: #212529 !important;
    }
    .fc a {
      text-decoration: none !important;
      color: #212529 !important;
    }
  `;

  return (
    <>
      <style>{calendarStyles}</style>
      <div className="flex">
        <div className="flex-grow-1 p-3">
          <h2 className="mb-4">Agenda</h2>

          <div className="flex gap-2 align-items-center mb-3">
            <span className="mr-2">🔍</span>
            <Dropdown
              value={selectedPaciente}
              options={pacienteOptions}
              onChange={(e) => setSelectedPaciente(e.value)}
              placeholder="Seleccionar Paciente"
              className="w-auto"
              style={{ minWidth: '150px' }}
            />
            <Dropdown
              value={selectedConsultorio}
              options={consultorioOptions}
              onChange={(e) => setSelectedConsultorio(e.value)}
              placeholder="Seleccionar Consultorio"
              className="w-auto"
              style={{ minWidth: '150px' }}
            />
            <div className="flex items-end">
                        <Button
                          label="Agendar Cita"
                          icon="pi pi-plus"
                          onClick={() => console.log('Nuevo Paciente')}
                          className="p-button-rounded p-button-success"
                        />
                      </div>
          </div>

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="es"
            headerToolbar={{
              left: 'today prev,next',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}    
            events={eventos}
            height="auto"
            />
        </div>
      </div>
    </>
  );
};

export default Agenda_Admin;