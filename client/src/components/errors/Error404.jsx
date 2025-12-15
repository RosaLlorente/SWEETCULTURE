//Importaciones funcionales
import { Link } from 'react-router-dom';
//Importaciones de diseño
import "../../assets/CSS/errors/Error404.css";

export function Error404()
{
    return(
        <>
             <section id="Error404" className="vh-100 position-relative">
                <div
                    className="Contenido position-absolute top-50 start-50 translate-middle text-center text-white"
                    tabIndex="0">

                    <div className="MensajeError404">
                        <h3>!Oops! Parece que te has perdido al buscar algún dulce</h3>
                        <p>Nuestro minino te ayudara a regrasar al inicio</p>
                        <button to="/inicio" type="button" className="btn btn-secondary">
                        <Link to="/inicio">Dejar que nuestro minino te ayude</Link></button>
                    </div>
                </div>

                <video
                    className="video-bg position-absolute top-0 start-0 w-100 h-100"
                    muted
                    autoPlay
                    loop
                >
                    <source src="/Video/Error404.mp4" type="video/mp4" />
                    Tu navegador no soporta el video.
                </video>
            </section>
        </>
    );
}