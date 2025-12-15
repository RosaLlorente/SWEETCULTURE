const db = require('../db'); // Archivo donde exportas tu conexión a MySQL
const fs = require("fs");
const path = require("path");

// Añadir un producto
const addProduct = (req, res) => {
    const { 
        nombre, origen, precio, etiqueta_especial, descripcion, ingredientes,
        disponible, ser_visible, unidades, tiempo_preparacion_minutos,
        tiempo_horneado_minutos, capacidad_horneado, fecha_creacion 
    } = req.body;

    const imagen = req.file ? req.file.filename : "";

    db.query(
        "INSERT INTO postres (nombre, origen, precio, etiqueta_especial, imagen, descripcion, ingredientes, disponible, ser_visible, unidades, tiempo_preparacion_minutos, tiempo_horneado_minutos, capacidad_horneado, fecha_creacion) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
            nombre, origen, precio, etiqueta_especial, imagen, descripcion, ingredientes,
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

const getProducts = (req, res) => {
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


const optionSearchProducts = (req, res) => {

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


const optionSearchProductsAdmin = (req, res) => {

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
const searchProduct = (req, res) => {
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




const updateProduct = (req, res) => {
    const { id_postre } = req.params;
    const { nombre, origen, precio, etiqueta_especial, descripcion, ingredientes,
        disponible, ser_visible, unidades, tiempo_preparacion_minutos,
        tiempo_horneado_minutos, capacidad_horneado } = req.body;

    const newImagen = req.file ? req.file.filename : null;

    // 1️⃣ Obtener imagen antigua
    db.query("SELECT imagen FROM postres WHERE id_postre = ?", [id_postre], (err, result) => {
        if (err) return res.status(500).send("Error al obtener el producto");
        if (result.length === 0) return res.status(404).send("Producto no encontrado");

        const oldImagen = result[0].imagen;
        const oldImagenPath = oldImagen ? path.join(__dirname, "../../../client/public/ProductImage", oldImagen) : null;

        // 2️⃣ Construir query y valores según si hay nueva imagen
        const query = newImagen
            ? "UPDATE postres SET nombre=?, origen=?, precio=?, etiqueta_especial=?, imagen=?, descripcion=?, ingredientes=?, disponible=?, ser_visible=?, unidades=?, tiempo_preparacion_minutos=?, tiempo_horneado_minutos=?, capacidad_horneado=? WHERE id_postre=?"
            : "UPDATE postres SET nombre=?, origen=?, precio=?, etiqueta_especial=?, descripcion=?, ingredientes=?, disponible=?, ser_visible=?, unidades=?, tiempo_preparacion_minutos=?, tiempo_horneado_minutos=?, capacidad_horneado=? WHERE id_postre=?";

        const values = newImagen
            ? [nombre, origen, precio, etiqueta_especial, newImagen, descripcion, ingredientes, disponible, ser_visible, unidades, tiempo_preparacion_minutos, tiempo_horneado_minutos, capacidad_horneado, id_postre]
            : [nombre, origen, precio, etiqueta_especial, descripcion, ingredientes, disponible, ser_visible, unidades, tiempo_preparacion_minutos, tiempo_horneado_minutos, capacidad_horneado, id_postre];

        // 3️⃣ Ejecutar update
        db.query(query, values, (err2) => {
            if (err2) return res.status(500).send("Error al actualizar el producto");

            // 4️⃣ Borrar imagen antigua solo si se subió nueva
            if (newImagen && oldImagenPath && fs.existsSync(oldImagenPath)) {
                fs.unlink(oldImagenPath, (err3) => {
                    if (err3) console.log("⚠ No se pudo eliminar la imagen antigua:", err3);
                });
            }

            // 5️⃣ Enviar respuesta
            return res.status(200).send("Producto actualizado correctamente");
        });
    });
};

// Eliminar producto
const deleteProduct = (req, res) => {
    const { id_postre } = req.params;
    db.query("SELECT imagen FROM postres WHERE id_postre = ?", [id_postre], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al obtener el producto");
        }

        if (result.length === 0) {
            return res.status(404).send("Producto no encontrado");
        }

        const imagenName = result[0].imagen;
        const imagenPath = path.join(
            __dirname,
            "../../../client/public/ProductImage",
            imagenName
        );

        // 2️⃣ Eliminar primero las tablas que dependen estrictamente de POSTRES
        db.query("DELETE FROM DETALLE_PEDIDO WHERE id_postre = ?", [id_postre], (err1) => {
            if (err1) return res.status(500).send("Error al eliminar detalles de pedidos");

            db.query("DELETE FROM VALORACIONES_POSTRES WHERE id_postre = ?", [id_postre], (err2) => {
                if (err2) return res.status(500).send("Error al eliminar valoraciones");

                db.query("DELETE FROM OFERTAS WHERE id_postre = ?", [id_postre], (err3) => {
                    if (err3) return res.status(500).send("Error al eliminar ofertas");

                    db.query("DELETE FROM RANKING_POSTRES WHERE id_postre = ?", [id_postre], (err4) => {
                        if (err4) return res.status(500).send("Error al eliminar ranking");

                        db.query("DELETE FROM POSTRES_MAS_VENDIDOS WHERE id_postre = ?", [id_postre], (err5) => {
                            if (err5) return res.status(500).send("Error al eliminar postres más vendidos");

                            // 3️⃣ Finalmente eliminar el POSTRE
                            db.query("DELETE FROM POSTRES WHERE id_postre = ?", [id_postre], (err6) => {
                                if (err6) return res.status(500).send("Error al eliminar el producto");

                                // 4️⃣ Eliminar la imagen del servidor
                                fs.unlink(imagenPath, (errImg) => {
                                    if (errImg) {
                                        console.log("⚠ No se pudo eliminar la imagen (puede no existir):", errImg);
                                    }

                                    return res.status(200).send("Producto e imagen eliminados correctamente");
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

module.exports = { addProduct, getProducts, updateProduct, deleteProduct, optionSearchProducts, optionSearchProductsAdmin, searchProduct};
