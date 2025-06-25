import styles from '../css/Servicio_Web.module.css';
import videoEvaluacion from '/ser5.mp4';
import videoSeguimiento from '/ser3.mp4';
import videoRecomendaciones from '/ser4.mp4';

const Servicio_Web = () => {
  return (
      <div className={`flex flex-column align-items-center py-5 px-2 ${styles.container}`}>
      <h2 className={`text-4xl font-bold mb-4 mt-1 text-primary ${styles.title}`}>Nuestros Servicios</h2>
      <div className={`flex flex-column md:flex-row gap-5 w-full justify-content-center ${styles.cardGroup}`}>
        {/* Card 1 */}
        <div className={`flex-1 border-round shadow-2 p-4 bg-white flex flex-column align-items-center ${styles.cardWrapper} ${styles.card}`}>
          <div className={`mb-3 w-full flex justify-content-center ${styles.videoWrapper}`}>
            <video className={`border-round w-full ${styles.video}`} src={videoEvaluacion} loop autoPlay muted playsInline />
          </div>
          <h5 className={`text-lg font-semibold mb-2 text-primary ${styles.cardTitle}`}>Evaluaciones Psicológicas Digitales</h5>
          <p className={`text-center ${styles.cardText}`}>
            Aplicación y gestión de test psicológicos validados, asignados por profesionales. Resultados organizados y seguros, listos para el análisis clínico.
          </p>
        </div>

        {/* Card 2 */}
        <div className={`flex-1 border-round shadow-2 p-4 bg-white flex flex-column align-items-center ${styles.cardWrapper} ${styles.card}`}>
          <div className={`mb-3 w-full flex justify-content-center ${styles.videoWrapper}`}>
            <video className={`border-round w-full ${styles.video}`} src={videoSeguimiento} loop autoPlay muted playsInline />
          </div>
          <h5 className={`text-lg font-semibold mb-2 text-primary ${styles.cardTitle}`}>Diarios Emocionales Inteligentes "IDiary"</h5>
          <p className={`text-center ${styles.cardText}`}>
            Herramienta para el seguimiento del estado emocional de los pacientes. Registros diarios interpretados por IA para detectar patrones y brindar apoyo personalizado.
          </p>
        </div>

        {/* Card 3 */}
        <div className={`flex-1 border-round shadow-2 p-4 bg-white flex flex-column align-items-center ${styles.cardWrapper} ${styles.card}`}>
          <div className={`mb-3 w-full flex justify-content-center ${styles.videoWrapper}`}>
            <video className={`border-round w-full ${styles.video}`} src={videoRecomendaciones} loop autoPlay muted playsInline />
          </div>
          <h5 className={`text-lg font-semibold mb-2 text-primary ${styles.cardTitle}`}>Gestión Clínica Integral</h5>
          <p className={`text-center ${styles.cardText}`}>
            Agenda de sesiones, lista de pacientes, historial clínico digital y notas profesionales, todo en un entorno seguro y accesible desde cualquier dispositivo.
          </p>
        </div>
      </div>
    </div>    
  );
};

export default Servicio_Web;