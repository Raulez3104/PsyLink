import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import 'primeflex/primeflex.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

const submitContactForm = async (formData: FormData) => {
    try {
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('http://localhost:4000/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Error al enviar los datos');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const Contacto = () => {

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        try {
            await submitContactForm(formData);
            alert('Datos enviados correctamente');
            form.reset();
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(`Error: ${error.message}`);
            } else {
                alert('Ocurrió un error desconocido al enviar el formulario');
            }
        }
    };

    return (
        <div className="p-4" style={{ backgroundColor: "#e0f7fa", minHeight: '100vh' }}>
            <div className="flex justify-content-center">
                <Card className="shadow-3" style={{ backgroundColor: "#e3f2fd", width: '100%', maxWidth: '700px' }}>
                    <h2 className="text-center mb-4" style={{ color: '#1565c0' }}>Contáctanos</h2>
                    <form onSubmit={handleSubmit} className="p-fluid">
                        <div className="field mb-3">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" name="nombre" required style={{ backgroundColor: "#e1f5fe" }} />
                        </div>

                        <div className="field mb-3">
                            <label htmlFor="correo">Correo electrónico</label>
                            <InputText id="correo" name="correo" type="email" required style={{ backgroundColor: "#e1f5fe" }} />
                        </div>

                        <div className="field mb-3">
                            <label htmlFor="mensaje">Mensaje</label>
                            <InputTextarea id="mensaje" name="mensaje" rows={4} required style={{ backgroundColor: "#e1f5fe" }} />
                        </div>

                        <div className="field mb-4">
                            <label htmlFor="telefono">Teléfono</label>
                            <InputText id="telefono" name="telefono" required style={{ backgroundColor: "#e1f5fe" }} />
                        </div>

                        <div className="flex justify-content-center">
                            <Button
                                label="Enviar mensaje"
                                type="submit"
                                className="p-button"
                                style={{ backgroundColor: "#64b5f6", border: "none" }}
                            />
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Contacto;
