// src/pages/Evaluaciones.tsx
import { DataTable } from 'primereact/datatable';
import { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';
import { Divider } from 'primereact/divider';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

type Psicologo = {
  id_psico: number;
  nombre: string;
};

type Test = {
  id_test?: number;
  id_psico: number;
  titulo: string;
  descripcion?: string;
  tipo_validacion: string;
  fecha_creacion?: string;
};

type Pregunta = {
  id_pregunta?: number;
  id_test: number;
  contenido: string;
  tipo_pregunta: string;
  orden: number;
  opciones?: Opcion[];
};

type Opcion = {
  id_opcion?: number;
  id_pregunta: number;
  texto_opcion: string;
  valor: number;
};

const tiposValidacion = [
  { label: 'Suma', value: 'suma' },
  { label: 'Promedio', value: 'promedio' },
  { label: 'Ponderado', value: 'ponderado' }
];

const tiposPregunta = [
  { label: 'Opción múltiple', value: 'opcion_multiple' },
  { label: 'Escala', value: 'escala' }
];

const Evaluaciones = () => {
  const psicologo: Psicologo = { id_psico: 1, nombre: 'Psicólogo Demo' };

  const [tests, setTests] = useState<Test[]>([]);
  const [testDialog, setTestDialog] = useState(false);
  const [testActual, setTestActual] = useState<Test | null>(null);

  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [preguntaDialog, setPreguntaDialog] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState<Pregunta | null>(null);

  const [opcionDialog, setOpcionDialog] = useState(false);
  const [opcionActual, setOpcionActual] = useState<Opcion | null>(null);

  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await fetch(`/api/tests?id_psico=${psicologo.id_psico}`);
      const data = await res.json();
      setTests(data);
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los tests' });
    }
  };

  const openNewTest = () => {
    setTestActual({
      id_psico: psicologo.id_psico,
      titulo: '',
      descripcion: '',
      tipo_validacion: ''
    });
    setTestDialog(true);
  };

  const hideTestDialog = () => {
    setTestDialog(false);
    setTestActual(null);
    setPreguntas([]);
    setPreguntaActual(null);
  };

  const saveTest = async () => {
    if (!testActual?.titulo || !testActual.tipo_validacion) {
      toast.current?.show({ severity: 'warn', summary: 'Aviso', detail: 'Ingrese título y tipo de validación' });
      return;
    }
    try {
      if (testActual.id_test) {
        await fetch(`/api/tests/${testActual.id_test}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testActual)
        });
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Test actualizado' });
      } else {
        const res = await fetch('/api/tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testActual)
        });
        const nuevoTest = await res.json();
        setTestActual(nuevoTest);
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Test creado' });
      }
      fetchTests();
      setTestDialog(false);
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el test' });
    }
  };

  const editTest = (test: Test) => {
    setTestActual(test);
    fetchPreguntas(test.id_test!);
    setTestDialog(true);
  };

  const deleteTest = (test: Test) => {
    confirmDialog({
      message: '¿Está seguro que desea eliminar el test?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await fetch(`/api/tests/${test.id_test}`, { method: 'DELETE' });
          toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Test eliminado' });
          fetchTests();
        } catch (error) {
          console.error(error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el test' });
        }
      }
    });
  };

  const fetchPreguntas = async (id_test: number) => {
    try {
      const res = await fetch(`/api/preguntas?id_test=${id_test}`);
      const data = await res.json();
      setPreguntas(data);
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las preguntas' });
    }
  };

  const openNewPregunta = () => {
    if (!testActual) return;
    setPreguntaActual({
      id_test: testActual.id_test!,
      contenido: '',
      tipo_pregunta: '',
      orden: preguntas.length + 1
    });
    setPreguntaDialog(true);
  };

  const hidePreguntaDialog = () => {
    setPreguntaDialog(false);
    setPreguntaActual(null);
  };

  const savePregunta = async () => {
    if (!preguntaActual?.contenido || !preguntaActual.tipo_pregunta) {
      toast.current?.show({ severity: 'warn', summary: 'Aviso', detail: 'Ingrese contenido y tipo de pregunta' });
      return;
    }
    try {
      if (preguntaActual.id_pregunta) {
        await fetch(`/api/preguntas/${preguntaActual.id_pregunta}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preguntaActual)
        });
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Pregunta actualizada' });
      } else {
        const res = await fetch('/api/preguntas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preguntaActual)
        });
        await res.json();
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Pregunta creada' });
      }
      fetchPreguntas(preguntaActual!.id_test);
      setPreguntaDialog(false);
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la pregunta' });
    }
  };

  const editPregunta = (pregunta: Pregunta) => {
    setPreguntaActual(pregunta);
    fetchOpciones(pregunta.id_pregunta!);
    setPreguntaDialog(true);
  };

  const deletePregunta = (pregunta: Pregunta) => {
    confirmDialog({
      message: '¿Está seguro que desea eliminar la pregunta?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await fetch(`/api/preguntas/${pregunta.id_pregunta}`, { method: 'DELETE' });
          toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Pregunta eliminada' });
          fetchPreguntas(pregunta.id_test);
        } catch (error) {
          console.error(error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la pregunta' });
        }
      }
    });
  };

  const fetchOpciones = async (id_pregunta: number) => {
    try {
      const res = await fetch(`/api/opciones?id_pregunta=${id_pregunta}`);
      const data = await res.json();
      setPreguntaActual((prev) => prev ? { ...prev, opciones: data } : prev);
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las opciones' });
    }
  };

  const openNewOpcion = () => {
    if (!preguntaActual) return;
    setOpcionActual({
      id_pregunta: preguntaActual.id_pregunta!,
      texto_opcion: '',
      valor: 0
    });
    setOpcionDialog(true);
  };

  const hideOpcionDialog = () => {
    setOpcionDialog(false);
    setOpcionActual(null);
  };

  const saveOpcion = async () => {
    if (!opcionActual?.texto_opcion) {
      toast.current?.show({ severity: 'warn', summary: 'Aviso', detail: 'Ingrese texto de opción' });
      return;
    }
    try {
      if (opcionActual.id_opcion) {
        await fetch(`/api/opciones/${opcionActual.id_opcion}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(opcionActual)
        });
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Opción actualizada' });
      } else {
        const res = await fetch('/api/opciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(opcionActual)
        });
        await res.json();
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Opción creada' });
      }
      fetchOpciones(opcionActual!.id_pregunta);
      setOpcionDialog(false);
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la opción' });
    }
  };

  const editOpcion = (opcion: Opcion) => {
    setOpcionActual(opcion);
    setOpcionDialog(true);
  };

  const deleteOpcion = (opcion: Opcion) => {
    confirmDialog({
      message: '¿Está seguro que desea eliminar la opción?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await fetch(`/api/opciones/${opcion.id_opcion}`, { method: 'DELETE' });
          toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Opción eliminada' });
          fetchOpciones(opcion.id_pregunta);
        } catch (error) {
          console.error(error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la opción' });
        }
      }
    });
  };

  // Columnas y templates para renderizado
  const actionBodyTemplate = (rowData: Test) => {
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-success p-button-sm" 
          onClick={() => editTest(rowData)} 
          tooltip="Editar"
        />
        <Button 
          icon="pi pi-trash" 
          className="p-button-rounded p-button-danger p-button-sm" 
          onClick={() => deleteTest(rowData)} 
          tooltip="Eliminar"
        />
      </div>
    );
  };

  const tipoValidacionBodyTemplate = (rowData: Test) => {
    const severity = rowData.tipo_validacion === 'suma' ? 'success' : 
                    rowData.tipo_validacion === 'promedio' ? 'info' : 'warning';
    return <Tag value={rowData.tipo_validacion} severity={severity} />;
  };

  const fechaBodyTemplate = (rowData: Test) => {
    return rowData.fecha_creacion ? new Date(rowData.fecha_creacion).toLocaleDateString() : '-';
  };

  const preguntaActionBodyTemplate = (rowData: Pregunta) => {
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-success p-button-sm" 
          onClick={() => editPregunta(rowData)} 
          tooltip="Editar"
        />
        <Button 
          icon="pi pi-trash" 
          className="p-button-rounded p-button-danger p-button-sm" 
          onClick={() => deletePregunta(rowData)} 
          tooltip="Eliminar"
        />
      </div>
    );
  };

  const tipoPreguntaBodyTemplate = (rowData: Pregunta) => {
    const severity = rowData.tipo_pregunta === 'opcion_multiple' ? 'info' : 'warning';
    return <Tag value={rowData.tipo_pregunta} severity={severity} />;
  };

  const opcionActionBodyTemplate = (rowData: Opcion) => {
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-success p-button-sm" 
          onClick={() => editOpcion(rowData)} 
          tooltip="Editar"
        />
        <Button 
          icon="pi pi-trash" 
          className="p-button-rounded p-button-danger p-button-sm" 
          onClick={() => deleteOpcion(rowData)} 
          tooltip="Eliminar"
        />
      </div>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button 
          label="Nuevo Test" 
          icon="pi pi-plus" 
          className="p-button-success" 
          onClick={openNewTest} 
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="flex align-items-center gap-2">
        <i className="pi pi-user"></i>
        <span className="font-medium">{psicologo.nombre}</span>
      </div>
    );
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-900 mb-2">
          <i className="pi pi-clipboard mr-2"></i>
          Gestión de Evaluaciones Psicológicas
        </h1>
        <p className="text-600">Administra tests, preguntas y opciones de respuesta</p>
      </div>

      {/* Toolbar */}
      <Toolbar 
        className="mb-4" 
        left={leftToolbarTemplate} 
        right={rightToolbarTemplate}
      />

      {/* Tabla principal de Tests */}
      <Card className="mb-4">
        <div className="flex justify-content-between align-items-center mb-3">
          <h2 className="text-xl font-semibold text-900 m-0">Tests Psicológicos</h2>
          <Tag value={`${tests.length} tests`} severity="info" />
        </div>
        
        <DataTable 
          value={tests} 
          paginator 
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className="p-datatable-gridlines"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} tests"
          emptyMessage="No hay tests registrados"
          responsiveLayout="scroll"
        >
          <Column field="id_test" header="ID" sortable style={{minWidth: '80px'}}></Column>
          <Column field="titulo" header="Título" sortable style={{minWidth: '200px'}}></Column>
          <Column field="descripcion" header="Descripción" style={{minWidth: '250px'}}></Column>
          <Column 
            field="tipo_validacion" 
            header="Tipo Validación" 
            body={tipoValidacionBodyTemplate}
            sortable 
            style={{minWidth: '150px'}}
          ></Column>
          <Column 
            field="fecha_creacion" 
            header="Fecha Creación" 
            body={fechaBodyTemplate}
            sortable 
            style={{minWidth: '120px'}}
          ></Column>
          <Column 
            body={actionBodyTemplate} 
            header="Acciones"
            exportable={false} 
            style={{minWidth: '120px'}}
          ></Column>
        </DataTable>
      </Card>

      {/* Dialog para crear/editar Test */}
      <Dialog 
        visible={testDialog} 
        style={{width: '50rem'}} 
        breakpoints={{'960px': '75vw', '641px': '90vw'}} 
        header={testActual?.id_test ? "Editar Test" : "Nuevo Test"} 
        modal 
        className="p-fluid" 
        onHide={hideTestDialog}
      >
        <div className="formgrid grid">
          <div className="field col-12">
            <label htmlFor="titulo" className="font-bold">Título *</label>
            <InputText 
              id="titulo" 
              value={testActual?.titulo || ''} 
              onChange={(e) => setTestActual(prev => prev ? {...prev, titulo: e.target.value} : null)} 
              required 
              autoFocus 
              className={!testActual?.titulo ? 'p-invalid' : ''}
            />
            {!testActual?.titulo && <small className="p-error">El título es requerido.</small>}
          </div>
          
          <div className="field col-12">
            <label htmlFor="descripcion" className="font-bold">Descripción</label>
            <InputTextarea 
              id="descripcion" 
              value={testActual?.descripcion || ''} 
              onChange={(e) => setTestActual(prev => prev ? {...prev, descripcion: e.target.value} : null)} 
              rows={3} 
              cols={20} 
            />
          </div>
          
          <div className="field col-12">
            <label htmlFor="tipo_validacion" className="font-bold">Tipo de Validación *</label>
            <Dropdown 
              id="tipo_validacion" 
              value={testActual?.tipo_validacion} 
              onChange={(e) => setTestActual(prev => prev ? {...prev, tipo_validacion: e.value} : null)} 
              options={tiposValidacion} 
              placeholder="Seleccionar tipo de validación" 
              className={!testActual?.tipo_validacion ? 'p-invalid' : ''}
            />
            {!testActual?.tipo_validacion && <small className="p-error">El tipo de validación es requerido.</small>}
          </div>
        </div>

        {/* Sección de Preguntas dentro del Dialog del Test */}
        {testActual?.id_test && (
          <>
            <Divider />
            <div className="flex justify-content-between align-items-center mb-3">
              <h3 className="text-lg font-semibold text-900 m-0">Preguntas</h3>
              <Button 
                label="Nueva Pregunta" 
                icon="pi pi-plus" 
                className="p-button-sm" 
                onClick={openNewPregunta}
              />
            </div>
            
            <DataTable 
              value={preguntas} 
              className="p-datatable-gridlines p-datatable-sm"
              emptyMessage="No hay preguntas registradas"
              responsiveLayout="scroll"
            >
              <Column field="orden" header="Orden" sortable style={{minWidth: '80px'}}></Column>
              <Column field="contenido" header="Contenido" style={{minWidth: '300px'}}></Column>
              <Column 
                field="tipo_pregunta" 
                header="Tipo" 
                body={tipoPreguntaBodyTemplate}
                style={{minWidth: '120px'}}
              ></Column>
              <Column 
                body={preguntaActionBodyTemplate} 
                header="Acciones"
                style={{minWidth: '100px'}}
              ></Column>
            </DataTable>
          </>
        )}

        <div className="flex justify-content-end gap-2 mt-4">
          <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideTestDialog} />
          <Button label="Guardar" icon="pi pi-check" onClick={saveTest} autoFocus />
        </div>
      </Dialog>

      {/* Dialog para crear/editar Pregunta */}
      <Dialog 
        visible={preguntaDialog} 
        style={{width: '45rem'}} 
        breakpoints={{'960px': '75vw', '641px': '90vw'}} 
        header={preguntaActual?.id_pregunta ? "Editar Pregunta" : "Nueva Pregunta"} 
        modal 
        className="p-fluid" 
        onHide={hidePreguntaDialog}
      >
        <div className="formgrid grid">
          <div className="field col-12">
            <label htmlFor="contenido" className="font-bold">Contenido de la Pregunta *</label>
            <InputTextarea 
              id="contenido" 
              value={preguntaActual?.contenido || ''} 
              onChange={(e) => setPreguntaActual(prev => prev ? {...prev, contenido: e.target.value} : null)} 
              rows={3} 
              cols={20} 
              required 
              autoFocus 
              className={!preguntaActual?.contenido ? 'p-invalid' : ''}
            />
            {!preguntaActual?.contenido && <small className="p-error">El contenido es requerido.</small>}
          </div>
          
          <div className="field col-6">
            <label htmlFor="tipo_pregunta" className="font-bold">Tipo de Pregunta *</label>
            <Dropdown 
              id="tipo_pregunta" 
              value={preguntaActual?.tipo_pregunta} 
              onChange={(e) => setPreguntaActual(prev => prev ? {...prev, tipo_pregunta: e.value} : null)} 
              options={tiposPregunta} 
              placeholder="Seleccionar tipo" 
              className={!preguntaActual?.tipo_pregunta ? 'p-invalid' : ''}
            />
            {!preguntaActual?.tipo_pregunta && <small className="p-error">El tipo es requerido.</small>}
          </div>
          
          <div className="field col-6">
            <label htmlFor="orden" className="font-bold">Orden</label>
            <InputNumber 
              id="orden" 
              value={preguntaActual?.orden} 
              onValueChange={(e) => setPreguntaActual(prev => prev ? {...prev, orden: e.value || 1} : null)} 
              min={1}
            />
          </div>
        </div>

        {/* Sección de Opciones dentro del Dialog de Pregunta */}
        {preguntaActual?.id_pregunta && preguntaActual.opciones && (
          <>
            <Divider />
            <div className="flex justify-content-between align-items-center mb-3">
              <h4 className="text-base font-semibold text-900 m-0">Opciones de Respuesta</h4>
              <Button 
                label="Nueva Opción" 
                icon="pi pi-plus" 
                className="p-button-sm p-button-outlined" 
                onClick={openNewOpcion}
              />
            </div>
            
            <DataTable 
              value={preguntaActual.opciones} 
              className="p-datatable-gridlines p-datatable-sm"
              emptyMessage="No hay opciones registradas"
              responsiveLayout="scroll"
            >
              <Column field="texto_opcion" header="Texto de la Opción" style={{minWidth: '250px'}}></Column>
              <Column field="valor" header="Valor" style={{minWidth: '80px'}}></Column>
              <Column 
                body={opcionActionBodyTemplate} 
                header="Acciones"
                style={{minWidth: '100px'}}
              ></Column>
            </DataTable>
          </>
        )}

        <div className="flex justify-content-end gap-2 mt-4">
          <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hidePreguntaDialog} />
          <Button label="Guardar" icon="pi pi-check" onClick={savePregunta} autoFocus />
        </div>
      </Dialog>

      {/* Dialog para crear/editar Opción */}
      <Dialog 
        visible={opcionDialog} 
        style={{width: '32rem'}} 
        breakpoints={{'960px': '75vw', '641px': '90vw'}} 
        header={opcionActual?.id_opcion ? "Editar Opción" : "Nueva Opción"} 
        modal 
        className="p-fluid" 
        onHide={hideOpcionDialog}
      >
        <div className="formgrid grid">
          <div className="field col-12">
            <label htmlFor="texto_opcion" className="font-bold">Texto de la Opción *</label>
            <InputText 
              id="texto_opcion" 
              value={opcionActual?.texto_opcion || ''} 
              onChange={(e) => setOpcionActual(prev => prev ? {...prev, texto_opcion: e.target.value} : null)} 
              required 
              autoFocus 
              className={!opcionActual?.texto_opcion ? 'p-invalid' : ''}
            />
            {!opcionActual?.texto_opcion && <small className="p-error">El texto es requerido.</small>}
          </div>
          
          <div className="field col-12">
            <label htmlFor="valor" className="font-bold">Valor Numérico</label>
            <InputNumber 
              id="valor" 
              value={opcionActual?.valor} 
              onValueChange={(e) => setOpcionActual(prev => prev ? {...prev, valor: e.value || 0} : null)} 
              mode="decimal"
            />
          </div>
        </div>

        <div className="flex justify-content-end gap-2 mt-4">
          <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideOpcionDialog} />
          <Button label="Guardar" icon="pi pi-check" onClick={saveOpcion} autoFocus />
        </div>
      </Dialog>
    </div>
  );
};

export default Evaluaciones;