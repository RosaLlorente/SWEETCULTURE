//Importaciones funcionales
import { useState, useContext,useEffect  } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../main_components/AuthContext";
import { validateServiceRating } from "../../utils/formValidators";
import axios from "axios";

//Importaciones diseño
import Alert from "@mui/material/Alert";
import "../../assets/CSS/SectionUs/SectionUs.css";

export function SectionUs() 
{
    //Declaración de constantes
    const { usuario } = useContext(AuthContext);
    const id_usuario = usuario ? usuario.id_usuario : null;
    const [comentario, setComentario] = useState("");
    const [hover, setHover] = useState(0);
    const [puntuacion, setPuntuacion] = useState(0);
    const [valoraciones, setValoraciones] = useState([]);
    const fecha_valoracion = new Date().toISOString().split("T")[0];
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");

    /**
     * Resetea el formulario de valoración del servicio.
     * Limpia el comentario y restablece la puntuación a 0.
     */
    const resetForm = () => 
    {
        setComentario("");
        setPuntuacion(0);
    };

    /**
     * Registra una valoración del servicio enviada por el usuario.
     *
     * 1. Previene el comportamiento por defecto del formulario.
     * 2. Valida los datos usando `validateServiceRating`.
     *    - Si hay error, muestra alerta de advertencia y detiene la ejecución.
     * 3. Prepara los datos en FormData para enviar al backend:
     *    - id_usuario, comentario, puntuacion, fecha_valoracion.
     * 4. Realiza la petición POST a "/addRating".
     * 5. Maneja la respuesta:
     *    - Éxito: muestra alerta de éxito y resetea el formulario.
     *    - Error: muestra alerta de error.
     *
     * @param {Event} e - Evento del formulario.
     */
    const registerRating = (e) => 
    {
        e.preventDefault();
        const error = validateServiceRating({ comentario, puntuacion, usuario });

        if (error) 
        {
            setAlertMessage(error);
            setAlertSeverity("warning");
            return;
        }

        const formData = new FormData();
        formData.append("id_usuario", id_usuario);
        formData.append("comentario", comentario);
        formData.append("puntuacion", puntuacion);
        formData.append("fecha_valoracion", fecha_valoracion);

        axios
        .post("http://localhost:3000/addRating", formData)
        .then(() => {
            setAlertMessage("Se ha podido valorar el servicio correctamente");
            setAlertSeverity("success");
            resetForm();
        })
        .catch(() => {
            setAlertMessage("No se ha podido valorar el servicio");
            setAlertSeverity("error");
        });
    };

    /**
     * Hook que carga todas las valoraciones de servicios al montar el componente.
     * Actualiza el estado `valoraciones` con los datos obtenidos del backend.
     */
    useEffect(() => {
        axios.get("http://localhost:3000/getRatingsServices")
            .then(res => {
                setValoraciones(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <>
            <section className="QuienesSomos-section">
                <div className="TextoQuienesSomos">
                    <h2>¿Quiénes somos?</h2>
                    <p>
                        SweetCulture es una pastelería especializada en dulces culturales que nace con la misión de acercar sabores de 
                        distintas partes del mundo a través de una experiencia visual y gastronómica única. Combinamos tradición, 
                        creatividad y una identidad multicultural para ofrecer productos artesanales que celebran la diversidad.
                    </p>
                    <p>
                        Somos un equipo apasionado por la repostería y el diseño, comprometido con crear un espacio digital accesible, 
                        organizado y agradable, donde cada usuario pueda explorar nuestros productos y realizar sus reservas de forma 
                        sencilla. Cada pedido se prepara con dedicación en nuestra tienda física, manteniendo un trato cercano y un proceso 
                        cuidado hasta el momento de la entrega.
                    </p>
                    <p>
                        En SweetCulture creemos que la repostería es una forma de conectar culturas, emociones e historias. 
                        Por eso trabajamos cada día para ofrecer dulces que cruzan fronteras y transmiten la esencia de diferentes 
                        tradiciones del mundo.
                    </p>
                </div>
                <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                        <img src="Image/Carrousel1.jpg" className="d-block w-100" alt="..."/>
                        </div>
                        <div className="carousel-item">
                        <img src="Image/Carrousel2.jpg" className="d-block w-100" alt="..."/>
                        </div>
                        <div className="carousel-item">
                        <img src="Image/Carrousel3.jpg" className="d-block w-100" alt="..."/>
                        </div>
                        <div className="carousel-item">
                        <img src="Image/Carrousel4.jpg" className="d-block w-100" alt="..."/>
                        </div>
                        <div className="carousel-item">
                        <img src="Image/Carrousel5.jpg" className="d-block w-100" alt="..."/>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </section>
            <section className="BannerCalidad-section">
                <div className="ImageLogo">
                    <img src="/Image/LogoSWEETCULTURE.png" alt="Logo SweetCulture" />
                </div>
                <div className="BannerCalidad-text">
                    <h2>¿Por qué nos importa la calidad?</h2>
                    <p>
                        En SweetCulture creemos que la calidad es el ingrediente esencial que da sentido a todo lo que hacemos. 
                        No solo determina el sabor y la apariencia de nuestros productos, sino también la experiencia, la confianza y la emoción que 
                        queremos transmitir a cada persona que nos elige.
                    </p>
                    <p>
                        La calidad nos importa porque cada dulce que elaboramos representa una cultura, una tradición y una historia. 
                        Por eso seleccionamos cuidadosamente nuestros ingredientes, trabajamos con técnicas artesanales y cuidamos cada 
                        detalle del proceso, desde la receta hasta la presentación final. Queremos que cada bocado sea una experiencia 
                        auténtica, equilibrada y memorable.
                    </p>
                    <p>
                        Además, la calidad está presente en nuestra manera de trabajar: en cómo organizamos los pedidos, en cómo presentamos
                         la marca y en la atención cercana que brindamos. Nuestro objetivo es que los clientes se sientan acompañados, 
                         seguros y satisfechos desde el primer momento, tanto al navegar por la web como al recoger su pedido en la tienda.
                    </p>
                    <p>
                        Para nosotros, la calidad no es solo un estándar, sino una forma de respeto hacia las culturas que inspiran nuestros
                         dulces y hacia cada persona que confía en SweetCulture. Porque ofrecer lo mejor es la manera más dulce de honrar 
                         lo que hacemos.
                    </p>
                </div>
            </section>
            <section className="NuestrasInstalaciones-section">
                <div>
                    <h2>Nuestras instalaciones</h2>
                    <p>Nuestras instalaciones están diseñadas para combinar funcionalidad, higiene y un ambiente acogedor que refleje la 
                        esencia de SweetCulture. Contamos con un obrador equipado con herramientas profesionales que nos permiten trabajar 
                        de forma precisa y artesanal, garantizando la frescura y la calidad de cada dulce que elaboramos. En la zona de 
                        atención al cliente, mantenemos un espacio cálido y organizado donde los visitantes pueden recoger sus pedidos 
                        cómodamente, siempre rodeados de una estética moderna, limpia y coherente con la identidad visual de la marca. 
                        Aquí, cada detalle —desde la distribución hasta la decoración— está pensado para ofrecer una experiencia agradable, 
                        cercana y alineada con nuestros valores.</p>
                </div>
                <div>
                    <img src="Image/local.jpg" alt="Imagen de nuestras instalaciones"/>
                </div>
            </section>
            <section className="NuestroEquipo-section">
                <div className="NuestroEquipo-text">
                    <h2>Nuestro equipo</h2>
                    <p>
                        En SweetCulture contamos con un equipo apasionado, creativo y comprometido con la excelencia en cada detalle. 
                        Desde los maestros pasteleros que elaboran cada dulce con dedicación artesanal, hasta el personal de atención al 
                        cliente que garantiza una experiencia cercana y personalizada, cada miembro de nuestro equipo comparte la visión 
                        de transmitir multiculturalidad, calidad y dulzura en todo lo que hacemos.
                    </p>
                    <p>
                        Trabajamos de manera colaborativa, combinando talento, innovación y respeto por las tradiciones de cada receta, 
                        para que cada producto y cada interacción reflejen nuestros valores: cuidado, armonía y cercanía. En SweetCulture, 
                        nuestro equipo no solo crea dulces, sino también experiencias que cruzan fronteras y conectan culturas.
                    </p>
                </div>
                <div className="Equipo-row">
                    <div className="Equipo-card">
                        <div className="Equipo-img-container">
                            <img src="Squad/Fundadora.jpg" alt="Foto de Laura Martínez"/>
                        </div>
                        <h3>Laura Martínez</h3>
                        <p>Fundadora y Chef Pastelera</p>
                    </div>
                    <div className="Equipo-card">
                        <div className="Equipo-img-container">
                            <img src="Squad/Director.jpg" alt="Foto de Daniel Gómez"/>
                        </div>
                        <h3>Daniel Gómez</h3>
                        <p>Director de Marketing y Comunicación</p>
                    </div>
                    <div className="Equipo-card">
                        <div className="Equipo-img-container">
                            <img src="Squad/Disenadora.jpg" alt="Foto de Isabel Torres"/>
                        </div>
                        <h3>Isabel Torres</h3>
                        <p>Diseñadora Gráfica y Responsable de Identidad Visual</p>
                    </div>
                    <div className="Equipo-card">
                        <div className="Equipo-img-container">
                            <img src="Squad/AtencionCliente.jpg" alt="Foto de Carlos Rivera"/>
                        </div>
                        <h3>Carlos Rivera</h3>
                        <p>Encargado de Atención al Cliente y Reservas</p>
                    </div>
                    <div className="Equipo-card">
                        <div className="Equipo-img-container">
                            <img src="Squad/Coordinadora.jpg" alt="Foto de Marina López"/>
                        </div>
                        <h3>Marina López</h3>
                        <p>Coordinadora de Producción y Control de Calidad</p>
                    </div>
                    <div className="Equipo-card">
                        <div className="Equipo-img-container">
                            <img src="Squad/Desarrolladora.jpeg" alt="Foto de Rosa María Llorente"/>
                        </div>
                        <h3>Rosa María Llorente</h3>
                        <p>Desarrolladora Web, Diseñadora de Interfaz y Administradora de Base de Datos</p>
                    </div>
                </div>
            </section>
            <section className="Ubicacion-section">
                <div className="Ubicacion-mapa">
                    <iframe
                        title="Mapa SweetCulture"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3130.0000000000005!2d-3.59856!3d37.17605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd71f8fa05555555%3A0x123456789abcdef!2sC.%20Elvira%2C%208%2C%2018002%20Granada!5e0!3m2!1ses!2ses!4v0000000000000!5m2!1ses!2ses"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                <div className="Ubicacion-texto">
                    <h2>Nuestra ubicación</h2>
                    <p>
                        SweetCulture está situado en pleno casco histórico de Granada (Andalucía, España) — 
                        una zona elegante, cargada de encanto, llena de tiendas artesanales, cafeterías con carácter y rincones con 
                        historia. Nuestra dirección se encuentra cerca de calles peatonales y espacios culturales, en un entorno accesible 
                        tanto a pie como en transporte público, ideal para quienes buscan una experiencia tranquila, auténtica y 
                        enriquecedora. Este contexto no solo potencia la visibilidad de nuestra pastelería, sino también refuerza nuestra 
                        filosofía de ofrecer productos artesanales en un entorno cercano y lleno de tradición.
                    </p>
                </div>
            </section>

            <section className="Valoraciones-section">
                <div className="Valoraciones-container">
                    <h2>Valoraciones de los clientes</h2>
                    <div
                        id="ratingsCarousel"
                        className="carousel slide"
                        data-bs-ride="carousel"
                        data-bs-interval="5000"
                    >
                        <div className="carousel-inner">

                            {valoraciones.map((val, index) => (
                                <div
                                    key={`${val.id_valoracion}-${index}`}
                                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                                >
                                    <div className="d-flex justify-content-center">
                                        <div className="card valoracion-card text-center p-4">
                                            
                                            <div className="valoracion-img-container">
                                                <img
                                                    src={val.imagen? "ProfileUserImage/" + val.imagen : "ProfileUserImage/DefaultImage.jpg"}
                                                    alt={val.nombre}
                                                    className="valoracion-img"
                                                />
                                            </div>

                                            <h5 className="valoracion-nombre">{val.nombre}</h5>

                                            <div className="valoracion-stars">
                                                {"★".repeat(val.puntuacion)}
                                                {"☆".repeat(5 - val.puntuacion)}
                                            </div>

                                            <p className="valoracion-comentario fst-italic">
                                                “{val.comentario}”
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Controles */}
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#ratingsCarousel"
                            data-bs-slide="prev"
                        >
                            <span className="carousel-control-prev-icon"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>

                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#ratingsCarousel"
                            data-bs-slide="next"
                        >
                            <span className="carousel-control-next-icon"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>

                    <div className="mt-3 text-center">
                        <Link to="/allRatingsServices" className="btn btn-outline-primary">
                            Ver todas las valoraciones
                        </Link>
                    </div>
                </div>
            </section>

            <section className="FormularioValoracionServicio">
                <div className="Valoracion-container">
                    <h2>Deja tu valoración</h2>

                    {alertMessage && (
                        <Alert
                            severity={alertSeverity}
                            onClose={() => setAlertMessage("")}
                            className="Valoracion-alert"
                        >
                            {alertMessage}
                        </Alert>
                    )}

                    {usuario ? (
                        <form onSubmit={registerRating} className="Valoracion-form">
                            <p className="Valoracion-text">¡Califica nuestro servicio!</p>

                            <div className="mb-3">
                                <label htmlFor="comentario" className="form-label">
                                    Comentario
                                </label>
                                <textarea
                                    className="form-controlValoracionS Valoracion-textarea"
                                    id="comentario"
                                    rows="4"
                                    placeholder="Ej: El servicio me pareció..."
                                    value={comentario}
                                    onChange={(e) => setComentario(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="Valoracion-stars-container">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        onClick={() => setPuntuacion(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className={`Valoracion-star ${star <= (hover || puntuacion) ? "active" : ""}`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>

                            <button type="submit" className="btn Valoracion-btn">
                                Enviar valoración
                            </button>
                        </form>
                    ) : (
                        <p className="Valoracion-login-msg">Inicia sesión para dejar tu valoración sobre nuestro servicio.</p>
                    )}
                </div>
            </section>
        </>
    );
}
