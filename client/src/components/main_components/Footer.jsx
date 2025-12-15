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
                <svg
                  viewBox="0 0 48 48"
                  fill="#4460A0"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Facebook-color</title>
                  <desc>Created with Sketch.</desc>
                  <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Color-" transform="translate(-200 -160)" fill="#4460A0">
                      <path
                        d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z"
                        id="Facebook"
                      ></path>
                    </g>
                  </g>
                </svg>
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#paint0_radial_87_7153)"></rect>
                    <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#paint1_radial_87_7153)"></rect>
                    <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#paint2_radial_87_7153)"></rect>
                    <path d="M23 10.5C23 11.3284 22.3284 12 21.5 12C20.6716 12 20 11.3284 20 10.5C20 9.67157 20.6716 9 21.5 9C22.3284 9 23 9.67157 23 10.5Z" fill="white"></path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21ZM16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19Z" fill="white"></path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M6 15.6C6 12.2397 6 10.5595 6.65396 9.27606C7.2292 8.14708 8.14708 7.2292 9.27606 6.65396C10.5595 6 12.2397 6 15.6 6H16.4C19.7603 6 21.4405 6 22.7239 6.65396C23.8529 7.2292 24.7708 8.14708 25.346 9.27606C26 10.5595 26 12.2397 26 15.6V16.4C26 19.7603 26 21.4405 25.346 22.7239C24.7708 23.8529 23.8529 24.7708 22.7239 25.346C21.4405 26 19.7603 26 16.4 26H15.6C12.2397 26 10.5595 26 9.27606 25.346C8.14708 24.7708 7.2292 23.8529 6.65396 22.7239C6 21.4405 6 19.7603 6 16.4V15.6ZM15.6 8H16.4C18.1132 8 19.2777 8.00156 20.1779 8.0751C21.0548 8.14674 21.5032 8.27659 21.816 8.43597C22.5686 8.81947 23.1805 9.43139 23.564 10.184C23.7234 10.4968 23.8533 10.9452 23.9249 11.8221C23.9984 12.7223 24 13.8868 24 15.6V16.4C24 18.1132 23.9984 19.2777 23.9249 20.1779C23.8533 21.0548 23.7234 21.5032 23.564 21.816C23.1805 22.5686 22.5686 23.1805 21.816 23.564C21.5032 23.7234 21.0548 23.8533 20.1779 23.9249C19.2777 23.9984 18.1132 24 16.4 24H15.6C13.8868 24 12.7223 23.9984 11.8221 23.9249C10.9452 23.8533 10.4968 23.7234 10.184 23.564C9.43139 23.1805 8.81947 22.5686 8.43597 21.816C8.27659 21.5032 8.14674 21.0548 8.0751 20.1779C8.00156 19.2777 8 18.1132 8 16.4V15.6C8 13.8868 8.00156 12.7223 8.0751 11.8221C8.14674 10.9452 8.27659 10.4968 8.43597 10.184C8.81947 9.43139 9.43139 8.81947 10.184 8.43597C10.4968 8.27659 10.9452 8.14674 11.8221 8.0751C12.7223 8.00156 13.8868 8 15.6 8Z" fill="white"></path>
                    <defs>
                      <radialGradient id="paint0_radial_87_7153" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 23) rotate(-55.3758) scale(25.5196)">
                        <stop stopColor="#B13589"></stop>
                        <stop offset="0.79309" stopColor="#C62F94"></stop>
                        <stop offset="1" stopColor="#8A3AC8"></stop>
                      </radialGradient>
                      <radialGradient id="paint1_radial_87_7153" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11 31) rotate(-65.1363) scale(22.5942)">
                        <stop stopColor="#E0E8B7"></stop>
                        <stop offset="0.444662" stopColor="#FB8A2E"></stop>
                        <stop offset="0.71474" stopColor="#E2425C"></stop>
                        <stop offset="1" stopColor="#E2425C" stopOpacity="0"></stop>
                      </radialGradient>
                      <radialGradient id="paint2_radial_87_7153" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.500002 3) rotate(-8.1301) scale(38.8909 8.31836)">
                        <stop offset="0.156701" stopColor="#406ADC"></stop>
                        <stop offset="0.467799" stopColor="#6A45BE"></stop>
                        <stop offset="1" stopColor="#6A45BE" stopOpacity="0"></stop>
                      </radialGradient>
                    </defs>
                  </g>
                </svg>
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                <svg
                viewBox="0 -7 48 48"
                fill="#CE1312"
                xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Youtube-color</title>
                    <desc>Created with Sketch.</desc>
                    <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g id="Color-" transform="translate(-200 -368)" fill="#CE1312">
                        <path
                          d="M219.044,391.269916 L219.0425,377.687742 L232.0115,384.502244 L219.044,391.269916 Z M247.52,375.334163 C247.52,375.334163 247.0505,372.003199 245.612,370.536366 C243.7865,368.610299 241.7405,368.601235 240.803,368.489448 C234.086,368 224.0105,368 224.0105,368 L223.9895,368 C223.9895,368 213.914,368 207.197,368.489448 C206.258,368.601235 204.2135,368.610299 202.3865,370.536366 C200.948,372.003199 200.48,375.334163 200.48,375.334163 C200.48,375.334163 200,379.246723 200,383.157773 L200,386.82561 C200,390.73817 200.48,394.64922 200.48,394.64922 C200.48,394.64922 200.948,397.980184 202.3865,399.447016 C204.2135,401.373084 206.612,401.312658 207.68,401.513574 C211.52,401.885191 224,402 224,402 C224,402 234.086,401.984894 240.803,401.495446 C241.7405,401.382148 243.7865,401.373084 245.612,399.447016 C247.0505,397.980184 247.52,394.64922 247.52,394.64922 C247.52,394.64922 248,390.73817 248,386.82561 L248,383.157773 C248,379.246723 247.52,375.334163 247.52,375.334163 L247.52,375.334163 Z"
                          id="Youtube"
                        ></path>
                      </g>
                    </g>
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
