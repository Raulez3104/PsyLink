import styles from '../css/Servicio_Web.module.css';
import videoEvaluacion from '/ser1.mp4';
import videoSeguimiento from '/ser2.mp4';
import videoRecomendaciones from '/ser3.mp4';

const Servicio_Web = () => {
  return (
    <div className={`flex flex-column align-items-center py-6 px-2 ${styles.container}`}>
      <h2 className={`text-4xl font-bold mb-5 text-primary ${styles.title}`}>Nuestros Servicios</h2>
      <div className={`flex flex-column md:flex-row gap-5 w-full justify-content-center ${styles.cardGroup}`}>
        {/* Card 1 */}
        <div className={`flex-1 border-round shadow-2 p-4 bg-white flex flex-column align-items-center ${styles.cardWrapper} ${styles.card}`}>
          <div className={`mb-3 w-full flex justify-content-center ${styles.videoWrapper}`}>
            <video className={`border-round w-full ${styles.video}`} src={videoEvaluacion} loop autoPlay muted playsInline />
          </div>
          <h5 className={`text-lg font-semibold mb-2 text-primary ${styles.cardTitle}`}>Evaluaciones Psicológicas</h5>
          <p className={`text-center ${styles.cardText}`}>
            Aplicación de tests psicológicos validados para evaluar el estado emocional y mental de los pacientes, bajo supervisión profesional.
          </p>
        </div>

        {/* Card 2 */}
        <div className={`flex-1 border-round shadow-2 p-4 bg-white flex flex-column align-items-center ${styles.cardWrapper} ${styles.card}`}>
          <div className={`mb-3 w-full flex justify-content-center ${styles.videoWrapper}`}>
            <video className={`border-round w-full ${styles.video}`} src={videoSeguimiento} loop autoPlay muted playsInline />
          </div>
          <h5 className={`text-lg font-semibold mb-2 text-primary ${styles.cardTitle}`}>Seguimiento Personalizado</h5>
          <p className={`text-center ${styles.cardText}`}>
            Diario emocional, evolución gráfica de estados de ánimo y notas clínicas para apoyar la continuidad del tratamiento.
          </p>
        </div>

        {/* Card 3 */}
        <div className={`flex-1 border-round shadow-2 p-4 bg-white flex flex-column align-items-center ${styles.cardWrapper} ${styles.card}`}>
          <div className={`mb-3 w-full flex justify-content-center ${styles.videoWrapper}`}>
            <video className={`border-round w-full ${styles.video}`} src={videoRecomendaciones} loop autoPlay muted playsInline />
          </div>
          <h5 className={`text-lg font-semibold mb-2 text-primary ${styles.cardTitle}`}>Recomendaciones Inteligentes</h5>
          <p className={`text-center ${styles.cardText}`}>
            Recomendaciones de recursos, técnicas de relajación y ejercicios según los patrones detectados por IA, siempre validados por el profesional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Servicio_Web;