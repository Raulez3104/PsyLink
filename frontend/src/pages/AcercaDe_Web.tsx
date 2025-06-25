import { Card } from "primereact/card";
import styles from '../css/AcercaDe.module.css';

const AcercaDe_Web = () => {
  return (
    <div className={`flex justify-content-center align-items-center min-h-screen bg-gray-50 ${styles.container}`}>
      <Card className={`w-full md:w-7 lg:w-5 shadow-2 ${styles.contentCard}`}>
        <div className="mb-4">
          <h2 className={`text-2xl font-bold mb-3 text-primary ${styles.title}`}>¿Qué es Psylink?</h2>
          <p className={`mb-4 line-height-3 ${styles.description}`}>
            <strong>Psylink</strong> es una plataforma digital de apoyo psicológico diseñada para complementar el trabajo de los profesionales de la salud mental.
            Brinda herramientas como test psicológicos validados, diarios emocionales y análisis con inteligencia artificial, siempre bajo supervisión profesional.
            Su objetivo es facilitar la evaluación, el seguimiento y la orientación emocional de los pacientes en un entorno ético, privado y profesional.
          </p>
        </div>

        <div className={`mt-4 ${styles.mapSection}`}>
          <h4 className={`text-lg font-semibold mb-2 text-primary ${styles.mapTitle}`}>Nuestra ubicación de referencia</h4>
          <iframe
            title="Ubicación Psylink"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.9534017994383!2d-122.08424968469106!3d37.42206597982525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb7326ac12b69%3A0xd4ab262b2dc73011!2sGoogleplex!5e0!3m2!1ses-419!2spe!4v1665696386166!5m2!1ses-419!2spe"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            className={`border-round shadow-1 ${styles.map}`}
          ></iframe>
        </div>
      </Card>
    </div>
  );
};

export default AcercaDe_Web;