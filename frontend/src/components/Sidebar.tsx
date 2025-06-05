import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import type { MenuItem } from 'primereact/menuitem';
import { Divider } from 'primereact/divider';
import 'primeflex/primeflex.css';

type ComponentType = 'dashboard' | 'pacientes' | 'agenda' | 'evaluaciones' | 'diario' | 'recomendaciones' | 'configuracion';

interface SidebarProps {
  setActiveComponent: (component: ComponentType) => void;
}

interface MenuItemData {
  name: string;
  key: ComponentType;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveComponent }) => {
  const menuRef = useRef<Menu>(null);

 const handleLogout = (): void => {
  localStorage.removeItem('auth');
  // Forzar actualización del estado del auth en App recargando la página
  window.location.href = '/';
};

  const menuItems: MenuItemData[] = [
    { name: 'Agenda', key: 'agenda' },
    { name: 'Pacientes', key: 'pacientes' },
    { name: 'Evaluaciones', key: 'evaluaciones' },
    { name: 'Diario Emocional', key: 'diario' },
    { name: 'Recomendaciones', key: 'recomendaciones' },
    { name: 'Configuración', key: 'configuracion' },
  ];

  const userMenuItems: MenuItem[] = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      command: () => {
        // Acción para perfil
      }
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      command: () => {
        setActiveComponent('configuracion');
      }
    },
    {
      separator: true
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: handleLogout
    }
  ];

  const sidebarStyles: React.CSSProperties = {
    backgroundColor: '#264653',
    width: '200px',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    overflowY: 'auto',
    zIndex: 1000
  };

  const buttonStyles: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: '#d8e2dc',
    width: '100%',
    border: 'none',
    transition: 'background-color 0.3s ease',
    justifyContent: 'flex-start',
    padding: '0.75rem 1rem'
  };

  return (
    <div 
      className="flex flex-column p-3"
      style={sidebarStyles}
    >
      {/* Logo */}
      <div className="flex align-items-center justify-content-center mb-4">
        <img src="/logo.png" alt="Logo" style={{ width: '80px' }} />
      </div>

      {/* Menu */}
      <div className="flex flex-column gap-2">
        <Button
          className="p-button-text"
          style={{ ...buttonStyles, fontWeight: 'bold', fontSize: '1.2rem' }}
          onClick={() => setActiveComponent('dashboard')}
        >
          Dashboard
        </Button>
        {menuItems.map((item) => (
          <Button
            key={item.key}
            className="p-button-text"
            style={buttonStyles}
            onClick={() => setActiveComponent(item.key)}
          >
            {item.name}
          </Button>
        ))}
      </div>

      <Divider className="my-3" />

      {/* User Menu */}
      <Menu model={userMenuItems} popup ref={menuRef} />
      <Button
        label="Usuario"
        icon="pi pi-user"
        onClick={(event) => menuRef.current?.toggle(event)}
        className="p-button-text mt-auto"
        style={{ color: '#d8e2dc' }}
      />
    </div>
  );
};

export default Sidebar;