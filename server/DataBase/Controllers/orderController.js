import db from '../db.js'; // Archivo donde exportas tu conexión a MySQL

export const newOrder =(req, res) => {
    const { id_usuario } = req.body;
    console.log("id_usuario recibido:", id_usuario);
    // Crear un nuevo pedido con estado "en_pedido"
    db.query(
        'INSERT INTO PEDIDOS (id_usuario, estado) VALUES (?, "en_pedido")',
        [id_usuario],
        (err, result) => {
            if (err) {
                console.error('Error al crear un nuevo pedido:', err);
                return res.status(500).json({ error: 'Error del servidor' });
            }
            res.status(201).json({ message: 'Pedido creado exitosamente', id_pedido: result.insertId });
        }
    );
}

export const getCurrentOrder = (req, res) => {
    const { id_usuario } = req.params;

    db.query(
        'SELECT * FROM PEDIDOS WHERE id_usuario = ? AND estado = "en_pedido" LIMIT 1',
        [id_usuario],
        (err, results) => {
            if (err) {
                console.error('Error al obtener el pedido actual:', err);
                return res.status(500).json({ error: 'Error del servidor' });
            }
            if (results.length === 0) {
                return res.json(null);
            }
            const pedido = results[0];
            // Obtener los detalles del pedido
            db.query(
                'SELECT * FROM DETALLE_PEDIDO WHERE id_pedido = ?',
                [pedido.id_pedido],
                (err, detalleResults) => {
                    if (err) {
                        console.error('Error al obtener los detalles del pedido:', err);
                        return res.status(500).json({ error: 'Error del servidor' });
                    }
                    pedido.detalle = detalleResults;
                    res.json(pedido);
                }
            );
        }
    );
}

export const addItemToOrder = (req, res) => {
    const { id_pedido, id_postre, cantidad } = req.body;

    db.query('SELECT id_usuario FROM PEDIDOS WHERE id_pedido = ?', [id_pedido], (err, pedidoResult) => {
        if (err) return res.status(500).json({ error: 'Error al buscar el pedido' });
        if (pedidoResult.length === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
        const id_usuario = pedidoResult[0].id_usuario;

        db.query('SELECT * FROM DETALLE_PEDIDO WHERE id_pedido = ? AND id_postre = ?', [id_pedido, id_postre], (err, detalleResult) => {
            if (err) return res.status(500).json({ error: 'Error al buscar el detalle del pedido' });

            db.query('SELECT precio FROM POSTRES WHERE id_postre = ?', [id_postre], (err, postreResult) => {
                if (err) return res.status(500).json({ error: 'Error al buscar el postre' });
                if (postreResult.length === 0) return res.status(404).json({ error: 'Postre no encontrado' });
                let precio_unitario = postreResult[0].precio;

                db.query(
                    'SELECT * FROM OFERTAS WHERE id_postre = ? AND ser_visible = TRUE AND CURDATE() BETWEEN fecha_inicio AND fecha_fin',
                    [id_postre],
                    (err, ofertaResult) => {
                        if (err) return res.status(500).json({ error: 'Error al buscar la oferta' });

                        // Si ya existe, sumamos la cantidad
                        let cantidad_final = cantidad;
                        if (detalleResult.length > 0) {
                            cantidad_final = detalleResult[0].cantidad + cantidad;
                        }

                        let subtotal = precio_unitario * cantidad_final;
                        if (ofertaResult.length > 0) {
                            const oferta = ofertaResult[0];
                            switch (oferta.tipo) {
                                case 'descuento':
                                    subtotal = subtotal * (1 - oferta.valor / 100);
                                    break;
                                case '2x1':
                                    subtotal = precio_unitario * Math.ceil(cantidad_final / 2);
                                    break;
                                case '3x2':
                                    subtotal = precio_unitario * (cantidad_final - Math.floor(cantidad_final / 3));
                                    break;
                            }
                        }

                        db.query(
                            'SELECT porcentaje, tipo_descuento FROM DESCUENTOS WHERE id_usuario = ? AND estado = "activo" AND CURDATE() BETWEEN fecha_inicio AND fecha_fin',
                            [id_usuario],
                            (err, descuentoResult) => {
                                if (err) return res.status(500).json({ error: 'Error al buscar el descuento' });
                                let tipo_descuento = null;
                                if (descuentoResult.length > 0) {
                                    subtotal = subtotal * (1 - descuentoResult[0].porcentaje / 100);
                                    tipo_descuento = descuentoResult[0].tipo_descuento;
                                }

                                const updatePedidoTotal = () => {
                                    db.query(
                                        'UPDATE PEDIDOS SET total = (SELECT IFNULL(SUM(subtotal),0) FROM DETALLE_PEDIDO WHERE id_pedido = ?) WHERE id_pedido = ?',
                                        [id_pedido, id_pedido],
                                        (err) => {
                                            if (err) return res.status(500).json({ error: 'Error al actualizar el total del pedido' });
                                        }
                                    );
                                };

                                if (detalleResult.length === 0) {
                                    db.query(
                                        'INSERT INTO DETALLE_PEDIDO (id_pedido, id_postre, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                                        [id_pedido, id_postre, cantidad_final, precio_unitario, subtotal],
                                        (err, insertResult) => {
                                            if (err) return res.status(500).json({ error: 'Error al insertar el detalle' });
                                            db.query(
                                                'UPDATE POSTRES SET unidades = unidades - ? WHERE id_postre = ?',
                                                [cantidad, id_postre],
                                                (err) => {
                                                    if (err) console.error('Error al actualizar stock del postre:', err);
                                                }
                                            );
                                            updatePedidoTotal();
                                            return res.json({ success: true, insertId: insertResult.insertId, tipo_descuento });
                                        }
                                    );
                                } else {
                                    db.query(
                                        'UPDATE DETALLE_PEDIDO SET cantidad = ?, precio_unitario = ?, subtotal = ? WHERE id_detalle = ?',
                                        [cantidad_final, precio_unitario, subtotal, detalleResult[0].id_detalle],
                                        (err, updateResult) => {
                                            if (err) return res.status(500).json({ error: 'Error al actualizar el detalle' });
                                            db.query(
                                                'UPDATE POSTRES SET unidades = unidades - ? WHERE id_postre = ?',
                                                [cantidad, id_postre],
                                                (err) => {
                                                    if (err) console.error('Error al actualizar stock del postre:', err);
                                                }
                                            );
                                            updatePedidoTotal();
                                            return res.json({ success: true, tipo_descuento });
                                        }
                                    );
                                }
                            }
                        );
                    }
                );
            });
        });
    });
};

export const removeItemFromOrder = (req, res) => {
    const { id_pedido, id_postre, cantidad } = req.body;

    db.query(
        'SELECT * FROM DETALLE_PEDIDO WHERE id_pedido = ? AND id_postre = ?',
        [id_pedido, id_postre],
        (err, detalleResult) => {
            if (err) return res.status(500).json({ error: 'Error al buscar el detalle del pedido' });
            if (detalleResult.length === 0) return res.status(404).json({ error: 'Producto no encontrado en el pedido' });

            const cantidad_actual = detalleResult[0].cantidad;
            const nueva_cantidad = cantidad_actual - cantidad;
            const updatePedidoTotal = () => {
                db.query(
                    'UPDATE PEDIDOS SET total = (SELECT IFNULL(SUM(subtotal),0) FROM DETALLE_PEDIDO WHERE id_pedido = ?) WHERE id_pedido = ?',
                    [id_pedido, id_pedido],
                    (err) => {
                        if (err) return res.status(500).json({ error: 'Error al actualizar el total del pedido' });
                    }
                );
            };

            if (nueva_cantidad <= 0) {
                // Eliminar el producto del pedido
                db.query(
                    'DELETE FROM DETALLE_PEDIDO WHERE id_detalle = ?',
                    [detalleResult[0].id_detalle],
                    (err, deleteResult) => {
                        if (err) return res.status(500).json({ error: 'Error al eliminar el producto del pedido' });
                        db.query(
                            'UPDATE POSTRES SET unidades = unidades + ? WHERE id_postre = ?',
                            [cantidad, id_postre],
                            (err) => {
                                if (err) console.error('Error al restaurar stock del postre:', err);
                            }
                        );
                        updatePedidoTotal();
                        return res.json({ success: true, eliminado: true });
                    }
                );
            } else {
                // Actualizar cantidad y subtotal
                db.query(
                    'SELECT precio FROM POSTRES WHERE id_postre = ?',
                    [id_postre],
                    (err, postreResult) => {
                        if (err) return res.status(500).json({ error: 'Error al buscar el postre' });
                        if (postreResult.length === 0) return res.status(404).json({ error: 'Postre no encontrado' });
                        let precio_unitario = postreResult[0].precio;
                        let subtotal = precio_unitario * nueva_cantidad;

                        db.query(
                            'UPDATE DETALLE_PEDIDO SET cantidad = ?, subtotal = ? WHERE id_detalle = ?',
                            [nueva_cantidad, subtotal, detalleResult[0].id_detalle],
                            (err, updateResult) => {
                                if (err) return res.status(500).json({ error: 'Error al actualizar el producto del pedido' });
                                db.query(
                                    'UPDATE POSTRES SET unidades = unidades + ? WHERE id_postre = ?',
                                    [cantidad, id_postre],
                                    (err) => {
                                        if (err) console.error('Error al restaurar stock del postre:', err);
                                    }
                                );
                                updatePedidoTotal();
                                return res.json({ success: true, eliminado: false, nueva_cantidad });
                            }
                        );
                    }
                );
            }
        }
    );
};

export const updateOrderStatus = (req, res) => {
    const { id_pedido, estado } = req.body;

    db.query(
        'UPDATE PEDIDOS SET estado = ? WHERE id_pedido = ?',
        [estado, id_pedido],
        (err, result) => {
            if (err) {
                console.error('Error al actualizar el estado del pedido:', err);
                return res.status(500).json({ error: 'Error del servidor' });
            }
            res.status(200).json({ message: 'Estado del pedido actualizado exitosamente' });
        }
    );
}

//Tabla DETALLE DE PEDIDOS (POSTRES EN CADA PEDIDO)
export const getOrderDetailsEspecificProduct = (req, res) => {
    const { id_pedido,id_postre } = req.params;

    db.query(
        'SELECT * FROM DETALLE_PEDIDO WHERE id_pedido = ? and id_postre = ?',
        [id_pedido, id_postre],
        (err, results) => {
            if (err) {
                console.error('Error al obtener los detalles del producto:', err);
                return res.status(500).json({ error: 'Error del servidor' });
            }
            res.json(results);
        }
    );
}

export const deleteOrder = (req, res) => {
    const { id_pedido } = req.body;

    // 1️⃣ Obtener los detalles del pedido
    db.query('SELECT id_postre, cantidad FROM DETALLE_PEDIDO WHERE id_pedido = ?', [id_pedido], (err, detalles) => {
        if (err) {
            console.error('Error al obtener detalles del pedido:', err);
            return res.status(500).json({ error: 'Error al obtener detalles del pedido' });
        }

        // 2️⃣ Restaurar unidades de los postres uno por uno
        const restoreNext = (index) => {
            if (index >= detalles.length) {
                // 3️⃣ Borrar detalles del pedido
                db.query('DELETE FROM DETALLE_PEDIDO WHERE id_pedido = ?', [id_pedido], (err) => {
                    if (err) {
                        console.error('Error al borrar los detalles del pedido:', err);
                        return res.status(500).json({ error: 'Error al borrar los detalles del pedido' });
                    }

                    // 4️⃣ Borrar el pedido
                    db.query('DELETE FROM PEDIDOS WHERE id_pedido = ?', [id_pedido], (err) => {
                        if (err) {
                            console.error('Error al cancelar el pedido:', err);
                            return res.status(500).json({ error: 'Error al cancelar el pedido' });
                        }

                        res.status(200).json({ message: 'Pedido cancelado y unidades restauradas correctamente' });
                    });
                });
                return;
            }

            const detalle = detalles[index];
            db.query(
                'UPDATE POSTRES SET unidades = unidades + ? WHERE id_postre = ?',
                [detalle.cantidad, detalle.id_postre],
                (err) => {
                    if (err) {
                        console.error('Error al restaurar unidades del postre:', err);
                        return res.status(500).json({ error: 'Error al restaurar unidades del postre' });
                    }
                    restoreNext(index + 1); // pasar al siguiente detalle
                }
            );
        };

        restoreNext(0); // empezar desde el primer detalle
    });
};

export const addToHistorial = (req, res) => {
    const { id_pedido, id_usuario, total, postres, estado } = req.body;
    const postresArray = JSON.parse(postres);

    let procesados = 0;

    postresArray.forEach((p, index) => {

        db.query(
            'SELECT nombre, ingredientes, origen, precio, etiqueta_especial FROM POSTRES WHERE id_postre = ?',
            [p.id_postre],
            (err, postreResult) => {
                if (err) console.error('Error al buscar postre:', err);
                else if (postreResult.length > 0) {
                    p.nombre = postreResult[0].nombre;
                    p.ingredientes = postreResult[0].ingredientes;
                    p.origen = postreResult[0].origen;
                    p.precio_unitario = postreResult[0].precio;
                    p.etiqueta_especial = postreResult[0].etiqueta_especial;
                }

                db.query(
                    'SELECT * FROM OFERTAS WHERE id_postre = ? AND ser_visible = TRUE AND CURDATE() BETWEEN fecha_inicio AND fecha_fin',
                    [p.id_postre],
                    (err, ofertaResult) => {
                        if (err) console.error("Error oferta:", err);

                        if (ofertaResult.length > 0) {
                            const oferta = ofertaResult[0];
                            p.oferta = oferta.tipo === "descuento"
                                ? `${oferta.valor}%`
                                : oferta.tipo;
                        }

                        procesados++;

                        if (procesados === postresArray.length) {

                            db.query(
                                'SELECT porcentaje FROM DESCUENTOS WHERE id_usuario = ? AND estado = "activo" AND CURDATE() BETWEEN fecha_inicio AND fecha_fin',
                                [id_usuario],
                                (err, descuentoResult) => {
                                    if (err) console.error('Error descuento:', err);

                                    if (descuentoResult.length > 0) {
                                        postresArray.forEach(x => {
                                            x.descuento_usuario = `${descuentoResult[0].porcentaje}%`;
                                        });
                                    }

                                    // 1️⃣ Insertar en historial
                                    db.query(
                                        'INSERT INTO HISTORIAL_PEDIDOS (id_pedido, id_usuario, fecha_pedido, total, postres, estado) VALUES (?, ?, NOW(), ?, ?, ?)',
                                        [id_pedido, id_usuario, total, JSON.stringify(postresArray), estado],
                                        (err, result) => {
                                            if (err) {
                                                console.error('Error al insertar historial:', err);
                                                return res.status(500).json({ error: 'Error al agregar al historial' });
                                            }

                                            // 2️⃣ BORRAR detalle_pedido
                                            db.query(
                                                'DELETE FROM DETALLE_PEDIDO WHERE id_pedido = ?',
                                                [id_pedido],
                                                (err) => {
                                                    if (err) {
                                                        console.error('Error al borrar detalles:', err);
                                                        return res.status(500).json({ error: 'Historial ok, pero error al borrar detalles' });
                                                    }

                                                    // 3️⃣ BORRAR pedido
                                                    db.query(
                                                        'DELETE FROM PEDIDOS WHERE id_pedido = ?',
                                                        [id_pedido],
                                                        (err) => {
                                                            if (err) {
                                                                console.error('Error al borrar pedido:', err);
                                                                return res.status(500).json({ error: 'Historial ok, pero error al borrar pedido' });
                                                            }

                                                            // 4️⃣ Todo OK
                                                            res.status(201).json({
                                                                message: 'Pedido agregado al historial y eliminado correctamente',
                                                                id_historial: result.insertId
                                                            });
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    }
                );
            }
        );
    });
};


//Al enviar el pedido se usa HISTORIAL_PEDIDOS (Evita la perdida de datos al modificar postres)

//Gestion de historial
export const getUsersOrders = (req, res) => {
    const sql = `
        SELECT h.*, u.nombre, u.apellidos
        FROM HISTORIAL_PEDIDOS h
        JOIN USUARIOS u ON h.id_usuario = u.id_usuario
        ORDER BY h.fecha_pedido DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener el historial de pedido del usuario:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }

        results.forEach(r => {
            r.postres = safeParseJSON(r.postres);
        });

        res.json(results);
    });
};


export const getUserOrders = (req, res) => {
    const { id_usuario} = req.params;

     db.query(
        'SELECT * FROM HISTORIAL_PEDIDOS where id_usuario = ? ORDER BY fecha_pedido DESC',
        [id_usuario],
        (err, results) => {
            if (err) {
                console.error('Error al obtener el historial de pedido del usuario:', err);
                return res.status(500).json({ error: 'Error del servidor' });
            }
            results.forEach(r => {
                r.postres = safeParseJSON(r.postres);
            });

            res.json(results);
        }
    );
}

export const updateOrderHistorial = (req, res) => {
    const { id_historial, estado } = req.body;

    // 1️⃣ Actualizar estado del pedido
    db.query(
        'UPDATE HISTORIAL_PEDIDOS SET estado = ? WHERE id_historial = ?',
        [estado, id_historial],
        (err, result) => {
            if (err) {
                console.error('Error al actualizar el estado del pedido:', err);
                return res.status(500).json({ error: 'Error del servidor' });
            }

            // 2️⃣ Si el nuevo estado es "recogido", actualizar rankings
            if (estado === 'recogido') {
                db.query(
                    'SELECT id_usuario, postres FROM HISTORIAL_PEDIDOS WHERE id_historial = ?',
                    [id_historial],
                    (err2, pedidoData) => {
                        if (err2) {
                            console.error('Error al obtener datos del pedido:', err2);
                            return res.status(500).json({ error: 'Error del servidor' });
                        }

                        if (!pedidoData.length) {
                            return res.status(404).json({ error: 'Pedido no encontrado' });
                        }

                        const { id_usuario, postres } = pedidoData[0];

                        // 2a️⃣ Actualizar o insertar ranking del usuario
                        db.query(
                            `INSERT INTO RANKING_USUARIOS (id_usuario, total_compras, ranking_general)
                             VALUES (?, 1, 1)
                             ON DUPLICATE KEY UPDATE total_compras = total_compras + 1, ranking_general = ranking_general + 1`,
                            [id_usuario],
                            (err3) => {
                                if (err3) console.error('Error al actualizar ranking del usuario:', err3);
                            }
                        );

                        // 2b️⃣ Actualizar o insertar ranking de postres
                        let postresArray;
                        try {
                            postresArray = safeParseJSON(postres); // [{id_postre, cantidad,...}, ...]
                        } catch (parseErr) {
                            console.error('Error parseando postres JSON:', parseErr);
                            postresArray = [];
                        }

                        postresArray.forEach(({ id_postre, cantidad }) => {
                            db.query(
                                `INSERT INTO POSTRES_MAS_VENDIDOS (id_postre, ventas_totales)
                                 VALUES (?, ?)
                                 ON DUPLICATE KEY UPDATE ventas_totales = ventas_totales + ?`,
                                [id_postre, cantidad, cantidad],
                                (err4) => {
                                    if (err4) console.error(`Error al actualizar ranking del postre ${id_postre}:`, err4);
                                }
                            );
                        });

                        res.status(200).json({ message: 'Estado del pedido actualizado y rankings ajustados' });
                    }
                );
            } else {
                res.status(200).json({ message: 'Estado del pedido actualizado exitosamente' });
            }
        }
    );
};




export const deleteOrderHistorial = (req, res) => {
    const { id_historial } = req.params;

    // 1️⃣ Primero obtenemos el pedido para restaurar stock si hace falta
    db.query(
        'SELECT id_pedido, postres FROM HISTORIAL_PEDIDOS WHERE id_historial = ?',
        [id_historial],
        (err, results) => {
            if (err) {
                console.error('Error al buscar el historial:', err);
                return res.status(500).json({ error: 'Error del servidor' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Pedido no encontrado' });
            }

            const historial = results[0];
            const postresArray = safeParseJSON(historial.postres);


            // 2️⃣ Restaurar stock de postres
            postresArray.forEach(postre => {
                db.query(
                    'UPDATE POSTRES SET unidades = unidades + ? WHERE id_postre = ?',
                    [postre.cantidad, postre.id_postre],
                    (err) => {
                        if (err) console.error(`Error al restaurar stock del postre ${postre.nombre}:`, err);
                    }
                );
            });

            // 3️⃣ Borrar del historial
            db.query(
                'DELETE FROM HISTORIAL_PEDIDOS WHERE id_historial = ?',
                [id_historial],
                (err) => {
                    if (err) {
                        console.error('Error al eliminar el historial:', err);
                        return res.status(500).json({ error: 'Error al eliminar el pedido' });
                    }

                    res.json({ message: 'Pedido eliminado correctamente' });
                }
            );
        }
    );
};

export const searchHistorial = (req, res) => {
    const { id_historial, id_usuario, estado, nombre, apellidos } = req.body;

    let query = `
        SELECT h.*, u.nombre, u.apellidos
        FROM HISTORIAL_PEDIDOS h
        JOIN USUARIOS u ON h.id_usuario = u.id_usuario
        WHERE 1=1
    `;
    const params = [];

    if (id_historial) {
        query += " AND h.id_historial = ?";
        params.push(id_historial);
    }

    if (id_usuario) {
        query += " AND h.id_usuario = ?";
        params.push(id_usuario);
    }

    if (estado) {
        query += " AND h.estado = ?";
        params.push(estado);
    }

    if (nombre) {
        query += " AND u.nombre LIKE ?";
        params.push(`%${nombre}%`);
    }

    if (apellidos) {
        query += " AND u.apellidos LIKE ?";
        params.push(`%${apellidos}%`);
    }

    db.query(query, params, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al buscar historial");
        }
        res.send(result);
    });
};

const safeParseJSON = (value) => {
    if (!value) return [];
    if (typeof value === "object") return value;

    try {
        return JSON.parse(value);
    } catch (err) {
        console.error("Error parseando JSON:", err);
        return [];
    }
};
