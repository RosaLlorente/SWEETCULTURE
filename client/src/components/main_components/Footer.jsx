//Importaciones funcionales
import { Link } from 'react-router-dom';
//Importaciones diseño
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/CSS/main_components/Footer.css';

export function Footer() 
{
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container text-center text-md-start">
        {/* Logo */}
        <div className="mb-4 d-flex justify-content-center">
          <Link to="/inicio" className="img-3d2">
            <img src="/Image/LogoSWEETCULTURE.png" alt="Logo Sweet Culture" />
          </Link>
        </div>

        <div className="row">
          {/* Políticas */}
          <div className="col-md-4 mb-3">
            <h5>Políticas</h5>
            <ul className="list-unstyled">
              <li><a href="https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673" className="text-white text-decoration-none">Política de privacidad</a></li>
              <li><a href="https://www.boe.es/buscar/act.php?id=BOE-A-2011-16819" className="text-white text-decoration-none">Términos y condiciones</a></li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div className="col-md-4 mb-3">
            <h5>Redes Sociales</h5>
            <div className="d-flex justify-content-start gap-3 mt-2">
              <a href="https://www.facebook.com/?locale=es_ES" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#4460A0">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9V12h2.54V9.41c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99C18.34 21.12 22 16.99 22 12z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.197-4.359-2.62-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#CE1312">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div className="col-md-4 mb-3">
            <h5>Contacto</h5>
            <p className="mb-1">Email: contacto@sweetculture.com</p>
            <p className="mb-1">Teléfono: +34 234 567 890</p>
            <p className="mb-0">Dirección: Calle Elvira 8, 18002 Granada</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-4 border-top pt-3">
          <p className="mb-0">© 2025 Sweet Culture. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
