import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import styles from '../css/Topbar.module.scss';
import 'primeflex/primeflex.css';

interface TopbarProps {
  toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
  return (
    <div className={styles.topbar}>
      {/* Botón de mostrar/ocultar sidebar */}
      <Button
        icon="pi pi-bars"
        className={`p-button-text p-button-rounded ${styles.sidebarToggle}`}
        onClick={toggleSidebar}
      />

      {/* Búsqueda */}
      <div className={styles.searchContainer}>
        <InputText
          type="text"
          placeholder="Paciente ejemplo"
          className={`border-round ${styles.inputSearch}`}
        />
        <Button
          label="Buscar"
          className={`p-button-outlined p-button-secondary ${styles.searchButton}`}
        />
      </div>

      {/* Opciones */}
      <div className={styles.optionsContainer}>
        <Button
          label="Mi Consultorio"
          className={`p-button-text ${styles.optionButton}`}
        />

        <Divider layout="vertical" className={styles.dividerVertical} />

        <Button
          label="Notificación"
          className={`p-button-text ${styles.optionButton}`}
        />

        <Divider layout="vertical" className={styles.dividerVertical} />

        <Button
          label="Ayuda"
          className={`p-button-text ${styles.optionButton}`}
        />
      </div>
    </div>
  );
};

export default Topbar;
