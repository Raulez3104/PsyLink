import styles from '../css/MenuBar_Web.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const MenuBar_Web = () => {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("auth") === "true";

  return (
    <div className={`flex align-items-center gap-4 ${styles.menuBar}`}>
      <ul className={`flex list-none m-0 p-0 gap-3 ${styles.opciones}`}>
        <li>
          <NavLink to="/" className={({ isActive }) => `no-underline px-2 py-1 border-round transition-colors transition-duration-150 ${isActive ? 'bg-primary text-white' : 'text-primary hover:bg-primary-100'}`}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/contactos" className={({ isActive }) => `no-underline px-2 py-1 border-round transition-colors transition-duration-150 ${isActive ? 'bg-primary text-white' : 'text-primary hover:bg-primary-100'}`}>
            Contactos
          </NavLink>
        </li>
        <li>
          <NavLink to="/acerca-de" className={({ isActive }) => `no-underline px-2 py-1 border-round transition-colors transition-duration-150 ${isActive ? 'bg-primary text-white' : 'text-primary hover:bg-primary-100'}`}>
            Acerca De
          </NavLink>
        </li>
      </ul>
      {!isAuth && (
        <Button
          label="Iniciar sesión"
          icon="pi pi-sign-in"
          className="p-button-sm p-button-primary"
          onClick={() => navigate('/login')}
        />
      )}
      {isAuth && (
        <Button
          label="Cerrar sesión"
          icon="pi pi-sign-out"
          className="p-button-sm p-button-secondary"
          onClick={() => {
            localStorage.removeItem("auth");
            navigate("/");
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default MenuBar_Web;