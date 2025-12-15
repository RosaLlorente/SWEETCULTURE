import { Link } from 'react-router-dom';
import "../../assets/CSS/main_components/LandingPage.css";


export function LandingPage() 
{
  return (
    <>
      <main id="Landing">
        <div
          className="Contenido position-absolute top-50 start-50 translate-middle text-center text-white"
          tabIndex="0"
        >
          <span><Link to="/inicio" type="button" className="btn btn-secondary">SWEET CULTURE</Link></span>
        </div>

        <video
          className="video-bg position-absolute top-0 start-0 w-100 h-100"
          muted
          autoPlay
          loop
        >
          <source src="/Video/VideoLanding.mp4" type="video/mp4" />
          Tu navegador no soporta el video.
        </video>
      </main>
    </>
  )
}