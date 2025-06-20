import MenuBar from "./MenuBar_Web";
import styles from '../css/Header_Web.module.css';

const Header_Web = () => {
  return (
    <header className={`shadow-2 w-full ${styles.header}`}>
      <div className="flex align-items-center justify-content-between px-4 py-2" style={{ minHeight: '70px' }}>
        <div className="flex align-items-center gap-2">
          <img className={styles.icono} src="/iconito.ico" alt="icono" style={{ width: 40, height: 40 }} />
          <span className="text-2xl text-primary">PsyLink</span>
        </div>
        <nav className="flex align-items-center">
          <MenuBar />
        </nav>
      </div>
    </header>
  );
};

export default Header_Web;