import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../main_components/AuthContext";
import axios from "axios";
import { MyOrderUtils } from "../../my_order/MyOrderUtils.jsx";
import {validateRating} from "../../../utils/formValidators"
import Alert from "@mui/material/Alert";

const ProductDetail = () => {
    const API_URL= process.env.API_URL;
    const location = useLocation();
    const { producto } = location.state || {};
    const [dejarValoracion, setDejarValoracion] = useState(false);
    const { usuario } = useContext(AuthContext);
    const id_usuario = usuario ? usuario.id_usuario : null;
    const id_postre = producto ? producto.id_postre : null;

    const [comentario, setComentario] = useState("");
    const [hover, setHover] = useState(0);
    const [puntuacion, setPuntuacion] = useState(0);
    const fecha_valoracion = new Date().toISOString().split("T")[0];
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");

    const [meanRating, setMeanRating] = useState(0);
    
    const { miPedido, AnadirProductoAlPedido, EliminarProductoAlPedido,getOrderDetailsEspecificProduct } = MyOrderUtils();
    const [productoEnPedido, setProductoEnPedido] = useState(null);

    // Buscar el item actual en la cesta
    useEffect(() => {
        if (!miPedido || !producto) return;

        getOrderDetailsEspecificProduct(miPedido.id_pedido, producto.id_postre, setProductoEnPedido);
    }, [miPedido, producto, getOrderDetailsEspecificProduct]);


    useEffect(() => {
        if (!id_postre) return;

        axios.get(`${API_URL}/getMeanRatingProduct/${id_postre}`)
            .then(res => {
                setMeanRating(res.data.promedio || 0);
            })
            .catch(err => {
                console.error("Error al obtener la media de estrellas:", err);
            });
    }, [id_postre]);

    if (!producto) {
        return <p>No se encontró el producto.</p>;
    }

    // Unidades restantes: nunca negativas
    const unidadesRestantes = Math.max(producto.unidades - (productoEnPedido?.cantidad || 0), 0);

    const resetForm = () => {
        setComentario("");
        setPuntuacion(0);
    };

    const registerRating = (e) => {
        e.preventDefault();

         const error = validateRating({
            comentario,
            puntuacion,
            usuario,
        });

        if (error) {
            setAlertMessage(error);
            setAlertSeverity("warning");
            return;
        }

        const formData = new FormData();
        formData.append("id_usuario", id_usuario);
        formData.append("id_postre", id_postre);
        formData.append("comentario", comentario);
        formData.append("puntuacion", puntuacion);
        formData.append("fecha_valoracion", fecha_valoracion);

        axios
        .post(`${API_URL}/addRatingProduct`, formData)
        .then(() => {
            setAlertMessage("Se ha podido valorar el postre correctamente");
            setAlertSeverity("success");
            resetForm();
            return axios.get(`${API_URL}/getMeanRatingProduct/${id_postre}`);
        })
        .then(res => {
            setMeanRating(res.data.promedio || 0);
        })
        .catch(() => {
            setAlertMessage("No se ha podido valorar el postre");
            setAlertSeverity("error");
        });
    };

    // Estrellas con media
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            let style = { fontSize: "24px" };
            if (rating >= i) {
                style.color = "gold";
            } else if (rating >= i - 0.5) {
                style = {
                    fontSize: "24px",
                    background: "linear-gradient(90deg, gold 50%, #ccc 50%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                };
            } else {
                style.color = "#ccc";
            }
            stars.push(<span key={i} style={style}>★</span>);
        }
        return stars;
    };

    return (
        <div className="container my-5">

            <h2 className="mb-4">{producto.nombre}</h2>

            <div className="row">
                
                <div className="col-md-6">
                    <p><strong>Descripción:</strong> {producto.descripcion}</p>
                    <p><strong>Precio:</strong> ${producto.precio}</p>
                    <p><strong>Disponibilidad:</strong> {producto.disponible ? `${unidadesRestantes} unidades` : "No disponible"}</p>
                    <p><strong>Origen:</strong> {producto.origen}</p>
                    <p><strong>Etiqueta especial:</strong> {producto.etiqueta_especial}</p>
                </div>

                <div className="col-md-6 d-flex flex-column align-items-center">
                    {!producto.imagen || producto.imagen === "null" ? (
                        <img 
                            src="/ProductImage/404product.jpg"
                            alt={producto.nombre}
                            className="img-fluid rounded mb-3"
                            style={{ maxHeight: "300px", objectFit: "cover" }}
                        />
                    ) : (
                        <img 
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="img-fluid rounded mb-3"
                            style={{ maxHeight: "300px", objectFit: "cover" }}
                        />
                    )}

                    <div className="mb-3">
                        {renderStars(meanRating)}
                        <span style={{ marginLeft: "8px", fontWeight: "bold", fontSize: "1.2rem" }}>
                            { Number(meanRating).toFixed(1)} / 5
                        </span>
                    </div>

                    {/* Botón abrir valoración */}
                    <button className="btn btn-primary mb-2" onClick={() => setDejarValoracion(true)}>
                        Dejar mi valoración
                    </button>

                    {/* Formulario de valoración */}
                    {dejarValoracion && (
                        <div>
                            {alertMessage && (
                                <Alert
                                    severity={alertSeverity}
                                    onClose={() => setAlertMessage("")}
                                    style={{ marginTop: "10px", width: "400px" }}
                                >
                                    {alertMessage}
                                </Alert>
                            )}

                            <form onSubmit={registerRating} encType="multipart/form-data">
                                <div className="mb-3">
                                    <label htmlFor="comentario" className="form-label">
                                        Comentario
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="comentario"
                                        rows="3"
                                        placeholder="Ej: El servicio me pareció..."
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                    ></textarea>
                                </div>

                                {/* Estrellas interactivas */}
                                <div style={{ fontSize: "2rem", cursor: "pointer" }}>
                                    {[1,2,3,4,5].map(star => (
                                        <span
                                            key={star}
                                            onClick={() => setPuntuacion(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                            style={{
                                                color: star <= (hover || puntuacion) ? "gold" : "gray",
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>

                                <button type="submit" className="btn btn-success mt-3">Enviar valoración</button>
                            </form>

                            <button
                                className="btn btn-secondary mt-2"
                                onClick={() => setDejarValoracion(false)}
                            >
                                Cerrar formulario
                            </button>
                        </div>
                    )}

                    {/* BOTONES DE (+) (-) o AÑADIR */}
                    {producto.unidades > 0 && (
                        productoEnPedido ? (
                            <>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => EliminarProductoAlPedido(producto.id_postre, 1)}
                                    disabled={productoEnPedido.cantidad <= 0}
                                >
                                    -
                                </button>

                                <span className="mx-2">{productoEnPedido.cantidad} u</span>

                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => AnadirProductoAlPedido(producto.id_postre, 1)}
                                    disabled={unidadesRestantes <= 0}
                                >
                                    +
                                </button>
                            </>
                        ) : (
                            <button
                                className="btn btn-primary ms-3"
                                onClick={() => AnadirProductoAlPedido(producto.id_postre, 1)}
                                disabled={unidadesRestantes <= 0}
                            >
                                Añadir
                            </button>
                        )
                    )}

                </div>
            </div>
        </div>
    );
};

export { ProductDetail };
