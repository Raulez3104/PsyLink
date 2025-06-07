import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';

interface BasicSettings {
  username: string;
  email: string;
  theme: string;
  language: string;
  notifications: boolean;
}

const SettingsInterface: React.FC = () => {
  const [settings, setSettings] = useState<BasicSettings>({
    username: 'mi_usuario',
    email: 'usuario@email.com',
    theme: 'light',
    language: 'es',
    notifications: true
  });


  const handleSave = () => {
    console.log('Configuraciones guardadas:', settings);
  };

  return (
    <div className="min-h-screen surface-50 p-4">
      <div className="max-w-35rem mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-900 mb-2">Settings</h1>
          <p className="text-600 text-lg">Manage your preferences</p>
        </div>

        {/* Settings Container */}
        <div className="bg-white border-round-2xl shadow-2 p-6">
          <div className="flex flex-column gap-6">
            
            {/* Profile Section */}
            <div>
              <h3 className="text-900 font-bold text-xl mb-4 flex align-items-center gap-2">
                <i className="pi pi-user text-primary text-lg"></i>
                Profile
              </h3>
              
              <div className="flex flex-column gap-4">
                <div>
                  <label className="block text-900 font-medium mb-2">Username</label>
                  <InputText
                    value={settings.username}
                    onChange={(e) => setSettings({...settings, username: e.target.value})}
                    className="w-full p-3 text-base"
                  />
                </div>

                <div>
                  <label className="block text-900 font-medium mb-2">Email</label>
                  <InputText
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="w-full p-3 text-base"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-top-1 surface-border"></div>


            {/* Divider */}

            {/* Notifications Section */}
            <div>
              <h3 className="text-900 font-bold text-xl mb-4 flex align-items-center gap-2">
                <i className="pi pi-bell text-primary text-lg"></i>
                Notifications
              </h3>
              
              <div className="flex justify-content-between align-items-center p-4 surface-100 border-round-lg">
                <div>
                  <div className="text-900 font-medium">Push Notifications</div>
                  <div className="text-600 text-sm">Receive app notifications</div>
                </div>
                <InputSwitch
                  checked={settings.notifications}
                  onChange={(e) => setSettings({...settings, notifications: e.value})}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-top-1 surface-border"></div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button 
                label="Cancel" 
                severity="secondary"
                outlined
                className="flex-1 p-3"
              />
              <Button 
                label="Save Changes" 
                icon="pi pi-check"
                onClick={handleSave}
                className="flex-1 p-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsInterface;