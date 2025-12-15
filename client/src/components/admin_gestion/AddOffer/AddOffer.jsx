//Importaciones funcionales
import  { useState, useEffect } from "react";
import Axios from "axios";
//Importaciones de utils
import {validateOffer} from "../../../utils/formValidators";
//Importaciones diseño
import Alert from "@mui/material/Alert";

export function AddOffer() 
{
    //Declaración de constantes
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState(""); 
    const [valor, setValor] = useState(""); 
    const [id_postre, setId_postre] = useState("");
    const [fecha_inicio, setFecha_inicio] = useState("");
    const [fecha_fin, setFecha_fin] = useState("");
    const [ser_visible, setSer_visible] = useState(false);
    const [postres, setPostres] = useState([]); 
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");
    const fecha_creacion = new Date().toISOString().split("T")[0];

    /**
     * useEffect para cargar todos los productos al montar el componente.
     * Se hace una petición GET al backend para obtener la lista de postres
     * y se guarda en el estado `postres`.
     */
    useEffect(() => 
    {
        Axios.get("http://localhost:3000/getProducts")
        .then((res) => setPostres(res.data))
        .catch((err) => console.error(err));
    }, []);

    /**
     * useEffect para limpiar automáticamente los mensajes de alerta.
     * Cada vez que `alertMessage` cambia, se inicia un temporizador de 5 segundos
     * que limpia el mensaje. Se limpia el timer al desmontar o actualizar.
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
     * Resetea todos los campos del formulario de creación de ofertas
     * a sus valores iniciales.
     */
    const resetForm = () => 
    {
        setNombre("");
        setTipo("");
        setValor("");
        setId_postre("");
        setFecha_inicio("");
        setFecha_fin("");
        setSer_visible(false);
    };

    
    /**
     * Función para registrar una nueva oferta.
     * 1. Evita que el formulario recargue la página.
     * 2. Valida los campos usando `validateOffer`.
     * 3. Si hay error, muestra una alerta de advertencia y detiene la ejecución.
     * 4. Verifica que se haya seleccionado un postre; si no, muestra alerta.
     * 5. Crea un objeto FormData con los datos de la oferta, incluyendo fechas y visibilidad.
     * 6. Envía los datos al backend mediante POST.
     * 7. Muestra alertas según el resultado y resetea el formulario en caso de éxito.
     *
     * @param {Event} e - Evento de envío del formulario
     */
    const registerOffer = (e) => 
    {
        e.preventDefault();

        const { error, data } = validateOffer({ nombre, tipo, valor, id_postre, fecha_inicio, fecha_fin });
        if (error) 
        {
            setAlertMessage(error);
            setAlertSeverity("warning");
            return;
        }

        if (!id_postre) 
        {
            setAlertMessage("Debes seleccionar un postre para la oferta");
            setAlertSeverity("warning");
            return;
        }

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("tipo", tipo);
        formData.append("valor", valor);
        formData.append("id_postre", id_postre);
        formData.append("fecha_inicio", fecha_inicio);
        formData.append("fecha_fin", fecha_fin);
        formData.append("ser_visible", ser_visible ? 1 : 0);
        formData.append("fecha_creacion", fecha_creacion);

        Axios.post("http://localhost:3000/addOffer", formData)
        .then((res) => {
            setAlertMessage("Oferta añadida correctamente");
            setAlertSeverity("success");
            resetForm();
        })
        .catch((err) => {
            setAlertMessage("Error al añadir la oferta");
            setAlertSeverity("error");
        });
    };

    return (
        <>
            <h2 className="text-center">Añadir oferta a la base de datos</h2>
            {alertMessage && (
                <Alert
                    severity={alertSeverity}
                    onClose={() => setAlertMessage("")}
                    style={{ marginTop: "10px", width: "400px" }}
                >
                    {alertMessage}
                </Alert>
            )}

            <div className="d-flex justify-content-center mt-4">
                <form className="w-75 w-md-50" onSubmit={registerOffer}>
                    <div className="row">
                        {/* Nombre de la oferta */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                placeholder="Ej: Oferta Navidad"
                                value={nombre}
                                required
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>

                        {/* Tipo de oferta */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="tipo" className="form-label">Tipo de oferta</label>
                            <select
                                className="form-select"
                                id="tipo"
                                value={tipo}
                                required
                                onChange={(e) => setTipo(e.target.value)}
                            >
                                <option value="">Selecciona tipo</option>
                                <option value="descuento">Descuento (%)</option>
                                <option value="2x1">2x1</option>
                                <option value="3x2">3x2</option>
                            </select>
                        </div>

                        {/* Valor de la oferta */}
                        {tipo === "descuento" && (
                            <div className="col-md-6 mb-3">
                                <label htmlFor="valor" className="form-label">Valor (%)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="valor"
                                    placeholder="Ej: 20"
                                    value={valor}
                                    min="1"
                                    max="100"
                                    required
                                    onChange={(e) => setValor(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Postre asociado */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="id_postre" className="form-label">Postre</label>
                            <select
                                className="form-select"
                                id="id_postre"
                                value={id_postre}
                                required
                                onChange={(e) => setId_postre(e.target.value)}
                            >
                                <option value="">Selecciona un postre</option>
                                {postres.map((postre) => (
                                    <option key={postre.id_postre} value={postre.id_postre}>
                                        Nombre: {postre.nombre} id: ({postre.id_postre})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fecha inicio */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="fecha_inicio" className="form-label">Fecha inicio</label>
                            <input
                                type="date"
                                className="form-control"
                                id="fecha_inicio"
                                value={fecha_inicio}
                                required
                                onChange={(e) => setFecha_inicio(e.target.value)}
                            />
                        </div>

                        {/* Fecha fin */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="fecha_fin" className="form-label">Fecha fin</label>
                            <input
                                type="date"
                                className="form-control"
                                id="fecha_fin"
                                value={fecha_fin}
                                required
                                onChange={(e) => setFecha_fin(e.target.value)}
                            />
                        </div>

                        {/* Visible en inicio */}
                        <div className="col-md-6 mb-3 form-check mt-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="ser_visible"
                                checked={ser_visible}
                                onChange={(e) => setSer_visible(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="ser_visible">
                                Ser visible en el inicio
                            </label>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                        <button type="submit" className="btn btn-primary me-2">Añadir oferta</button>
                        <button type="reset" className="btn btn-secondary me-2" onClick={resetForm}>Reiniciar formulario</button>
                    </div>
                </form>
            </div>
        </>
    );
}
