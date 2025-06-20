import React, { useEffect, useState } from "react";
import { Card } from 'primereact/card';
import 'primeflex/primeflex.css';

type ComponentType =
  | 'dashboard'
  | 'pacientes'
  | 'agenda'
  | 'evaluaciones'
  | 'diario'
  | 'recomendaciones'
  | 'configuracion';

interface DashboardCardData {
  title: string;
  value: number;
  color: string;
  icon: string;
  component?: ComponentType;
}

const Dashboard: React.FC<{ setActiveComponent: (c: ComponentType) => void }> = ({ setActiveComponent }) => {
  const [pacientesActivos, setPacientesActivos] = useState<number>(0);
  const [sesionesPendientes, setSesionesPendientes] = useState<number>(0);
  const [turnosHoy, setTurnosHoy] = useState<number>(0);

  useEffect(() => {
    const obtenerPacientesActivos = async () => {
  try {
    const token = localStorage.getItem('token'); // Asegúrate que guardas el token así
    const response = await fetch('http://localhost:4000/api/pacientes/activos/count', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // IMPORTANTE
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener pacientes activos');
    }

    const data = await response.json();
    console.log('Pacientes activos:', data.totalActivos);
    setPacientesActivos(data.totalActivos);
    // Puedes guardar el conteo en el estado si lo necesitas
  } catch (error) {
    console.error('Error:', error);
  }
};

    const obtenerSesionesPendientes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/sesiones-pendientes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setSesionesPendientes(data.total);
      } catch (error) {
        console.error("Error al obtener sesiones pendientes:", error);
      }
    };

    const obtenerTurnosHoy = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/turnos-hoy', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setTurnosHoy(data.total);
      } catch (error) {
        console.error("Error al obtener turnos de hoy:", error);
      }
    };

    obtenerPacientesActivos();
    obtenerSesionesPendientes();
    obtenerTurnosHoy();
  }, []);

  const cardData: DashboardCardData[] = [
    {
      title: "Pacientes Activos",
      value: pacientesActivos,
      color: "#3B82F6",
      icon: "pi pi-users",
      component: "pacientes"
    },
    {
      title: "Turnos de Hoy",
      value: turnosHoy,
      color: "#10B981",
      icon: "pi pi-calendar",
      component:"agenda"
    },
    {
      title: "Sesiones Pendientes",
      value: sesionesPendientes,
      color: "#F59E0B",
      icon: "pi pi-clock",
      component:"agenda"

    },
    {
      title: "Tareas por Revisar",
      value: 2,
      color: "#EF4444",
      icon: "pi pi-list",
      component:"evaluaciones"
    }
  ];

  const cardStyle = (color: string): React.CSSProperties => ({
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: `2px solid ${color}`,
    borderRadius: '12px',
    minHeight: '140px'
  });

  const handleCardClick = (card: DashboardCardData): void => {
    if (card.component) {
      setActiveComponent(card.component);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-900">Dashboard</h2>
      </div>
      
      <div className="grid">
        {cardData.map((card, index) => (
          <div key={index} className="col-12 md:col-6 lg:col-3">
            <Card
              className="cursor-pointer hover:shadow-4 transition-all transition-duration-300"
              style={cardStyle(card.color)}
              onClick={() => handleCardClick(card)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div className="flex flex-column align-items-center justify-content-center text-center h-full p-3">
                <div 
                  className="flex align-items-center justify-content-center mb-3"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: card.color,
                    borderRadius: '50%'
                  }}
                >
                  <i className={`${card.icon} text-white text-xl`} />
                </div>
                
                <h5 className="text-lg font-semibold text-900 mb-2 text-center">
                  {card.title}
                </h5>
                
                <p 
                  className="text-4xl font-bold m-0"
                  style={{ 
                    color: card.color,
                    fontSize: '2.5rem'
                  }}
                >
                  {card.value}
                </p>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Resumen semanal */}
      <div className="mt-6">
        <div className="grid">
          <div className="col-12">
            <Card className="p-4">
              <h3 className="text-xl font-semibold text-900 mb-3">
                Resumen Semanal
              </h3>
              <div className="grid">
                <div className="col-12 md:col-4">
                  <div className="text-center p-3">
                    <i className="pi pi-chart-line text-3xl text-blue-500 mb-2"></i>
                    <h4 className="text-lg font-medium text-900">Progreso</h4>
                    <p className="text-600">Seguimiento general</p>
                  </div>
                </div>
                <div className="col-12 md:col-4">
                  <div className="text-center p-3">
                    <i className="pi pi-heart text-3xl text-pink-500 mb-2"></i>
                    <h4 className="text-lg font-medium text-900">Bienestar</h4>
                    <p className="text-600">Estado emocional</p>
                  </div>
                </div>
                <div className="col-12 md:col-4">
                  <div className="text-center p-3">
                    <i className="pi pi-trophy text-3xl text-yellow-500 mb-2"></i>
                    <h4 className="text-lg font-medium text-900">Logros</h4>
                    <p className="text-600">Metas alcanzadas</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;