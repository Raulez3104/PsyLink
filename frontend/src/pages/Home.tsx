import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Dashboard from '../components/Dashboard';
import Pacientes from '../components/Pacientes';
import Agenda from '../components/Agenda';
import 'primeflex/primeflex.css';

type ComponentType =
  | 'dashboard'
  | 'pacientes'
  | 'agenda'
  | 'evaluaciones'
  | 'diario'
  | 'recomendaciones'
  | 'configuracion';

const Home: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<ComponentType>('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('auth') !== 'true') {
      navigate('/');
    }
  }, [navigate]);

  const renderComponent = (): React.ReactNode => {
    switch (activeComponent) {
      case 'dashboard':
        return <Dashboard />;
      case 'pacientes':
        return <Pacientes />;
      case 'agenda':
        return <Agenda />;
      case 'evaluaciones':
        return <div>Evaluaciones (en desarrollo)</div>;
      case 'diario':
        return <div>Diario Emocional (en desarrollo)</div>;
      case 'recomendaciones':
        return <div>Recomendaciones (en desarrollo)</div>;
      case 'configuracion':
        return <div>Configuración (en desarrollo)</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex">
      <div
        className="fixed"
        style={{
          width: sidebarVisible ? '200px' : '0',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 1000,
          overflow: 'hidden',
          transition: 'width 0.3s ease',
        }}
      >
        <Sidebar setActiveComponent={setActiveComponent} visible={sidebarVisible} />
      </div>

      <div
        className="w-full"
        style={{
          marginLeft: sidebarVisible ? '200px' : '0px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Topbar toggleSidebar={() => setSidebarVisible(!sidebarVisible)} />
        <main className="p-4">{renderComponent()}</main>
      </div>
    </div>
  );
};

export default Home;
