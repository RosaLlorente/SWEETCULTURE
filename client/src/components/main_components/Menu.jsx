//Importaciones funcionales
import { useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "./AuthContext";

//Importaciones de diseño
import '../../assets/CSS/main_components/menu.css';

export function Menu() 
{
  //Declaración de constantes
  const { usuario } = useContext(AuthContext);

  /**
   * Hook que maneja el cambio de estilo de la barra de navegación
   * cuando el usuario hace scroll en la página.
   *
   * Al desplazarse hacia abajo más de 50px, se agrega la clase "scrolled"
   * a la barra de navegación para aplicar estilos.
   * Al volver hacia arriba, se elimina la clase "scrolled".
   *
   * La función se ejecuta cada vez que el componente se monta y se limpia
   * al desmontarse para evitar fugas de memoria.
   */
  useEffect(() => 
  {
    const handleScroll = () => 
    {
      const nav = document.querySelector(".navbar");
      if (window.scrollY > 50) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
    return (
    <>
        <header className="w-100">
          <nav id="Menu" className="navbar navbar-expand-lg bg-body-tertiary w-100 position-fixed mainMenu">
              <div className="container-fluid">
                <Link to="/inicio" className="navbar-brand  img-3d">
                      <img src="/Image/LogoSWEETCULTURE.png" alt="Logo de sweet culture"/>
                </Link>
                {/* Links siempre visibles */}
                <h1><Link to="/inicio" className="Marca navbar-brand">SWEET CULTURE</Link></h1>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarScroll">
                  <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                    <li className="nav-item">
                      <Link to="/inicio" className="nav-link active" aria-current="page">Inicio</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/catalogo" className="nav-link active" aria-current="page">Cátalogo</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/nosotros" className="nav-link">Nosotros</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/contactanos" className="nav-link">Contactanos</Link>
                    </li>

                  {/*Links para usuarios que han iniciado sesión */}
                  {usuario && 
                    (
                      <>
                        <li className="nav-item">
                          <Link to="/orderHistory" className="nav-link">Mis pedidos</Link>
                        </li>

                        {/* Links privados solo si el usuario es admin */}
                        {usuario.rol === 'admin' && 
                          (
                            <li className="nav-item dropdown">
                              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Gestión de acciones administrativas
                              </span>
                              <ul className="dropdown-menu">
                                <li><Link to="/addProduct" className="dropdown-item">Añadir nuevo postre al catálogo</Link></li>
                                <li><Link to="/modifyProcuct" className="dropdown-item">Gestionar catálogo</Link></li>
                                <li><Link to="/addOffer" className="dropdown-item">Añadir nueva oferta</Link></li>
                                <li><Link to="/modifyOffer" className="dropdown-item">Gestionar ofertas</Link></li>
                                <li><Link to="/modifyOrder" className="dropdown-item">Gestionar pedidos</Link></li>
                                <li><Link to="/stadistics" className="dropdown-item">Ver estadísticas</Link></li>
                              </ul>
                            </li>
                          )
                        }
                      </>
                    )
                  }
                  </ul>

                  {/* Botones de login/registro solo si no hay usuario */}
                  {
                    !usuario && 
                    (
                      <div className="BotonesMenu">
                        <button type="button" className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#IniciarSesion">Iniciar Sesión</button>
                        <button type="button" className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#Registro">Registrarse</button>
                      </div>
                    )
                  }
                  {
                    usuario && 
                    (
                      <div className="BotonesMenu">
                        <button type="button" className="buttonsvg" data-bs-toggle="modal" data-bs-target="#Perfil">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                              <g id="SVGRepo_iconCarrier">
                                <circle cx="12" cy="12" r="3" stroke="#955c97" strokeWidth="1.5"/>
                                <path d="M3.66122 10.6392C4.13377 10.9361 4.43782 11.4419 4.43782 11.9999C4.43781 12.558 4.13376 13.0638 3.66122 13.3607C3.33966 13.5627 3.13248 13.7242 2.98508 13.9163C2.66217 14.3372 2.51966 14.869 2.5889 15.3949C2.64082 15.7893 2.87379 16.1928 3.33973 16.9999C3.80568 17.8069 4.03865 18.2104 4.35426 18.4526C4.77508 18.7755 5.30694 18.918 5.83284 18.8488C6.07287 18.8172 6.31628 18.7185 6.65196 18.5411C7.14544 18.2803 7.73558 18.2699 8.21895 18.549C8.70227 18.8281 8.98827 19.3443 9.00912 19.902C9.02332 20.2815 9.05958 20.5417 9.15224 20.7654C9.35523 21.2554 9.74458 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8478 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.9021C15.0117 19.3443 15.2977 18.8281 15.7811 18.549C16.2644 18.27 16.8545 18.2804 17.3479 18.5412C17.6837 18.7186 17.9271 18.8173 18.1671 18.8489C18.693 18.9182 19.2249 18.7756 19.6457 18.4527C19.9613 18.2106 20.1943 17.807 20.6603 17C20.8677 16.6407 21.029 16.3614 21.1486 16.1272M20.3387 13.3608C19.8662 13.0639 19.5622 12.5581 19.5621 12.0001C19.5621 11.442 19.8662 10.9361 20.3387 10.6392C20.6603 10.4372 20.8674 10.2757 21.0148 10.0836C21.3377 9.66278 21.4802 9.13092 21.411 8.60502C21.3591 8.2106 21.1261 7.80708 20.6601 7.00005C20.1942 6.19301 19.9612 5.7895 19.6456 5.54732C19.2248 5.22441 18.6929 5.0819 18.167 5.15113C17.927 5.18274 17.6836 5.2814 17.3479 5.45883C16.8544 5.71964 16.2643 5.73004 15.781 5.45096C15.2977 5.1719 15.0117 4.6557 14.9909 4.09803C14.9767 3.71852 14.9404 3.45835 14.8478 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74458 2.35523 9.35523 2.74458 9.15224 3.23463C9.05958 3.45833 9.02332 3.71848 9.00912 4.09794C8.98826 4.65566 8.70225 5.17191 8.21891 5.45096C7.73557 5.73002 7.14548 5.71959 6.65205 5.4588C6.31633 5.28136 6.0729 5.18269 5.83285 5.15108C5.30695 5.08185 4.77509 5.22436 4.35427 5.54727C4.03866 5.78945 3.80569 6.19297 3.33974 7C3.13231 7.35929 2.97105 7.63859 2.85138 7.87273" stroke="#955c97" strokeWidth="1.5" strokeLinecap="round"/>
                              </g>
                          </svg>
                        </button>
                        <Link to="/miPedido" type="button" className="buttonsvg">
                          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <g strokeWidth="0" />
                            <g strokeLinecap="round" strokeLinejoin="round" />
                            <g>
                              <g fill="none" fillRule="evenodd">
                                <g transform="translate(-308 -99)" fill="#955c97">
                                  <path d="M332,107 L316,107 C315.447,107 315,107.448 315,108 C315,108.553 315.447,109 316,109 L332,109 C332.553,109 333,108.553 333,108 C333,107.448 332.553,107 332,107 Z M338,127 C338,128.099 336.914,129.012 335.817,129.012 L311.974,129.012 C310.877,129.012 309.987,128.122 309.987,127.023 L309.987,103.165 C309.987,102.066 310.902,101 312,101 L336,101 C337.098,101 338,101.902 338,103 L338,127 Z M336,99 L312,99 C309.806,99 308,100.969 308,103.165 L308,127.023 C308,129.22 309.779,131 311.974,131 L335.817,131 C338.012,131 340,129.196 340,127 L340,103 C340,100.804 338.194,99 336,99 Z M332,119 L316,119 C315.447,119 315,119.448 315,120 C315,120.553 315.447,121 316,121 L332,121 C332.553,121 333,120.553 333,120 C333,119.448 332.553,119 332,119 Z M332,113 L316,113 C315.447,113 315,113.448 315,114 C315,114.553 315.447,115 316,115 L332,115 C332.553,115 333,114.553 333,114 C333,113.448 332.553,113 332,113 Z" />
                                </g>
                              </g>
                            </g>
                          </svg>
                        </Link>
                      </div>
                    )
                  }
                </div>
              </div>
            </nav>
      </header>
    </>
  );
}