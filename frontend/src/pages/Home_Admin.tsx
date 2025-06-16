import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar_Admin from '../admin/SideBar_Admin';
import TopBar_Admin from '../admin/TopBar_Admin';
import Dashboard_Admin from '../admin/Dashboard_Admin';
import Pacientes_Admin from '../admin/Pacientes_Admin';
import Agenda_Admin from '../admin/Agenda_Admin';
import Configuraciones_Admin from '../admin/Configuraciones_Admin';
import 'primeflex/primeflex.css';

type ComponentType =
  | 'dashboard_admin'
  | 'pacientes_admin'
  | 'configuracion_admin'
  | 'agenda_admin';

const Home: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<ComponentType>('dashboard_admin');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('auth') !== 'true') {
      navigate('/');
    }
  }, [navigate]);

  const renderComponent = (): React.ReactNode => {
    switch (activeComponent) {
      case 'dashboard_admin':
        return <Dashboard_Admin />;
      case 'pacientes_admin':
        return <Pacientes_Admin />;
      case 'agenda_admin':
        return <Agenda_Admin />;
      case 'configuracion_admin':
        return <Configuraciones_Admin   />;
      default:
        return <Dashboard_Admin />;
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
        <Sidebar_Admin setActiveComponent={setActiveComponent} visible={sidebarVisible} />
      </div>

      <div
        className="w-full"
        style={{
          marginLeft: sidebarVisible ? '200px' : '0px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <TopBar_Admin toggleSidebar={() => setSidebarVisible(!sidebarVisible)} />
        <main className="p-4">{renderComponent()}</main>
      </div>
    </div>
  );
};

export default Home;
