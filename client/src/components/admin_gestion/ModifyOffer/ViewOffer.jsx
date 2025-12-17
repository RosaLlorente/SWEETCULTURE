//Importaciones funcionales
import { useState, useEffect } from "react";
import axios from "axios";
//Importaciones de utils
import {validateEditOffer} from "../../../utils/formValidators";
//Importaciones diseño
import "../../../assets/CSS/admin_gestion/ModifyOffers/ViewOffers.css";
import Alert from "@mui/material/Alert";

const ViewOffer = ({ofertas}) => 
{
    //Declaración de constantes
    const API_URL= process.env.API_URL;
    const [ListaOfertas, setListaOfertas] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({});
    const [SelectedOffers, setSelectedOffers] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");
    const [postres, setPostres] = useState([]);

    /**
     * Hook que se ejecuta al montar el componente.
     * Trae todos los productos (postres) desde el backend.
     */
    useEffect(() => 
    {
        axios.get(`${API_URL}/getProducts`)
        .then((res) => setPostres(res.data))
        .catch((err) => console.error(err));
    }, []);


    /**
     * Obtiene todas las ofertas desde el backend y actualiza `listaOfertas`.
     * En caso de error, muestra un mensaje de alerta.
     */
    const GetOffers = () => 
    {
        axios.get(`${API_URL}/GetOffers`)
        .then((response) => setListaOfertas(response.data))
        .catch(err => {
            setAlertMessage("No se ha podido mostrar las ofertas");
            setAlertSeverity("error");
        });
    };

    /**
     * Hook que sincroniza `listaOfertas` con la prop `ofertas`.
     * Si no hay ofertas, llama a `GetOffers()` para traerlas.
     */
    useEffect(() => 
    {
        if (ofertas && ofertas.length > 0) 
        {
            setListaOfertas(ofertas);
        } 
        else 
        {
            GetOffers();
        }
    }, [ofertas]);

    /**
     * Inicia el modo edición de una oferta.
     * Convierte `ser_visible` a string para el formulario de edición.
     *
     * @param {number} index - Índice de la oferta en la lista.
     * @param {object} offer - Objeto de la oferta a editar.
     */
    const startEdit = (index, offer) => 
    {
        setEditIndex(index);
        setEditData({
                ...offer,
                ser_visible: offer.ser_visible ? "true" : "false"
            });
    };  

    
    /**
     * Cancela la edición de una oferta y limpia los datos del formulario.
     */
    const cancelEdit = () => 
    {
        setEditIndex(null);
        setEditData({});
    };

    /**
     * Guarda los cambios de una oferta editada.
     * Valida los datos y realiza un PUT al backend.
     *
     * @param {number} id_oferta - ID de la oferta a actualizar.
     */
    const saveEdit = (id_oferta) => 
    {
        const formData = new FormData();

        formData.append("nombre", editData.nombre);
        formData.append("tipo", editData.tipo);
        formData.append("valor", editData.valor);
        formData.append("id_postre", editData.id_postre);
        formData.append("fecha_inicio", editData.fecha_inicio);
        formData.append("fecha_fin", editData.fecha_fin);
        formData.append("ser_visible", editData.ser_visible === "true" ? 1 : 0);

        const { error } = validateEditOffer(editData);
        if (error) 
        {
            setAlertMessage(error);
            setAlertSeverity("warning");
            return;
        }

        axios.put(`${API_URL}/updateOffer/${id_oferta}`, formData,)
        .then(() => {
            setAlertMessage("Oferta modificada correctamente");
            setAlertSeverity("success");
            GetOffers();
            cancelEdit();
        })
        .catch(err => {
            setAlertMessage("No se pudo modificar la oferta");
            setAlertSeverity("error");
        });
    }

    /**
     * Elimina una oferta individual.
     * Solicita confirmación antes de eliminar.
     *
     * @param {number} id_oferta - ID de la oferta a eliminar.
     */
    const deleteOffer = (id_oferta) => 
    {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta oferta?")) 
        {
            axios.delete(`${API_URL}/deleteOffer/${id_oferta}`)
            .then(() => {
                setAlertMessage("Se ha eliminado la oferta correctamente");
                setAlertSeverity("success");
                GetOffers(); // actualizar la lista después de eliminar
            })
            .catch(err => {
                setAlertMessage("No se pudo eliminarla oferta");
                setAlertSeverity("error");
            });
        }
    };

    /**
     * Elimina múltiples ofertas seleccionadas.
     * Solicita confirmación y elimina cada oferta de forma individual.
     */
    const deleteSelectedOffers = () => 
    {
        if (SelectedOffers.length === 0) 
        {
            setAlertMessage("No hay ofertas seleccionados");
            setAlertSeverity("warning");
            return;
        }

        if (!window.confirm("¿Estás seguro de que quieres eliminar las ofertas seleccionados?")) 
        {
            return;
        }

        // Eliminar productos uno por uno
        SelectedOffers.forEach(id => {
            axios.delete(`${API_URL}/deleteOffer/${id}`)
                .then(() => {
                    // Actualizar la lista de productos después de cada eliminación
                    GetOffers();
                })
                .catch(err => {
                    setAlertMessage("No se pudo eliminar las ofertas");
                    setAlertSeverity("error");
                });
            });

        // Limpiar seleccionados
        setSelectedOffers([]);
        setAlertMessage("Ofertas eliminados correctamente");
        setAlertSeverity("success");
    };

    /**
     * Formatea una fecha para mostrarla en formato dd/mm/aa.
     *
     * @param {string} dateString - Fecha en formato string.
     * @returns {string} Fecha formateada o cadena original si es inválida.
     */
    const formatDate = (dateString) => 
    {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date)) return dateString; // por si viene en formato raro
        return date.toLocaleDateString("es-ES", 
        {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit"
        });
    };

    return(
        <div className="container mt-4 d-flex flex-column align-items-center" style={{ maxWidth: "95%" }}>
                    <h2>Lista de ofertas</h2>  
                    <button className="btn btn-danger" onClick={deleteSelectedOffers} disabled={SelectedOffers.length === 0}>
                        Eliminar seleccionadas
                    </button>
                    {alertMessage && (
                        <Alert
                        severity={alertSeverity}
                        onClose={() => setAlertMessage("")} // permite cerrar la alerta
                        style={{ marginTop: "10px" }}
                        >
                        {alertMessage}
                        </Alert>
                    )}
                    <div  className="table-responsive">
                            <table className="table table-striped mt-3">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Tipo</th>
                                        <th>Valor</th>
                                        <th>id_postre</th>
                                        <th>fecha_inicio</th>
                                        <th>fecha_fin</th>
                                        <th>ser_visible</th>
                                        <th>fecha_creacion</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {ListaOfertas.map((offer, index) => (
                                        <tr key={`${offer.id_oferta}-${index}`}>

                                            <td>{offer.id_oferta}</td>

                                            {/* Nombre */}
                                            <td data-label="Nombre">
                                                {editIndex === index ? (
                                                    <input className="form-control"
                                                        value={editData.nombre}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, nombre: e.target.value })
                                                        }
                                                    />
                                                ) : offer.nombre}
                                            </td>

                                            {/* Tipo */}
                                            <td data-label="tipo">
                                                {editIndex === index ? (
                                                    <select
                                                        className="control form-select"
                                                        id="tipo"
                                                        value={editData.tipo}
                                                        required
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, tipo: e.target.value })
                                                        }
                                                    >
                                                        <option value="">Selecciona tipo</option>
                                                        <option value="descuento">Descuento (%)</option>
                                                        <option value="2x1">2x1</option>
                                                        <option value="3x2">3x2</option>
                                                    </select>
                                                ) : (
                                                    offer.tipo
                                                )}
                                            </td>

                                            {/* Valor */}
                                            <td data-label="valor">
                                                {editIndex === index ? (
                                                    <input className="form-control"
                                                        value={editData.valor}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, valor: e.target.value })
                                                        }
                                                    />
                                                ) : offer.valor}
                                            </td>

                                            {/* Id postre */}
                                            <td data-label="id_postre">
                                                {editIndex === index ? (
                                                    <select
                                                        className="form-select"
                                                        id="id_postre"
                                                        value={editData.id_postre}
                                                        required
                                                        onChange={(e) => setEditData({ ...editData, id_postre: e.target.value })}
                                                    >
                                                        <option value="">Selecciona un postre</option>
                                                        {postres.map((postre) => (
                                                            <option key={postre.id_postre} value={postre.id_postre}>
                                                                Nombre: {postre.nombre} id: ({postre.id_postre})
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : offer.id_postre}
                                            </td>

                                            {/* fecha_inicio */}
                                            <td data-label="fecha_inicio">
                                                {editIndex === index ? (
                                                    <input className="form-control"
                                                        type="date"
                                                        value={editData.fecha_inicio  ? editData.fecha_inicio.split('T')[0] : ''}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, fecha_inicio: e.target.value})
                                                        }
                                                    />
                                                ) : formatDate(offer.fecha_inicio)}
                                            </td>

                                            {/* fecha_fin */}
                                            <td data-label="fecha_fin">
                                                {editIndex === index ? (
                                                    <input className="form-control"
                                                        type="date"
                                                        value={editData.fecha_fin  ? editData.fecha_fin.split('T')[0] : ''}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, fecha_fin: e.target.value })
                                                        }
                                                    />
                                                ) : formatDate(offer.fecha_fin)}
                                            </td>

                                            {/* Visible */}
                                            <td data-label="Visible">
                                                {editIndex === index ? (
                                                    <select className="form-control"
                                                        value={editData.ser_visible}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, ser_visible: e.target.value })
                                                        }
                                                    >
                                                        <option value="true">Sí</option>
                                                        <option value="false">No</option>
                                                    </select>
                                                ) : offer.ser_visible ? "Sí" : "No"}
                                            </td>
                                            <td>
                                                {formatDate(offer.fecha_creacion)}
                                            </td>
                                            {/* Acciones */}
                                            <td className="d-flex flex-row preacciones" data-label="Acciones">
                                                {editIndex === index ? (
                                                    <>
                                                    <div className="acciones">
                                                            <button className="btn btn-success btn-sm me-2"
                                                                onClick={() => saveEdit(offer.id_oferta) }
                                                            >
                                                                Guardar cambios
                                                            </button>
                                                            <button className="btn btn-secondary btn-sm"
                                                                onClick={cancelEdit}
                                                            >
                                                                Cancelar
                                                            </button>
                                                    </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="acciones">
                                                            <button className="btn btn-primary btn-sm"
                                                                onClick={() => startEdit(index, offer)}
                                                            >
                                                                Modificar
                                                            </button>
                                                            <button className="btn btn-primary btn-sm"
                                                                onClick={() => deleteOffer(offer.id_oferta)}
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={SelectedOffers.includes(offer.id_oferta)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setSelectedOffers([...SelectedOffers, offer.id_oferta]);
                                                        } else {
                                                            setSelectedOffers(SelectedOffers.filter(id => id !== offer.id_oferta));
                                                        }
                                                    }}
                                                />
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
    )
}

export { ViewOffer };