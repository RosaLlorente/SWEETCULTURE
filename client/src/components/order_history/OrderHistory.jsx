//Importaciones funcionales
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../main_components/AuthContext.jsx";

//Importaciones diseño
import Alert from "@mui/material/Alert";
import "../../assets/CSS/order_history/OrderHistory.css";

export function OrderHistory() 
{
    //Declaración de constantes
    const API_URL= process.env.API_URL;
    const { usuario } = useContext(AuthContext);
    const [listaHistorial, setListaHistorial] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");

    /**
     * Hook que carga automáticamente el historial de pedidos
     * cada vez que cambia el usuario.
     */
    useEffect(() => {
        /**
         * Obtiene todos los pedidos del usuario actual desde el backend.
         * Actualiza el estado `listaHistorial` con los pedidos obtenidos.
         * Si no hay historial o ocurre un error, se establece un array vacío.
         */
        const BuscarTodosLosPedidosDeUsuario = () => {
            axios
                .get(`${API_URL}/getUserOrders/${usuario.id_usuario}`)
                .then((res) => setListaHistorial(res.data || []))
                .catch(() => {
                    console.log("No se encontró historial para este usuario");
                    setListaHistorial([]);
                });
        };

        BuscarTodosLosPedidosDeUsuario();
    }, [usuario.id_usuario]);

    /**
     * Cancela un pedido específico del historial.
     *
     * 1. Pide confirmación al usuario antes de eliminar.
     * 2. Realiza la petición DELETE al backend.
     * 3. Actualiza el historial llamando nuevamente.
     * 4. Muestra alertas de éxito o error según corresponda.
     *
     * @param {number} id_pedido - ID del pedido a eliminar.
     */
    const cancelarPedido = (id_pedido) => 
    {
        if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) 
        {
            axios
                .delete(`${API_URL}/deleteOrderHistorial/${id_pedido}`)
                .then(() => {
                    setAlertMessage("Se ha eliminado el pedido correctamente");
                    setAlertSeverity("success");
                    axios
                    .get(`${API_URL}/getUserOrders/${usuario.id_usuario}`)
                    .then((res) => setListaHistorial(res.data || []));
                })
                .catch(() => {
                    setAlertMessage("No se pudo eliminar el pedido");
                    setAlertSeverity("error");
                });
        }
    };


    return (
        <div className="container mt-4" id="OrderH">
            <h2 className="text-center mb-4">📜 Historial de pedidos 📜</h2>
            {alertMessage && (
                <Alert
                severity={alertSeverity}
                onClose={() => setAlertMessage("")} // permite cerrar la alerta
                style={{ marginTop: "10px" }}
                >
                {alertMessage}
                </Alert>
            )}

            {listaHistorial.length === 0 ? (
                <div className="alert alert-warning text-center">
                    No hay historial disponible.
                </div>
            ) : (
                listaHistorial?.map((item, index) => (
                    <div className="card mb-4 shadow-sm" key={item.id_historial}>
                        <div className="card-body">
                            
                            {/* Encabezado */}
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="card-title">Pedido {listaHistorial.length - index}</h4>
                                    <p className="text-muted mb-1">
                                        Fecha: {new Date(item.fecha_pedido).toLocaleString()}
                                    </p>
                                </div>

                                <span 
                                    className={`badge px-3 py-2 fs-6 ${
                                        item.estado === "recogido"
                                            ? "bg-success"
                                            : "bg-warning text-dark"
                                    }`}
                                >
                                    {item.estado.toUpperCase()}
                                </span>
                            </div>

                            {/* Tabla */}
                            <table className="table table-bordered mt-3">
                                <tbody>
                                    <tr>
                                        <th>Total</th>
                                        <td>{item.total ? `$${item.total}` : "—"}</td>
                                    </tr>
                                    <tr>
                                        <th>ID Historial</th>
                                        <td>{item.id_historial}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Postres (Acordeón) */}
                            <div className="accordion" id={`accordion-${index}`}>
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button 
                                            className="accordion-button collapsed" 
                                            type="button" 
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse-${index}`}
                                        >
                                            🍰 Ver postres del pedido
                                        </button>
                                    </h2>

                                    <div 
                                        id={`collapse-${index}`} 
                                        className="accordion-collapse collapse"
                                        data-bs-parent={`#accordion-${index}`}
                                    >
                                        <div className="accordion-body">

                                            {item.postres?.map((postre, i) => (
                                                <div 
                                                    key={i} 
                                                    className="d-flex gap-3 p-2 border rounded mb-2"
                                                >
                                                    <div>
                                                        <p className="fw-bold mb-1">{postre.nombre}</p>
                                                        <p className="mb-0">Cantidad: {postre.cantidad}</p>
                                                        <p className="mb-0">Subtotal: ${postre.subtotal}</p>
                                                        {postre.oferta && (
                                                            <p className="text-danger fw-bold mb-0">
                                                                Oferta: {postre.oferta}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botón cancelar */}
                            {item.estado !== "recogido" && (
                                <button
                                    className="btn btn-rojo w-100 mt-3"
                                    onClick={() => cancelarPedido(item.id_pedido)}
                                >
                                    ❌ Cancelar pedido
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
