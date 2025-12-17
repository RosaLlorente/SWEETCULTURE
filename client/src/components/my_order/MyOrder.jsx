import React, { useEffect, useState } from "react";
import { MyOrderUtils } from "./MyOrderUtils";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import axios from "axios";

const MyOrder = () => {
    const API_URL= process.env.API_URL;
    const { miPedido, CancelOrder, DoOrder } = MyOrderUtils();
    const [productosCatalogo, setProductosCatalogo] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/getProducts`)
            .then(res => setProductosCatalogo(res.data))
            .catch(() => setProductosCatalogo([]));
    }, []);

    const handleCancel = () => {
        if (miPedido) {
            CancelOrder(miPedido.id_pedido);
        }
    };

    const handleDoOrder = () => {
        if (miPedido) {
            DoOrder(miPedido.id_pedido);
        }
    };

    return (
        <div className="container my-5">
            <h1 className="mb-4 text-center">Mi Pedido</h1>

            {miPedido ? (
                <div>
                    <div className="card mb-4 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Pedido en curso: #{miPedido.id_pedido}</h5>
                            <p className="card-text">
                                Estado: <span className="badge bg-info text-dark">{miPedido.estado}</span>
                            </p>
                            {miPedido.detalle && miPedido.detalle.length > 0 ? (
                                <div className="list-group mb-3">
                                    {miPedido.detalle?.map((item) => {
                                        const productoCompleto = productosCatalogo.find(p => p.id_postre === item.id_postre);
                                        return (
                                            <div key={item.id_detalle} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1">{item.nombre_postre || `Postre #${item.id_postre}`}</h6>
                                                    <small>Cantidad: {item.cantidad}</small>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="badge bg-primary rounded-pill">${ Number(item.subtotal).toFixed(2)}</span>
                                                    <Link
                                                        to="/detalle"
                                                        state={{ producto: productoCompleto ? { ...productoCompleto, cantidad: item.cantidad } : item }}
                                                        className="btn btn-outline-secondary btn-sm"
                                                    >
                                                        Ver detalle
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-muted">No hay productos en el pedido aún.</p>
                            )}
                            <hr />
                            <h6>Total: ${ Number(miPedido.total)?.toFixed(2) || "0.00"}</h6>
                            <div className="d-flex justify-content-between mt-3">
                                <button className="btn btn-danger" onClick={handleCancel}>
                                    Cancelar Pedido
                                </button>
                                <button className="btn btn-success" onClick={handleDoOrder}>
                                    Realizar Pedido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="alert alert-warning text-center" role="alert">
                    Aún no hay ningún pedido en curso.
                </div>
            )}
        </div>
    );
};

export { MyOrder };
