import db from '../db.js'; // Archivo donde exportas tu conexión a MySQL
import fs from "fs";
import path from "path";
import { updateImage } from "../../Multerconfing/cloudinary.js";


// Añadir un producto
export const addProduct = (req, res) => {
    const { 
        nombre, origen, precio, etiqueta_especial, descripcion, ingredientes,
        disponible, ser_visible, unidades, tiempo_preparacion_minutos,
        tiempo_horneado_minutos, capacidad_horneado, fecha_creacion 
    } = req.body;

    const imagen = req.file ? req.file.path : null; 
    const imagen_public_id = req.file ? req.file.filename : null;

    db.query(
        "INSERT INTO postres (nombre, origen, precio, etiqueta_especial, imagen,imagen_public_id, descripcion, ingredientes, disponible, ser_visible, unidades, tiempo_preparacion_minutos, tiempo_horneado_minutos, capacidad_horneado, fecha_creacion) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
            nombre, origen, precio, etiqueta_especial, imagen,imagen_public_id, descripcion, ingredientes,
            disponible, ser_visible, unidades, tiempo_preparacion_minutos,
            tiempo_horneado_minutos, capacidad_horneado, fecha_creacion
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al añadir el producto");
            }
            res.status(200).send("Producto añadido correctamente");
        }
    );
};

