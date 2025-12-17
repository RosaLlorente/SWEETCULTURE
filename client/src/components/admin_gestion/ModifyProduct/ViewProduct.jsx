//Importaciones funcionales
import  { useState, useEffect } from "react";
import axios from "axios";

//Importaciones de utils
import { validateEditProductForm } from "../../../utils/formValidators"

//Importaciones diseño
import "../../../assets/CSS/admin_gestion/Modify_Product/ViewProduct.css";
import Alert from "@mui/material/Alert";


const ViewProduct = ({ productos }) => 
{
    //Declaración de constantes
    const API_URL= process.env.API_URL;
    const [ListaProductos, setListaProductos] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({});
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");


    /**
    * Obtiene todos los productos desde el backend y actualiza el estado `listaProductos`.
    * Muestra un mensaje de error si la petición falla.
    */
    const GetProducts = () => 
    {
        axios.get(`${API_URL}/getProducts`)
        .then((response) => setListaProductos(response.data))
        .catch(err => {
            setAlertMessage("No se ha podido mostrar los productos");
            setAlertSeverity("error");
        });
    };

    /**
     * Hook que inicializa la lista de productos:
     * - Si se recibe un array `productos` válido, se usa directamente.
     * - Si no, se llama a `GetProducts()` para obtener los productos del backend.
     */
    useEffect(() => 
    {
        if (productos && productos.length > 0) 
        {
            setListaProductos(productos);
        } 
        else 
        {
            GetProducts();
        }
    }, [productos]);

    /**
     * Hook que gestiona el alertMessage:
     * - Cuando `alertMessage` cambia, se oculta automáticamente tras 5 segundos.
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
     * Inicia el modo edición para un producto específico.
     *
     * @param {number} index - Índice del producto en la lista.
     * @param {object} product - Datos del producto a editar.
     */
    const startEdit = (index, product) => 
    {
        setEditIndex(index);
        setEditData(
        {
            ...product,
            disponible: product.disponible ? "true" : "false",
            ser_visible: product.ser_visible ? "true" : "false"
        });
    };

    /**
     * Cancela el modo edición y limpia los datos de edición.
     */
    const cancelEdit = () => 
    {
        setEditIndex(null);
        setEditData({});
    };

    /**
     * Guarda los cambios de un producto editado.
     *
     * @param {number} id_postre - ID del producto a actualizar.
     * Realiza validación de datos, prepara FormData y hace PUT al backend.
     * Muestra alertas según el resultado y actualiza la lista de productos.
     */
    const saveEdit = (id_postre) => 
    {
        const { error, data } = validateEditProductForm(editData);

        if (error) 
        {
            setAlertMessage(error);
            setAlertSeverity("warning");
            return;
        }
        const formData = new FormData();

        // Añadir los campos normales
        formData.append("nombre", editData.nombre);
        formData.append("origen", editData.origen);
        formData.append("precio", editData.precio);
        formData.append("etiqueta_especial",editData.etiqueta_especial);
        formData.append("descripcion", editData.descripcion);
        formData.append("ingredientes", editData.ingredientes);
        formData.append("disponible", editData.disponible === "true" ? 1 : 0);
        formData.append("ser_visible", editData.ser_visible === "true" ? 1 : 0);
        formData.append("unidades", editData.unidades);
        formData.append("tiempo_preparacion_minutos", editData.tiempo_preparacion_minutos);
        formData.append("tiempo_horneado_minutos", editData.tiempo_horneado_minutos);
        formData.append("capacidad_horneado", editData.capacidad_horneado);

        // Añadir la nueva imagen si existe
        if (editData.nuevaImagen) 
        {
            formData.append("Imagen", editData.nuevaImagen);
        }

        axios.put(`${API_URL}/updateProduct/${id_postre}`, formData)
        .then(() => 
        {
            setAlertMessage("Producto modificado correctamente");
            setAlertSeverity("success");
            GetProducts();
            cancelEdit();
        })
        .catch(() => 
        {
            setAlertMessage("No se pudo modificar el producto");
            setAlertSeverity("error");
        });
    };

    /**
     * Elimina un producto individual.
     *
     * @param {number} id_postre - ID del producto a eliminar.
     * Solicita confirmación, realiza DELETE y actualiza la lista de productos.
     */
    const deleteProduct = (id_postre) => 
    {
        if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) 
        {
            axios.delete(`${API_URL}/deleteProduct/${id_postre}`)
            .then(() => 
            {
                setAlertMessage("Se ha eliminado el producto correctamente");
                setAlertSeverity("success");
                GetProducts(); // actualizar la lista después de eliminar
            })
            .catch(err => 
            {
                setAlertMessage("No se pudo eliminar el producto");
                setAlertSeverity("error");
            });
        }
    };

    /**
     * Elimina varios productos seleccionados.
     *
     * - Comprueba si hay productos seleccionados.
     * - Solicita confirmación al usuario.
     * - Elimina los productos uno por uno mediante DELETE.
     * - Actualiza la lista y limpia los productos seleccionados.
     */
    const deleteSelectedProducts = () => 
    {
        if (selectedProducts.length === 0) 
        {
            setAlertMessage("No hay productos seleccionados");
            setAlertSeverity("warning");
            return;
        }

        if (!window.confirm("¿Estás seguro de que quieres eliminar los productos seleccionados?")) 
        {
            return;
        }

        // Eliminar productos uno por uno
        selectedProducts.forEach(id => {
            axios.delete(`${API_URL}/deleteProduct/${id}`)
            .then(() => 
            {
                // Actualizar la lista de productos después de cada eliminación
                GetProducts();
            })
            .catch(err => 
            {
                setAlertMessage("No se pudo eliminar los productos");
                setAlertSeverity("error");
            });
        });

        // Limpiar seleccionados
        setSelectedProducts([]);
        setAlertMessage("Productos eliminados correctamente");
        setAlertSeverity("success");
    };

    return (
        <div className="container mt-4 d-flex flex-column align-items-center" style={{ maxWidth: "95%" }}>
            <h2>Lista de productos</h2>  
             <button className="btn btn-danger" onClick={deleteSelectedProducts} disabled={selectedProducts.length === 0}>
                Eliminar seleccionados
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
                            <th>Origen</th>
                            <th>Precio</th>
                            <th>Etiqueta especial</th>
                            <th>Descripción</th>
                            <th>Ingredientes</th>
                            <th>Disponible</th>
                            <th>Visible</th>
                            <th>Unidades</th>
                            <th>Tiempo Preparación</th>
                            <th>Tiempo Horno</th>
                            <th>Capacidad Horno</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {ListaProductos.map((product, index) => (
                            <tr key={`${product.id_postre}-${index}`}>

                                <td>{product.id_postre}</td>

                                {/* Nombre */}
                                <td data-label="Nombre">
                                    {editIndex === index ? (
                                        <input className="form-control"
                                            value={editData.nombre}
                                            onChange={(e) =>
                                                setEditData({ ...editData, nombre: e.target.value })
                                            }
                                        />
                                    ) : product.nombre}
                                </td>

                                {/* Origen */}
                                <td data-label="Origen">
                                    {editIndex === index ? (
                                        <input className="form-control"
                                            value={editData.origen}
                                            onChange={(e) =>
                                                setEditData({ ...editData, origen: e.target.value })
                                            }
                                        />
                                    ) : product.origen}
                                </td>

                                {/* Precio */}
                                <td data-label="Precio">
                                    {editIndex === index ? (
                                        <input type="number" className="form-control"
                                            value={editData.precio}
                                            onChange={(e) =>
                                                setEditData({ ...editData, precio: e.target.value })
                                            }
                                        />
                                    ) : product.precio}
                                </td>
                                {/*Etiqueta especial*/}
                                <td data-label="etiqueta_especial">
                                    {editIndex === index ? (
                                        <input className="form-control"
                                            value={editData.etiqueta_especial}
                                            onChange={(e) =>
                                                setEditData({ ...editData, etiqueta_especial: e.target.value })
                                            }
                                        />
                                    ) : product.etiqueta_especial}
                                </td>

                                {/* Descripción */}
                                <td data-label="Descripción">
                                    {editIndex === index ? (
                                        <input className="form-control"
                                            value={editData.descripcion}
                                            onChange={(e) =>
                                                setEditData({ ...editData, descripcion: e.target.value })
                                            }
                                        />
                                    ) : product.descripcion}
                                </td>

                                {/* Ingredientes */}
                                <td data-label="Ingredientes">
                                    {editIndex === index ? (
                                        <input className="form-control"
                                            value={editData.ingredientes}
                                            onChange={(e) =>
                                                setEditData({ ...editData, ingredientes: e.target.value })
                                            }
                                        />
                                    ) : product.ingredientes}
                                </td>

                                {/* Disponible */}
                                <td data-label="Disponible">
                                    {editIndex === index ? (
                                        <select className="form-control"
                                            value={editData.disponible}
                                            onChange={(e) =>
                                                setEditData({ ...editData, disponible: e.target.value })
                                            }
                                        >
                                            <option value="true">Sí</option>
                                            <option value="false">No</option>
                                        </select>
                                    ) : product.disponible ? "Sí" : "No"}
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
                                    ) : product.ser_visible ? "Sí" : "No"}
                                </td>

                                {/* Unidades */}
                                <td data-label="Unidades">
                                    {editIndex === index ? (
                                        <input type="number" className="form-control"
                                            value={editData.unidades}
                                            onChange={(e) =>
                                                setEditData({ ...editData, unidades: e.target.value })
                                            }
                                        />
                                    ) : product.unidades}
                                </td>

                                {/* Tiempo preparación */}
                                <td data-label="Tiempo Prep">
                                    {editIndex === index ? (
                                        <input type="number" className="form-control"
                                            value={editData.tiempo_preparacion_minutos}
                                            onChange={(e) =>
                                                setEditData({ ...editData, tiempo_preparacion_minutos: e.target.value })
                                            }
                                        />
                                    ) : product.tiempo_preparacion_minutos + " minutos"} 
                                </td>

                                {/* Tiempo horneado */}
                                <td data-label="Tiempo Horno">
                                    {editIndex === index ? (
                                        <input type="number" className="form-control"
                                            value={editData.tiempo_horneado_minutos}
                                            onChange={(e) =>
                                                setEditData({ ...editData, tiempo_horneado_minutos: e.target.value })
                                            } 
                                        /> 
                                    ) : product.tiempo_horneado_minutos + " minutos"}
                                </td>

                                {/* Capacidad horno */}
                                <td data-label="Capacidad Horno">
                                    {editIndex === index ? (
                                        <input type="number" className="form-control"
                                            value={editData.capacidad_horneado}
                                            onChange={(e) =>
                                                setEditData({ ...editData, capacidad_horneado: e.target.value })
                                            }
                                        />
                                    ) : product.capacidad_horneado}
                                </td>

                                {/* Imagen */}
                                <td data-label="Imagen">
                                    {editIndex === index ? (
                                        <>
                                            <img src={product.imagen} alt={product.nombre} width="80" />
                                            <input
                                                type="file"
                                                className="form-control mt-2"
                                                onChange={(e) =>
                                                    setEditData({ ...editData, nuevaImagen: e.target.files[0] })
                                                }
                                            />
                                        </>
                                    ) : (
                                        !product.imagen || product.imagen === "null" ? (
                                            <img src="/ProductImage/404product.jpg" alt={"/ProductImage/" + product.nombre} width="80" />
                                        ) : (
                                            <img src={product.imagen} alt={product.nombre} width="80" />
                                        )
                                    )}
                                </td>

                                {/* Acciones */}
                                <td className="d-flex flex-row preacciones" data-label="Acciones">
                                    {editIndex === index ? (
                                        <>
                                        <div className="acciones">
                                                <button className="btn btn-success btn-sm me-2"
                                                    onClick={() => saveEdit(product.id_postre) }
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
                                                    onClick={() => startEdit(index, product)}
                                                >
                                                    Modificar
                                                </button>
                                                <button className="btn btn-primary btn-sm"
                                                    onClick={() => deleteProduct(product.id_postre)}
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
                                        checked={selectedProducts.includes(product.id_postre)}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setSelectedProducts([...selectedProducts, product.id_postre]);
                                            } else {
                                                setSelectedProducts(selectedProducts.filter(id => id !== product.id_postre));
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
    );
};

export { ViewProduct };
