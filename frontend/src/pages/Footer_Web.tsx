import styles from '../css/Footer_Web.module.css';

const Footer_Web = () => {
  return (
    <footer className={`bg-primary-50 text-gray-700 ${styles.footer}`}>
      <div className={`flex flex-column md:flex-row justify-content-between align-items-center gap-4 px-4 py-4 ${styles.content}`}>
        <div className={`flex flex-column align-items-start ${styles.brand}`}>
          <h2 className="m-0 text-primary font-bold">Psylink</h2>
          <p className="mt-2 mb-0">Conectando salud mental y tecnología.</p>
        </div>

        <nav className={`flex gap-3 flex-wrap ${styles.nav}`}>
          <a href="#inicio" className="text-primary hover:underline">Inicio</a>
          <a href="#servicios" className="text-primary hover:underline">Servicios</a>
          <a href="#contacto" className="text-primary hover:underline">Contacto</a>
          <a href="#acerca" className="text-primary hover:underline">Acerca</a>
        </nav>

        <div className={`flex gap-2 ${styles.social}`}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-primary text-xl">📘</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-primary text-xl">🐦</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-primary text-xl">🔗</a>
        </div>
      </div>

      <div className={`text-center py-3 text-sm bg-primary-100 ${styles.copy}`}>
        © {new Date().getFullYear()} Psylink. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer_Web;