export const getProducts = (req, res) => {
    const sql = `
        SELECT p.*, o.id_oferta, o.nombre AS oferta_nombre, o.tipo, o.valor
        FROM postres p
        LEFT JOIN ofertas o 
            ON p.id_postre = o.id_postre
            AND o.ser_visible = TRUE
            AND CURDATE() BETWEEN o.fecha_inicio AND o.fecha_fin
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener los productos con ofertas");
        }
        res.send(result);
    });
};


export const optionSearchProducts = (req, res) => {

    // 1️⃣ Paises únicos de productos visibles
    db.query("SELECT DISTINCT origen FROM postres WHERE ser_visible = 1", (err, paisesResult) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al obtener países");
        }

        // 2️⃣ Temporadas únicas de productos
        db.query("SELECT DISTINCT etiqueta_especial FROM postres", (err2, temporadasResult) => {
            if (err2) {
                console.log(err2);
                return res.status(500).send("Error al obtener temporadas");
            }

            // 3️⃣ Ingredientes únicos de productos visibles
            db.query("SELECT ingredientes FROM postres WHERE ser_visible = 1", (err3, ingredientesResult) => {
                if (err3) {
                    console.log(err3);
                    return res.status(500).send("Error al obtener ingredientes");
                }

                // Crear lista única de ingredientes
                const ingredientesSet = new Set();
                ingredientesResult.forEach(p => {
                    if (p.ingredientes) {
                        p.ingredientes.split(",").forEach(i => ingredientesSet.add(i.trim()));
                    }
                });
                const ingredientes = Array.from(ingredientesSet);

                // Enviar todos los resultados
                res.send({
                    paises: paisesResult.map(p => p.origen),
                    temporadas: temporadasResult.map(p => p.etiqueta_especial),
                    ingredientes,
                    consoleLog: "Llegó a optionSearchProducts"
                });
            });
        });
    });
};


export const optionSearchProductsAdmin = (req, res) => {

    // 1️⃣ Paises únicos de productos
    db.query("SELECT DISTINCT origen FROM postres", (err, paisesResult) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al obtener países");
        }

        // 2️⃣ Temporadas únicas de productos
        db.query("SELECT DISTINCT etiqueta_especial FROM postres", (err2, temporadasResult) => {
            if (err2) {
                console.log(err2);
                return res.status(500).send("Error al obtener temporadas");
            }

            // 3️⃣ Ingredientes únicos de productos
            db.query("SELECT ingredientes FROM postres", (err3, ingredientesResult) => {
                if (err3) {
                    console.log(err3);
                    return res.status(500).send("Error al obtener ingredientes");
                }

                // Crear lista única de ingredientes
                const ingredientesSet = new Set();
                ingredientesResult.forEach(p => {
                    if (p.ingredientes) {
                        p.ingredientes.split(",").forEach(i => ingredientesSet.add(i.trim()));
                    }
                });

                const ingredientes = Array.from(ingredientesSet);

                // Enviar todos los resultados
                res.send({
                    paises: paisesResult.map(p => p.origen),
                    temporadas: temporadasResult.map(p => p.etiqueta_especial),
                    ingredientes,
                    consoleLog: "Llegó a optionSearchProducts"
                });
            });
        });
    });
};



// Buscar productos según filtros
export const searchProduct = (req, res) => {
    const {id_postre, nombre, precioMaximo, pais, ingredientesExcluir,etiquetaEspecial } = req.body;

    // Consulta base
    let query = "SELECT * FROM postres WHERE 1=1";
    const params = [];

     if (id_postre) {
        query += " AND id_postre = ?";
        params.push(Number(id_postre));
    }

    if (nombre) {
        query += " AND nombre LIKE ?";
        params.push(`%${nombre}%`);
    }

    if (precioMaximo) {
        query += " AND precio <= ?";
        params.push(precioMaximo);
    }

    if (pais) {
        query += " AND origen = ?";
        params.push(pais);
    }

    if (ingredientesExcluir && ingredientesExcluir.length) {
        ingredientesExcluir.forEach(ingrediente => {
            query += " AND ingredientes NOT LIKE ?";
            params.push(`%${ingrediente}%`);
        });
    }

    if (etiquetaEspecial) {
        query += " AND etiqueta_especial = ?";
        params.push(etiquetaEspecial);
    }

    db.query(query, params, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al buscar productos");
        }
        res.send(result); 
    });
};




export const updateProduct = (req, res) => {
    const { id_postre } = req.params;
    const {
        nombre, origen, precio, etiqueta_especial, descripcion, ingredientes,
        disponible, ser_visible, unidades, tiempo_preparacion_minutos,
        tiempo_horneado_minutos, capacidad_horneado
    } = req.body;

    // 1️⃣ Obtener imagen antigua
    db.query("SELECT imagen_public_id FROM postres WHERE id_postre = ?", [id_postre], (err, result) => {
        if (err) return res.status(500).send("Error al obtener el producto");
        if (result.length === 0) return res.status(404).send("Producto no encontrado");

        const oldPublicId = result[0].imagen_public_id;

        // 2️⃣ Función para actualizar producto en DB
        const updateProductInDb = (imagen = null, newPublicId = null) => {
            let query;
            let values;

            if (imagen) {
                query = `
                    UPDATE postres SET 
                        nombre=?, origen=?, precio=?, etiqueta_especial=?, imagen=?, imagen_public_id=?,
                        descripcion=?, ingredientes=?, disponible=?, ser_visible=?, 
                        unidades=?, tiempo_preparacion_minutos=?, tiempo_horneado_minutos=?, 
                        capacidad_horneado=? 
                    WHERE id_postre=?`;
                values = [
                    nombre, origen, precio, etiqueta_especial, imagen, newPublicId,
                    descripcion, ingredientes, disponible, ser_visible,
                    unidades, tiempo_preparacion_minutos, tiempo_horneado_minutos,
                    capacidad_horneado, id_postre
                ];
            } else {
                query = `
                    UPDATE postres SET 
                        nombre=?, origen=?, precio=?, etiqueta_especial=?, 
                        descripcion=?, ingredientes=?, disponible=?, ser_visible=?, 
                        unidades=?, tiempo_preparacion_minutos=?, tiempo_horneado_minutos=?, 
                        capacidad_horneado=? 
                    WHERE id_postre=?`;
                values = [
                    nombre, origen, precio, etiqueta_especial,
                    descripcion, ingredientes, disponible, ser_visible,
                    unidades, tiempo_preparacion_minutos, tiempo_horneado_minutos,
                    capacidad_horneado, id_postre
                ];
            }

            db.query(query, values, (err2) => {
                if (err2) return res.status(500).send("Error al actualizar el producto");

                // Traer producto actualizado
                db.query("SELECT * FROM postres WHERE id_postre = ?", [id_postre], (err3, results) => {
                    if (err3) return res.status(500).send("Error al traer producto actualizado");
                    res.status(200).send({ producto: results[0] });
                });
            });
        };

        if (req.file) {
            updateImage(req.file.path, "ProductImage", oldPublicId, function(uploadResult) {
                if (!uploadResult) {
                return res.status(500).send("Error al subir la imagen");
                }

                const imagen = uploadResult.secure_url;
                const newPublicId = uploadResult.public_id;
                updateProductInDb(imagen, newPublicId);
            });
        } else {
            updateProductInDb();
        }
    });
};

// Eliminar producto
export const deleteProduct = (req, res) => {
    const id_postre = Number(req.params.id_postre);
    if (isNaN(id_postre)) return res.status(400).send("ID inválido");
    
    console.log("Intentando eliminar producto:", id_postre);

    db.query("SELECT id_postre FROM postres WHERE id_postre = ?", [id_postre], (err, result) => {
        if (err) { console.error(err); return res.status(500).send("Error al obtener el producto"); }
        if (result.length === 0) return res.status(404).send("Producto no encontrado");

        db.query("DELETE FROM DETALLE_PEDIDO WHERE id_postre = ?", [id_postre], (err1) => {
            if (err1) { console.error("Error DETALLE_PEDIDO:", err1); return res.status(500).send("Error al eliminar detalles de pedidos"); }

            db.query("DELETE FROM VALORACIONES_POSTRES WHERE id_postre = ?", [id_postre], (err2) => {
                if (err2) { console.error("Error VALORACIONES_POSTRES:", err2); return res.status(500).send("Error al eliminar valoraciones"); }

                db.query("DELETE FROM OFERTAS WHERE id_postre = ?", [id_postre], (err3) => {
                    if (err3) { console.error("Error OFERTAS:", err3); return res.status(500).send("Error al eliminar ofertas"); }

                    db.query("DELETE FROM POSTRES_MAS_VENDIDOS WHERE id_postre = ?", [id_postre], (err5) => {
                        if (err5) { console.error("Error POSTRES_MAS_VENDIDOS:", err5); return res.status(500).send("Error al eliminar postres más vendidos"); }

                        db.query("DELETE FROM POSTRES WHERE id_postre = ?", [id_postre], (err6) => {
                            if (err6) { console.error("Error POSTRES:", err6); return res.status(500).send("Error al eliminar el producto"); }

                            console.log("Producto eliminado correctamente:", id_postre);
                            return res.status(200).send("Producto eliminado correctamente");
                        });
                    });
                });
            });
        });
    });
};



