import styles from '../css/Inicios.module.css';

const Inicio = () => {
  return (
    <div className={styles.fullscreenContainer} role="main" aria-label="Bienvenida a Psylink">
      <video
        src="/carrousel.mp4"
        className={styles.video}
        autoPlay
        loop
        playsInline
        muted
        aria-hidden="true"
      >
        Your browser does not support the video tag.
      </video>

      <div className={styles.capa}></div>

      <div className={styles.textContainer}>
        <h1 className={styles.title}>Bienvenido a Psylink</h1>
        <p className={styles.subtitle}>
          Tu espacio seguro para el apoyo psicológico digital, donde la tecnología y la empatía se unen para cuidar tu bienestar mental.
          Explora nuestras herramientas diseñadas para acompañarte y respaldar tu salud emocional con la supervisión de profesionales.
        </p>
      </div>
    </div>
  );
};

export default Inicio;
