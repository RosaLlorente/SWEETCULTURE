//Importaciones funcionales
import { useEffect, useState } from "react";
import axios from "axios";
//Importaciones diseño
import Alert from "@mui/material/Alert";

export function ViewOrder({ historiales = [] }) 
{
    //Declaración de constantes
    const API_URL= process.env.REACT_APP_API_URL;
    const [listaHistorial, setListaHistorial] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({});
    const [selectedPedidos, setSelectedPedidos] = useState([]); // Pedidos seleccionados

    /**
     * Sincroniza el estado local `listaHistorial` con la prop `historiales`.
     * Cada vez que `historiales` cambia, se actualiza la lista local.
     */
    useEffect(() => 
    {
        setListaHistorial(historiales);
    }, [historiales]);

    /**
     * Trae todos los pedidos del backend.
     * Actualiza `listaHistorial` con los datos recibidos.
     * Si ocurre un error, se establece una lista vacía.
     */
    const BuscarTodosLosPedidos = () => 
    {
        axios
        .get(`${API_URL}/getUsersOrders`)
        .then((res) => setListaHistorial(res.data || []))
        .catch(() => setListaHistorial([]));
    };

    /**
     * Hook que se ejecuta al montar el componente.
     * Si no hay pedidos filtrados, se traen todos los pedidos.
     */
    useEffect(() => 
    {
        if (historiales.length === 0) 
        {
            BuscarTodosLosPedidos();
        }
    }, [historiales.length]); // solo al montar

    /**
     * Alterna la selección de un pedido en `selectedPedidos`.
     * Si el ID ya está seleccionado, lo quita; si no, lo agrega.
     *
     * @param {number|string} id_historial - ID del pedido a alternar.
     */
    const toggleSelectPedido = (id_historial) => 
    {
        setSelectedPedidos(prev => 
            prev.includes(id_historial)
                ? prev.filter(id => id !== id_historial)
                : [...prev, id_historial]
        );
    };

    /**
     * Elimina los pedidos seleccionados en `selectedPedidos`.
     * Solicita confirmación al usuario antes de eliminar.
     * Actualiza la lista de pedidos y limpia la selección.
     */
    const eliminarSeleccionados = () => 
    {
        if (selectedPedidos.length === 0) 
        {
            setAlertMessage("No se han seleccionado pedidos");
            setAlertSeverity("warning");
            return;
        }

        if (!window.confirm(`¿Eliminar ${selectedPedidos.length} pedido(s) seleccionado(s)?`)) return;

        Promise.all(selectedPedidos?.map(id =>
            axios.delete(`${API_URL}/deleteOrderHistorial/${id}`)
        ))
        .then(() => {
            setAlertMessage("Pedidos eliminados correctamente");
            setAlertSeverity("success");
            setSelectedPedidos([]);
            BuscarTodosLosPedidos();
        })
        .catch(() => {
            setAlertMessage("Error al eliminar algunos pedidos");
            setAlertSeverity("error");
        });
    };

    /**
     * Cancela un pedido individual.
     * Solicita confirmación antes de eliminar y actualiza la lista local.
     *
     * @param {number|string} id_historial - ID del pedido a eliminar.
     */
    const cancelarPedido = (id_historial) => 
    {
        if (!window.confirm("¿Estás seguro de eliminar este pedido?")) return;

        axios.delete(`${API_URL}/deleteOrderHistorial/${id_historial}`)
        .then(() => {
            setAlertMessage("Se ha eliminado el pedido correctamente");
            setAlertSeverity("success");
            setListaHistorial(prev => prev.filter(p => p.id_historial !== id_historial));
            setSelectedPedidos(prev => prev.filter(id => id !== id_historial));
        })
        .catch(() => {
            setAlertMessage("No se pudo eliminar el pedido");
            setAlertSeverity("error");
        });
    };

    /**
     * Inicia el modo edición para actualizar el estado de un pedido.
     *
     * @param {number} index - Índice del pedido en la lista.
     * @param {object} item - Objeto del pedido a editar.
     */
    const startEdit = (index, item) => 
    {
        setEditIndex(index);
        setEditData({
            id_historial: item.id_historial,
            estado: item.estado
        });
    };

    /**
     * Cancela la edición de un pedido y limpia los datos de edición.
     */
    const cancelEdit = () => 
    {
        setEditIndex(null);
        setEditData({});
    };

    /**
     * Guarda los cambios del estado de un pedido editado.
     * Realiza POST al backend y actualiza la lista local.
     */
    const saveEdit = () => 
    {
        axios.post(`${API_URL}/updateOrderHistorial`, {
            id_historial: editData.id_historial,
            estado: editData.estado
        })
        .then(() => {
            setAlertMessage("Estado actualizado correctamente");
            setAlertSeverity("success");
            setListaHistorial(prev => prev?.map(p =>
                p.id_historial === editData.id_historial ? { ...p, estado: editData.estado } : p
            ));
            cancelEdit();
        })
        .catch(() => {
            setAlertMessage("No se pudo actualizar el estado");
            setAlertSeverity("error");
        });
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-2">Lista de historial de pedidos de clientes</h2>

            <div className="mb-3 text-end">
                <button className="btn btn-danger" onClick={eliminarSeleccionados} disabled={selectedPedidos.length === 0}>
                    Eliminar seleccionadas
                </button>
            </div>

            {alertMessage && (
                <Alert severity={alertSeverity} onClose={() => setAlertMessage("")} style={{ marginTop: "10px" }}>
                    {alertMessage}
                </Alert>
            )}

            {listaHistorial.length === 0 ? (
                <div className="alert alert-warning text-center">No hay historial disponible.</div>
            ) : (
                listaHistorial?.map((item, index) => (
                    <div className="card mb-4 shadow-sm" key={item.id_historial}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-2">
                                    <div>
                                        <div className="d-flex align-items-align-content-between gap-2">
                                            <h4>Pedido {listaHistorial.length - index}</h4> 
                                            {item.estado !== "recogido" && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPedidos.includes(item.id_historial)}
                                                    onChange={() => toggleSelectPedido(item.id_historial)}
                                                />
                                            )}
                                        </div>
                                        <p className="text-muted mb-1">
                                            Usuario: {item.nombre} {item.apellidos}
                                        </p>
                                        <p className="text-muted mb-1">
                                            Fecha: {new Date(item.fecha_pedido).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {editIndex === index ? (
                                    <select
                                        className="form-select w-auto"
                                        value={editData.estado}
                                        onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="en_preparacion">Preparando</option>
                                        <option value="listo">Listo</option>
                                        <option value="recogido">Recogido</option>
                                    </select>
                                ) : (
                                    <span className={`badge px-3 py-2 fs-6 ${
                                        item.estado === "recogido"
                                            ? "bg-success"
                                            : item.estado === "listo"
                                            ? "bg-primary"
                                            : "bg-warning text-dark"
                                    }`}>
                                        {item.estado === "pendiente" && "PENDIENTE"}
                                        {item.estado === "en_preparacion" && "EN PREPARACIÓN"}
                                        {item.estado === "listo" && "LISTO PARA RECOGER"}
                                        {item.estado === "recogido" && "RECOGIDO Y PAGADO"}
                                    </span>
                                )}
                            </div>

                            <table className="table table-bordered mt-3">
                                <tbody>
                                    <tr>
                                        <th>Total</th>
                                        <td>${item.total}</td>
                                    </tr>
                                    <tr>
                                        <th>ID Historial</th>
                                        <td>{item.id_historial}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="accordion" id={`accordion-${index}`}>
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${index}`}>
                                            🍰 Ver postres del pedido
                                        </button>
                                    </h2>
                                    <div id={`collapse-${index}`} className="accordion-collapse collapse" data-bs-parent={`#accordion-${index}`}>
                                        <div className="accordion-body">
                                            {item.postres?.map((postre, i) => (
                                                <div key={i} className="d-flex gap-3 p-2 border rounded mb-2">
                                                    <div>
                                                        <p className="fw-bold mb-1">{postre.nombre}</p>
                                                        <p className="mb-0">Cantidad: {postre.cantidad}</p>
                                                        <p className="mb-0">Subtotal: ${postre.subtotal}</p>
                                                        {postre.oferta && <p className="text-danger fw-bold mb-0">Oferta: {postre.oferta}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {editIndex === index ? (
                                <div className="d-flex gap-2">
                                    <button className="btn btn-success w-50" onClick={saveEdit}>Guardar</button>
                                    <button className="btn btn-secondary w-50" onClick={cancelEdit}>Cancelar</button>
                                </div>
                            ) : (
                                <button className="btn btn-primary w-100" onClick={() => startEdit(index, item)}>✏️ Editar estado</button>
                            )}

                            {item.estado !== "recogido" && (
                                <button className="btn btn-danger w-100 mt-2" onClick={() => cancelarPedido(item.id_historial)}>❌ Eliminar pedido</button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
