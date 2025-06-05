import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import 'primeflex/primeflex.css';


const Topbar: React.FC= () => {
  return (
    <div 
      className="flex justify-content-between align-items-center px-4 py-2"
      style={{ 
        backgroundColor: '#1abc9c',
        minHeight: '60px'
      }}
    >
      {/* Búsqueda */}
      <div className="flex align-items-center gap-2">
        <InputText
          type="text"
          placeholder="Paciente ejemplo"
          className="border-round"
          style={{ 
            width: '350px',
            height: '35px'
          }}
        />
        <Button
          label="Buscar"
          className="p-button-outlined p-button-secondary border-round"
          style={{ 
            width: '80px',
            height: '35px',
            backgroundColor: 'white',
            color: '#1abc9c',
            border: '1px solid white'
          }}
        />
      </div>

      {/* Opciones */}
      <div className="flex align-items-center gap-3">
        <Button
          label="Mi Consultorio"
          className="p-button-text"
          style={{ 
            color: 'white',
            fontWeight: '500',
            minWidth: '120px'
          }}
        />
        
        <Divider 
          layout="vertical" 
          style={{ 
            height: '24px',
            borderColor: 'white',
            margin: '0'
          }}
        />
        
        <Button
          label="Notificación"
          className="p-button-text"
          style={{ 
            color: 'white',
            fontWeight: '500',
            minWidth: '120px'
          }}
        />
        
        <Divider 
          layout="vertical" 
          style={{ 
            height: '24px',
            borderColor: 'white',
            margin: '0'
          }}
        />
        
        <Button
          label="Ayuda"
          className="p-button-text"
          style={{ 
            color: 'white',
            fontWeight: '500',
            minWidth: '80px'
          }}
        />
      </div>
    </div>
  );
};

export default Topbar;