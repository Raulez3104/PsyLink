import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import type { MenuItem } from 'primereact/menuitem';
import { Divider } from 'primereact/divider';
import styles from '../css/Sidebar.module.scss';
import 'primeflex/primeflex.css';
import { useNavigate } from 'react-router-dom';

type ComponentType =
  | 'dashboard_admin'
  | 'pacientes_admin'
  | 'agenda_admin'
  | 'lista'
  | 'configuracion_admin';

interface SidebarProps {
  setActiveComponent: (component: ComponentType) => void;
  visible: boolean;
}

const Sidebar_Admin: React.FC<SidebarProps> = ({ setActiveComponent, visible }) => {
  const menuRef = useRef<Menu>(null);
  const navigate=useNavigate();
  const handleLogout = () => {
  localStorage.removeItem('auth');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  navigate("/", { replace: true });
};

  const menuItems = [
    { name: 'Lista de Psicólogos', key: 'lista' },
  ];

  const userMenuItems: MenuItem[] = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      command:()=> setActiveComponent('configuracion_admin'),
    },
    { separator: true },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: handleLogout,
    },
  ];

  const hiddenContentClass = visible ? '' : styles.hiddenContent;

  return (
    <div className={`${styles.sidebar} ${!visible ? styles.collapsed : ''}`}>
      <div className={`${styles.logoContainer} ${hiddenContentClass}`}>
        <img src="/iconn.ico" alt="Logo" />
      </div>

      <div className={`${styles.buttonsContainer} ${hiddenContentClass}`}>
        <Button
          className={`${styles.button} p-button-text`}
          onClick={() => setActiveComponent('dashboard_admin')}
          // Si quieres marcar activo el botón, puedes pasar un prop extra y comparar aquí
        >
          Dashboard
        </Button>

        {menuItems.map((item) => (
          <Button
            key={item.key}
            className={`${styles.button} p-button-text`}
            onClick={() => setActiveComponent(item.key as ComponentType)}
          >
            {item.name}
          </Button>
        ))}
      </div>

      <Divider className={`${styles.divider} ${hiddenContentClass}`} />

      <Menu model={userMenuItems} popup ref={menuRef} />
      <Button
        label="Usuario"
        icon="pi pi-user"
        onClick={(event) => menuRef.current?.toggle(event)}
        className={`${styles.userButton} p-button-text ${hiddenContentClass}`}
      />
    </div>
  );
};

export default Sidebar_Admin;
