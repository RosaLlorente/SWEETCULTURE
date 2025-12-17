//Importaciones funcionales
import { useState,useEffect } from "react";
import Axios from "axios";
//Importaciones de utils
import {validateProductForm} from "../../../utils/formValidators";
//Importaciones diseño
import Alert from "@mui/material/Alert";

export function AddProduct() 
{
    //Declaración de constantes
    const API_URL= process.env.REACT_APP_API_URL;
    const [nombre, setNombre] = useState("");
    const [origen, setOrigen] = useState("");
    const [precio, setPrecio] = useState(""); 
    const [imagen, setImagen] = useState(null);
    const [etiqueta_especial,setEtiqueta_especial] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [ingredientes, setIngredientes] = useState("");
    const [disponible, setDisponible] = useState(false);
    const [ser_visible, setSer_visible] = useState(false);
    const [unidades, setUnidades] = useState(0);
    const [tiempo_preparacion_minutos, setTiempo_preparacion_minutos] = useState(0);
    const [tiempo_horneado_minutos, setTiempo_horneado_minutos] = useState(0);
    const [capacidad_horneado, setCapacidad_horneado] = useState(0);
    const fecha_creacion = new Date().toISOString().split("T")[0];
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");

    /**
     * Hook que maneja la desaparición automática de los mensajes de alerta.
     * Cada vez que `alertMessage` cambia, se inicia un temporizador de 5 segundos
     * para limpiar el mensaje automáticamente.
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
     * Resetea todos los campos del formulario de creación de producto
     * a sus valores iniciales.
     */
    const resetForm = () => 
    {
        setNombre("");
        setOrigen("");
        setPrecio("");
        setEtiqueta_especial("");
        setImagen(null);
        setDescripcion("");
        setIngredientes("");
        setDisponible(false);
        setSer_visible(false);
        setUnidades(0);
        setTiempo_preparacion_minutos(0);
        setTiempo_horneado_minutos(0);
        setCapacidad_horneado(0);
    };

    /**
     * Registra un nuevo producto en la base de datos.
     * 1. Previene el comportamiento por defecto del formulario.
     * 2. Valida los campos usando `validateProductForm`.
     * 3. Si hay error, muestra alerta y detiene la ejecución.
     * 4. Crea un objeto FormData con todos los campos, incluyendo la imagen.
     * 5. Envía los datos al backend mediante POST.
     * 6. Muestra alertas según el resultado y resetea el formulario en caso de éxito.
     *
     * @param {Event} e - Evento de envío del formulario.
     */
    const registerProduct = (e) => 
    {
        e.preventDefault();
        const { error } = validateProductForm({
            nombre,
            origen,
            precio,
            descripcion,
            ingredientes,
            unidades,
            disponible
        });

        if (error) 
        {
            setAlertMessage(error);
            setAlertSeverity("error");
            return;
        }

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("origen", origen);
        formData.append("precio", precio);
        formData.append("etiqueta_especial",etiqueta_especial);
        formData.append("Imagen", imagen); 
        formData.append("descripcion", descripcion);
        formData.append("ingredientes", ingredientes);
        formData.append("disponible", disponible ? 1 : 0);
        formData.append("ser_visible", ser_visible ? 1 : 0);
        formData.append("unidades", unidades);
        formData.append("tiempo_preparacion_minutos", tiempo_preparacion_minutos);
        formData.append("tiempo_horneado_minutos", tiempo_horneado_minutos);
        formData.append("capacidad_horneado", capacidad_horneado);
        formData.append("fecha_creacion", fecha_creacion);

        Axios.post(`${API_URL}/addProduct`, formData)
        .then(() => {
            setAlertMessage("Se ha podido crear el producto correctamente");
            setAlertSeverity("success");
            resetForm();
        })
        .catch(() => {
            setAlertMessage("No se ha podido crear el producto");
            setAlertSeverity("error");
        });
    };

    // Vista del formulario para añadir un nuevo producto a la base de datos 
    return (
        <>
            <h2 className="text-center">Añadir postre a la base de datos</h2>
            <div>
            {alertMessage && (
                <Alert
                severity={alertSeverity}
                onClose={() => setAlertMessage("")} // permite cerrar la alerta
                style={{ marginTop: "10px", width: "400px" }}
                >
                {alertMessage}
                </Alert>
            )}
            </div>
           <div className="d-flex justify-content-center mt-4">
                <form className="w-75 w-md-50" onSubmit={registerProduct} encType="multipart/form-data">
                    <div className="row">
                        <div className="col-md-3 mb-3 aling center">
                            <label htmlFor="nombre" className="form-label">Nombre</label>
                            <input type="text" className="form-control" id="nombre" placeholder="Ej: Tarta de manzana" value={nombre} required 
                            onChange={(event)=>{ setNombre(event.target.value); }}
                            />
                        </div>

                        <div className="col-md-3 mb-3">
                            <label htmlFor="origen" className="form-label">Origen</label>
                            <input type="text" className="form-control" id="origen" placeholder="Ej: Francia" value={origen} required 
                            onChange={(event)=>{ setOrigen(event.target.value); }}
                            />
                        </div>

                        <div className="col-md-3 mb-3">
                            <label htmlFor="precio" className="form-label">Precio</label>
                            <input  type="number"  className="form-control"  id="precio" placeholder="Ej: 12.50" value={precio} required  
                            onChange={(event)=>{ setPrecio(event.target.value); }}
                            />
                        </div>

                        <div className="col-md-3 mb-3">
                            <label htmlFor="etiqueta_especial" className="form-label">Etiqueta especial</label>
                            <input
                                type="text"
                                className="form-control"
                                id="etiqueta_especial"
                                placeholder="Ej: Navidad, Verano"
                                value={etiqueta_especial}
                                onChange={(event) => setEtiqueta_especial(event.target.value)}
                            />
                        </div>

                        <div className="col-md-3 mb-3">
                            <label htmlFor="imagen" className="form-label">Imagen</label>
                            <input  type="file"  className="form-control"  id="imagen" accept="image/*" required  
                            onChange={(event)=>{ setImagen(event.target.files[0]); }}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3 mb-3 aling center">
                            <label htmlFor="tiempo_preparacion_minutos" className="form-label">Tiempo de preparacion en minutos</label>
                            <input type="number" className="form-control" id="tiempo_preparacion_minutos" placeholder="Ej: 1h" value={tiempo_preparacion_minutos} required 
                            onChange={(event)=>{ setTiempo_preparacion_minutos(event.target.value); }}
                            />
                        </div>

                        <div className="col-md-3 mb-3">
                            <label htmlFor="Tiempo_horneado_minutos" className="form-label">Tiempo de horneado en minutos</label>
                            <input type="number" className="form-control" id="Tiempo_horneado_minutos" placeholder="Ej: 1h" value={tiempo_horneado_minutos} required 
                            onChange={(event)=>{ setTiempo_horneado_minutos(event.target.value); }}
                            />
                        </div>

                        <div className="col-md-3 mb-3">
                            <label htmlFor="capacidad_horneado" className="form-label">Capacidad de horneado en unidades</label>
                            <input  type="number"  className="form-control"  id="capacidad_horneado" placeholder="Ej: 10" value={capacidad_horneado} required  
                            onChange={(event)=>{ setCapacidad_horneado(event.target.value); }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-3">
                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                            <textarea  className="form-control" id="descripcion" rows="3" placeholder="Escribe una descripción breve del postre..." value={descripcion} required
                            onChange={(event)=>{ setDescripcion(event.target.value); }}
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="ingredientes" className="form-label">Ingredientes</label>
                            <textarea className="form-control" id="ingredientes" rows="3" placeholder="Ej: Harina, azúcar, fresas, crema..." value={ingredientes} required
                            onChange={(event)=>{ setIngredientes(event.target.value); }}
                            ></textarea>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                        <div className="form-check mb-3">
                            <label className="form-check-label" htmlFor="disponible">
                                Disponible
                            </label>
                            <input  className="form-check-input" type="checkbox" id="disponible" checked={disponible}
                            onChange={(event)=>{ setDisponible(event.target.checked); }}
                            />
                        </div>
                        <div className="form-check mb-3">
                            <label className="form-check-label" htmlFor="ser_visible">
                                Ser visible en el catálogo
                            </label>
                            <input className="form-check-input" type="checkbox" id="ser_visible" checked={ser_visible}
                            onChange={(event)=>{ setSer_visible(event.target.checked); }}
                            />
                            
                        </div>
                    </div>
                    
                    {disponible ? (
                        <div className="d-flex justify-content-center mt-4">
                            <div className="mt-2">
                                <label htmlFor="unidades" className="form-label">Unidades disponibles:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="unidades"
                                    placeholder="Ej: 20"
                                    value={unidades}
                                    required
                                    onChange={(event) => setUnidades(event.target.value)}
                                />
                            </div>
                        </div>
                    ) : null}

                <div className="d-flex justify-content-end mt-4">
                        <button type="submit" className="btn btn-primary me-2">
                            Añadir producto
                        </button>
                        <button type="reset" className="btn btn-primary me-2"       onClick={resetForm}>
                            Reiniciar formulario
                        </button>
                </div>
                </form>
           </div>
        </>
    );
}
