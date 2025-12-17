//Importaciones funcionales
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import {validateEditUser} from "../../../utils/formValidators";
//Importaciones diseño
import "../../../assets/CSS/main_components/Modals/Perfil.css";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";

const Perfil = () => 
{
    //Declaración de constantes
    const API_URL= process.env.REACT_APP_API_URL;
    const { usuario, setUsuario } = useContext(AuthContext);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    /**
     * Hook que actualiza los datos del formulario de edición cuando cambia el usuario.
     *
     * Cada vez que `usuario` cambia:
     * 1. Si `usuario` existe, actualiza `editData` con los datos del usuario.
     *    - Convierte la propiedad `informacion_publica` a string "true" o "false" 
     *      para que sea compatible con inputs de tipo checkbox/select en el formulario.
     * 2. Muestra en consola el usuario actual para fines de depuración.
     */
    useEffect(() => 
    {
        if (usuario) 
        {
            setEditData(
            {
                ...usuario,
                informacion_publica: usuario.informacion_publica ? "true" : "false",
            });
        }
        console.log("usuario: " + usuario)
    }, [usuario]);

    if (!usuario) return null;

    /**
     * Calcula la edad a partir de la fecha de nacimiento.
     * @param {string|Date} fechaNacimiento - Fecha de nacimiento del usuario.
     * @returns {number} Edad calculada en años.
     */
    const calcularEdad = (fechaNacimiento) => 
    {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) 
        {
            edad--;
        }
        return edad;
    };

    /**
     * Cierra la sesión del usuario.
     * Elimina la información del usuario del localStorage y actualiza el estado.
     */
    const logout = () => 
    {
        localStorage.removeItem("usuario");
        setUsuario(null);
    };

    /**
     * Inicia el modo de edición del perfil del usuario.
     * Convierte `informacion_publica` a string "true"/"false" para inputs de formulario.
     */
    const startEdit = () => 
    {
        setEditMode(true);
        setEditData(
        { 
            ...usuario,
            informacion_publica: usuario.informacion_publica ? "true" : "false",
        });
    };

    /**
     * Cancela la edición del perfil.
     * Restablece el modo de edición y limpia los datos temporales.
     */
    const cancelEdit = () => 
    {
        setEditMode(false);
        setEditData({});
    };

    /**
     * Guarda los cambios del usuario después de la edición.
     * 1. Valida los datos editados.
     * 2. Prepara FormData para enviar al backend.
     * 3. Convierte `informacion_publica` de string a 1/0.
     * 4. Actualiza la información del usuario en contexto y localStorage.
     * 5. Cancela el modo edición.
     */
    const saveEdit = () => 
    {
        const { error} = validateEditUser(editData);
        if (error) 
        {
            setAlertMessage(error);
            setAlertSeverity("error");
            return;
        }

        const formData = new FormData();

        formData.append("nombre", editData.nombre);
        formData.append("apellidos", editData.apellidos);
        formData.append("contrasena", editData.contrasena);
        formData.append("telefono", editData.telefono);
        formData.append("email", editData.email);
        formData.append("informacion_publica", editData.informacion_publica === "true" ? 1 : 0);

        if (editData.nuevaImagen) 
        {
            formData.append("Imagen", editData.nuevaImagen);
        }

        axios.put(`${API_URL}/updateUser/${usuario.id_usuario}`, formData)
        .then((res) => 
        {
            const updatedUser = 
            { 
                ...res.data.usuario,
                informacion_publica: editData.informacion_publica === "true"
            };
            setUsuario(updatedUser);
            localStorage.setItem("usuario", JSON.stringify(updatedUser));
            cancelEdit();
        })
        .catch(err => console.error(err));
    };

    /**
     * Formatea una fecha a formato DD/MM/AAAA.
     * @param {string|Date} fecha - Fecha a formatear.
     * @returns {string} Fecha formateada o "No disponible" si es inválida.
     */
    const formatearFecha = (fecha) => 
    {
        if (!fecha) return "No disponible";
        const date = new Date(fecha);
        if (isNaN(date.getTime())) return "No disponible"; 
        const dia = String(date.getDate()).padStart(2, "0");
        const mes = String(date.getMonth() + 1).padStart(2, "0"); 
        const anio = date.getFullYear();
        return `${dia}/${mes}/${anio}`;
    };

    return (
        <div className="modal fade" id="Perfil" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">Bienvenido, {usuario ? usuario.nombre : ""}</h5>
                        <button className="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div className="modal-body">

                        {/* IMAGEN */}
                        <div>
                            {!usuario.imagen || usuario.imagen === "null" ? (
                                <img src="/ProfileUserImage/DefaultImage.jpg" width="80" alt="Imagen de perfil" />
                            ) : (
                                <img src={usuario.imagen} width="80" alt="Imagen de perfil" />
                            )}

                            {editMode && (
                                <input
                                    type="file"
                                    className="form-control mt-2"
                                    onChange={(e) =>
                                        setEditData({ ...editData, nuevaImagen: e.target.files[0] })
                                    }
                                />
                            )}
                        </div>

                        {/* DATOS */}
                        <div className="data">
                            <p>
                                Nombre:
                                {editMode ? (
                                    <input
                                        className="form-control"
                                        value={editData.nombre}
                                        onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                                    />
                                ) : " " + usuario.nombre}
                            </p>

                            <p>
                                Apellidos:
                                {editMode ? (
                                    <input
                                        className="form-control"
                                        value={editData.apellidos}
                                        onChange={(e) => setEditData({ ...editData, apellidos: e.target.value })}
                                    />
                                ) : " " + usuario.apellidos}
                            </p>

                            <p>Fecha de nacimiento: {formatearFecha(usuario.fecha_nacimiento)}</p>
                            <p>Edad: {calcularEdad(usuario.fecha_nacimiento)}</p>

                            <p>
                                Contraseña:
                                {editMode ? (
                                    <div className="input-group">
                                        <input
                                            className="form-control"
                                            type={mostrarContrasena ? "text" : "password"}
                                            value={editData.contrasena}
                                            onChange={(e) => setEditData({ ...editData, contrasena: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setMostrarContrasena(!mostrarContrasena)}
                                        >
                                            {mostrarContrasena ? "Ocultar" : "Mostrar"}
                                        </button>
                                    </div>
                                ) : " " + usuario.contrasena}
                            </p>

                            <p>
                                Teléfono:
                                {editMode ? (
                                    <input
                                        className="form-control"
                                        value={editData.telefono}
                                        onChange={(e) => setEditData({ ...editData, telefono: e.target.value })}
                                    />
                                ) : usuario.telefono}
                            </p>

                            <p>
                                Email:
                                {editMode ? (
                                    <input
                                        className="form-control"
                                        value={editData.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    />
                                ) : " " + usuario.email}
                            </p>

                            <p>
                                Información pública:
                                {editMode ? (
                                    <select
                                        className="form-control"
                                        value={editData.informacion_publica}
                                        onChange={(e) =>
                                            setEditData({ ...editData, informacion_publica: e.target.value })
                                        }
                                    >
                                        <option value="true">Sí</option>
                                        <option value="false">No</option>
                                    </select>
                                ) : usuario.informacion_publica ? " Sí" : " No"}
                            </p>
                        </div>
                        {alertMessage && (
                            <Alert
                                severity={alertSeverity}
                                onClose={() => setAlertMessage("")}
                                style={{ marginBottom: "10px" }}
                            >
                                {alertMessage}
                            </Alert>
                        )}

                        {/* BOTONES */}
                        <div className="d-flex gap-2 mt-3">
                            {editMode ? (
                                <>
                                    <button className="btn btn-success" onClick={saveEdit}>Guardar</button>
                                    <button className="btn btn-secondary" onClick={cancelEdit}>Cancelar</button>
                                </>
                            ) : (
                                <button className="btn btn-primary" onClick={startEdit}>Modificar</button>
                            )}
                        </div>
                        <Link to="/inicio" type="button" className="align-self-center btn btn-danger mt-3 cierre" data-bs-dismiss="modal" onClick={logout}>
                            Cerrar sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
