//Importaciones funcionales
import { useState,useEffect } from "react";
import axios from "axios";
import { validateRegistro } from "../../../utils/formValidators";
//Importaciones diseño
import "../../../assets/CSS/main_components/Modals/RegistroForm.css";
import Alert from "@mui/material/Alert";

const RegistroFrom = () => 
{
    //Declaración de constantes
    const API_URL= process.env.REACT_APP_API_URL;
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [telefono, setTelefono] = useState("");
    const [fecha_nacimiento, setFechaNacimiento] = useState("");
    const [imagen, setImagen] = useState(null);
    const [email, setEmail] = useState("");
    const [contrasena, setPassword] = useState("");
    const [Confirmarcontrasena, setConfirmarPassword] = useState("");
    const [ informacion_publica, setInformacion_publica ] = useState(false);
    const fecha_registro = new Date().toISOString().split("T")[0];
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false);
    const resetForm = () => 
    {
        setNombre("");
        setApellidos("");
        setTelefono("");
        setFechaNacimiento("");
        setImagen(null);
        setEmail("");
        setPassword("");
        setConfirmarPassword("");
        setInformacion_publica(false);
    }
    /**
     * Hook que controla la duración de los mensajes de alerta.
     *
     * Cada vez que `alertMessage` cambia y tiene un valor,
     * se inicia un temporizador de 5 segundos (5000 ms) para limpiar
     * el mensaje automáticamente llamando a `setAlertMessage("")`.
     *
     * Devuelve una función de limpieza para cancelar el temporizador
     * si el efecto se vuelve a ejecutar o si el componente se desmonta,
     * evitando fugas de memoria.
     */
    useEffect(() => 
    {
        if (alertMessage) 
        {
            const timer = setTimeout(() => setAlertMessage(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    /**
     * Función que maneja el registro de un nuevo usuario.
     *
     * 1. Previene el comportamiento por defecto del formulario.
     * 2. Valida los campos del registro usando `validateRegistro`.
     *    - Si hay error, muestra una alerta de advertencia y detiene la ejecución.
     * 3. Prepara los datos del formulario (`FormData`) incluyendo:
     *    - Nombre, apellidos, teléfono, fecha de nacimiento, email, contraseña, imagen y configuración de privacidad.
     * 4. Envía los datos al backend mediante una petición POST a "/addUser".
     * 5. Maneja la respuesta:
     *    - Si el registro es exitoso, muestra una alerta de éxito y resetea el formulario.
     *    - Si hay error, muestra una alerta de error y registra el error en consola.
     *
     * @param {Event} e - Evento del formulario.
     */
    const RegisterUser = (e) => 
    {
        e.preventDefault();

        const error = validateRegistro(
        {
            nombre,
            apellidos,
            email,
            telefono,
            contrasena,
            confirmarContrasena: Confirmarcontrasena,
            fecha_nacimiento,
        });

        if (error) 
        {
            setAlertMessage(error);
            setAlertSeverity("warning");
            return;
        }


        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("apellidos", apellidos);
        formData.append("telefono", telefono);
        formData.append("fechaNacimiento", fecha_nacimiento);
        formData.append("imagen", imagen);
        formData.append("email", email);
        formData.append("password", contrasena);
        formData.append("informacion_publica", informacion_publica ? 1 : 0);
        formData.append("fecha_registro", fecha_registro);
        console.log(imagen);

        axios.post(`${API_URL}/addUser`, formData)
        .then((response) => 
        {
            setAlertMessage("Usuario registrado correctamente");
            setAlertSeverity("success");
            resetForm();
        })
        .catch((error) => 
        {
            console.error("Error al registrar el usuario:", error);
            setAlertMessage("Error al registrar el usuario");
            setAlertSeverity("error");
            return;
        });
    };
    return (
        <>
            <div className="modal fade" id="Registro" tabIndex="-1" aria-labelledby="RegistroFrom" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="IniciarSesionLabel">Registrase en SweetCulture</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div className="modal-body">
                    <form onSubmit={RegisterUser}  encType="multipart/form-data">
                        <div className="mb-3">
                            <label htmlFor="Nombre" className="form-label">Nombre</label>
                            <input type="text" className="form-control" id="Nombre" placeholder="Paco" value={nombre} required 
                                onChange={(event)=>{ setNombre(event.target.value); }}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Apellido" className="form-label">Apellido</label>
                            <input type="text" className="form-control" id="Apellido" placeholder="Pérez" value={apellidos} required
                                onChange={(event)=>{ setApellidos(event.target.value); }}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Telefono" className="form-label">Teléfono</label>
                            <input type="tel" className="form-control" id="Telefono" placeholder="600123456" value={telefono} 
                                onChange={(event)=>{ setTelefono(event.target.value); }}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="FechaNacimiento" className="form-label">Fecha de Nacimiento</label>
                            <input type="date" className="form-control" id="FechaNacimiento" value={fecha_nacimiento} required
                                onChange={(event)=>{ setFechaNacimiento(event.target.value); }}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Imagen" className="form-label">Imagen de Perfil</label>
                            <input type="file" className="form-control" id="Imagen" name="imagen" accept="image/*"
                                onChange={(event)=>{ setImagen(event.target.files[0]); }}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">Correo Electrónico</label>
                            <input type="email" className="form-control" id="Email" placeholder="micorreo@gmail.com" value={email} required
                                onChange={(event)=>{ setEmail(event.target.value); }}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Password" className="form-label">Contraseña</label>
                            <div className="input-group">
                                <input 
                                    type={mostrarContrasena ? "text" : "password"} 
                                    className="form-control" 
                                    id="Password" 
                                    placeholder="********" 
                                    value={contrasena} 
                                    required
                                    onChange={(event)=> setPassword(event.target.value)}
                                />
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary"
                                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                                >
                                    {mostrarContrasena ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="ConfirmarPassword" className="form-label">Confirmar Contraseña</label>
                            <div className="input-group">
                                <input 
                                    type={mostrarConfirmarContrasena ? "text" : "password"} 
                                    className="form-control" 
                                    id="ConfirmarPassword" 
                                    placeholder="********" 
                                    value={Confirmarcontrasena} 
                                    required
                                    onChange={(event)=> setConfirmarPassword(event.target.value)}
                                />
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary"
                                    onClick={() => setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)}
                                >
                                    {mostrarConfirmarContrasena ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                        </div>
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="checkbox" id="Informacion_publica" checked={informacion_publica}
                                onChange={(event)=>{ setInformacion_publica(event.target.checked); }}/>
                            <label className="form-check-label" htmlFor="Informacion_publica"></label>
                                Hacer mi información pública
                        </div>
                        {alertMessage && (
                            <Alert
                            severity={alertSeverity}
                            onClose={() => setAlertMessage("")} // permite cerrar la alerta
                            style={{ marginTop: "10px" }}
                            >
                            {alertMessage}
                            </Alert>
                        )}
                        <div className="d-flex justify-content-end mt-4">
                            <button type="submit" className="btn btn-primary me-2">
                                Registrarse en SweetCulture
                            </button>
                            <button type="reset" className="btn btn-primary me-2" onClick={resetForm}>
                                Reiniciar formulario
                            </button>
                        </div>
                    </form>
                    
                </div>
                </div>
            </div>
            </div>
        </>
    );
}

export default RegistroFrom;