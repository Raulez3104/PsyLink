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
        Video no Soportado
      </video>

      <div className={styles.capa}></div>

      <div className={styles.textContainer}>
        <h1 className={styles.title}>Bienvenido a PsyLink</h1>
        <p className={styles.subtitle}>
          Tu espacio digital de apoyo profesional en salud mental.
Aquí encontrarás herramientas diseñadas para facilitar tu labor clínica, acompañar a tus pacientes y potenciar tu práctica con tecnología ética y segura.
        </p>
      </div>
    </div>
  );
};

export default Inicio;
