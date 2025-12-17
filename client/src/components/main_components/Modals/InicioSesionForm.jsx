//Importaciones funcionales
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../AuthContext';
import { validateInicioSesion } from "../../../utils/formValidators";

//Importaciones diseño
import "../../../assets/CSS/main_components/Modals/InicioSesionForm.css";
import Alert from "@mui/material/Alert";

const InicioSesionForm = () => 
{
    //Declaración de constantes
    const API_URL= process.env.API_URL;
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const { setUsuario } = useContext(AuthContext);
    const resetForm = () => 
    {
        setEmail("");
        setContrasena("");
    }

    /**
     * Hook que controla la duración de los mensajes de alerta.
     *
     * Cada vez que `alertMessage` cambia y tiene un valor,
     * se inicia un temporizador de 5 segundos (5000 ms) para limpiar
     * el mensaje automáticamente llamando a `setAlertMessage("")`.
     *
     * Se devuelve una función de limpieza para cancelar el temporizador
     * si el componente se desmonta o si `alertMessage` cambia antes de que
     * termine el tiempo, evitando fugas de memoria.
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
     * Función que maneja el inicio de sesión del usuario.
     *
     * 1. Previene el comportamiento por defecto del formulario.
     * 2. Valida los campos `email` y `contrasena` usando `validateInicioSesion`.
     *    - Si hay error, muestra una alerta y detiene la ejecución.
     * 3. Envía una petición POST al backend con los datos de login.
     * 4. Maneja la respuesta:
     *    - Si el usuario no existe, muestra alerta de error.
     *    - Si el login es correcto, muestra alerta de éxito,
     *      guarda el usuario en localStorage y actualiza el estado `usuario`.
     * 5. Maneja errores de la petición mostrando alerta de error.
     *
     * @param {Event} e - Evento del formulario.
     */
    const LoadingUser = (e) => 
    {
        e.preventDefault();
        const error = validateInicioSesion({ email, contrasena });
        
        if (error) 
        {
            setAlertMessage(error);
            setAlertSeverity("warning");
            return;
        }

        const DatosLogin = { email, contrasena };

        axios.post(`${API_URL}/searchUser`, DatosLogin)
        .then((response) => 
        {
            const user = response.data.usuario;
            if (!user) 
                {
                setAlertMessage("Usuario o contraseña incorrectos");
                setAlertSeverity("error");
                return;
            }
            setAlertMessage("Usuario logueado correctamente");
            setAlertSeverity("success");
            localStorage.setItem("usuario", JSON.stringify(user));
            setUsuario(user);
            resetForm();
        })
        .catch(() => 
        {
            setAlertMessage("Usuario o contraseña incorrectos");
            setAlertSeverity("error");
        });
    }

    return (
        <>
            <div className="modal fade" id="IniciarSesion" tabIndex="-1" aria-labelledby="IniciarSesionLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="IniciarSesionLabel">Iniciar Sesión</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={LoadingUser}>
                            <div className="mb-3">
                                <label htmlFor="Email" className="form-label">Correo Electrónico</label>
                                <input type="email" className="form-control" id="EmailLoading" placeholder="micorreo@gmail.com" value={email} required
                                    onChange={(event)=> setEmail(event.target.value)}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Password" className="form-label">Contraseña</label>
                                <div className="input-group">
                                    <input 
                                        type={mostrarContrasena ? "text" : "password"} 
                                        className="form-control" 
                                        id="PasswordLoading" 
                                        placeholder="********" 
                                        value={contrasena} 
                                        required
                                        onChange={(event)=> setContrasena(event.target.value)}
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
                            {alertMessage && (
                                <Alert
                                    severity={alertSeverity}
                                    onClose={() => setAlertMessage("")}
                                    style={{ marginTop: "10px" }}
                                >
                                    {alertMessage}
                                </Alert>
                            )}
                            <button type="submit" className="btn btn-primary">Entrar</button>
                        </form>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InicioSesionForm;
