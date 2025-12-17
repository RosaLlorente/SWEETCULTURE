import { useState, useEffect,useContext } from "react";
import { AuthContext } from "../main_components/AuthContext.jsx";
import axios from "axios";


const MyOrderUtils = () => {
    //Lógica y funciones para MyOrder   
    const API_URL= process.env.REACT_APP_API_URL;
    const [pendingAdd, setPendingAdd] = useState(null); // { id_postre, cantidad }
    const [miPedido, setMiPedido] = useState(null);
    const  { usuario } = useContext(AuthContext);


    const BucarPedidoActual = () => {
        const id_usuario = usuario.id_usuario;
        axios.get(`${API_URL}/getCurrentOrder/${id_usuario}`)
        .then(res => setMiPedido(res.data ? res.data : null))
        .catch(() => 
            {
                console.log("No se encontró un pedido activo para este usuario");
                setMiPedido(null);
            }
        );
    }

    useEffect(() => {
        if (miPedido && pendingAdd) {
            const { id_postre, cantidad } = pendingAdd;

            axios.post(`${API_URL}/addItemToOrder`, {
                id_pedido: miPedido.id_pedido,
                id_postre,
                cantidad,
            })
            .then(() => {
                BucarPedidoActual();
                console.log("Producto añadido al pedido después de crear el pedido");
            })
            .catch((err) => {
                console.error("Error al añadir el producto al pedido:", err);
            });

            // Limpiar el pendingAdd
            setPendingAdd(null);
        }
    }, [miPedido, pendingAdd]);

    const NewOrder = () => {
        axios.post(`${API_URL}/newOrder`, {
            id_usuario: usuario.id_usuario,
            estado: "en_pedido",
        })
        .then(() => {
            const reult = BucarPedidoActual();
            setMiPedido(reult);
            console.log("Nuevo pedido creado");
        })
        .catch((err) => {
            console.error("Error al crear un nuevo pedido:", err);
        });
    }

    const AnadirProductoAlPedido = (id_postre, cantidad) => {
        if (!miPedido)
        {
            setPendingAdd({ id_postre, cantidad });
            NewOrder();
            return;
        }
        axios.post(`${API_URL}/addItemToOrder`, {
            id_pedido: miPedido.id_pedido,
            id_postre: id_postre,
            cantidad: cantidad,
        })
        .then(() => {
            BucarPedidoActual();
            console.log("Producto añadido al pedido");
        })
        .catch((err) => {
            console.error("Error al añadir el producto al pedido:", err);
        });
    }

    const EliminarProductoAlPedido = (id_postre,cantidad) => {
        if (!miPedido) return;
        axios.post(`${API_URL}/removeItemFromOrder`, {
            id_pedido: miPedido.id_pedido,
            id_postre: id_postre,
            cantidad: cantidad,
        })
        .then(() => {
            BucarPedidoActual();
            console.log("Producto eliminado del pedido");
        })
        .catch((err) => {
            console.error("Error al eliminar el producto del pedido:", err);
        });
    }

    const getOrderDetailsEspecificProduct = (id_pedido, id_postre, setProductoEnPedido) => {
        if (!id_pedido || !id_postre) {
            setProductoEnPedido(null);
            return;
        }

        axios
            .get(`${API_URL}/getOrderDetailsEspecificProduct/${id_pedido}/${id_postre}`)
            .then(res => {
                if (res.data.length > 0) {
                    console.log("Producto encontrado en el pedido:", res.data[0]);
                    setProductoEnPedido(res.data[0]);
                } else {
                    console.log("Producto NO está en el pedido");
                    setProductoEnPedido(null);
                }
            })
            .catch(err => {
                console.error("Error al buscar el producto del pedido:", err);
                setProductoEnPedido(null);
            });
    };
    const DoOrder = (id_pedido) => {
        if (!miPedido || !id_pedido) return;

        // 1️⃣ Crear snapshot de los productos del pedido
        const postresSnapshot = miPedido.detalle?.map(item => ({
            id_postre: item.id_postre,
            nombre: item.nombre_postre || `Postre #${item.id_postre}`,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            subtotal: item.subtotal
        }));

        // 2️⃣ Insertar en historial
        axios.post(`${API_URL}/addToHistorial`, {
            id_pedido: miPedido.id_pedido,
            id_usuario: usuario.id_usuario,
            total: miPedido.total,
            postres: JSON.stringify(postresSnapshot),
            estado: "pendiente"
        })
        .then(() => {
            console.log("Pedido agregado al historial");

            // 3️⃣ Cambiar estado del pedido actual
            axios.post(`${API_URL}/updateOrderStatus`, {
                id_pedido: miPedido.id_pedido,
                estado: "pendiente"
            })
            .then(() => {
                BucarPedidoActual();
                console.log("Pedido realizado correctamente");
            })
            .catch(err => {
                console.error("Error al cambiar estado del pedido:", err);
            });
        })
        .catch(err => {
            console.error("Error al agregar al historial:", err);
        });
    };

    const CancelOrder = (id_pedido) => {
        if (!miPedido || !id_pedido) return;

        axios.delete(`${API_URL}/deleteOrder`, { data: { id_pedido } })
        .then(() => {
            BucarPedidoActual();
            console.log("Pedido cancelado correctamente");
        })
        .catch(err => {
            console.error("Error al cancelar el pedido:", err);
        });
    };
    //Buscar el pedido actual del usuario

     useEffect(() => {
        if (usuario?.id_usuario) BucarPedidoActual();
    }, [usuario]);

    return {
        miPedido,
        NewOrder,
        AnadirProductoAlPedido,
        EliminarProductoAlPedido,
        getOrderDetailsEspecificProduct,
        DoOrder,
        CancelOrder
    };
    

};

export {MyOrderUtils};