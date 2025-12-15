const db = require('../db'); // Archivo donde exportas tu conexión a MySQL

const addRatingProduct = (req, res) => {
    const { 
        id_usuario,id_postre,comentario,puntuacion,fecha_valoracion
    } = req.body;


    db.query(
        "INSERT INTO valoraciones_postres (id_usuario,id_postre,comentario,puntuacion,fecha_valoracion) VALUES (?,?,?,?,?)",
        [
            id_usuario,id_postre,comentario,puntuacion,fecha_valoracion
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al añadir valoración");
            }
            res.status(200).send("Valoración añadida correctamente");
        }
    );
};

/**
 * Est
 * @param {*} req 
 * @param {*} res 
 */
const getRatingsProduct = (req, res) => {
    db.query(`SELECT 
            vp.*, 
            u.nombre AS nombre_usuario, 
            u.imagen AS imagen_usuario,
            p.nombre AS nombre_postre,
            p.imagen AS imagen_postre
        FROM valoraciones_postres vp
        INNER JOIN usuarios u ON vp.id_usuario = u.id_usuario
        INNER JOIN postres p ON vp.id_postre = p.id_postre`, 
        (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al obtener las valoraciones de servicio");
        }
        res.status(200).json(results);
    });
};

/**
 * Obtener la valoración promedio de un producto específico
 * @param {*} req 
 * @param {*} res 
 */
const getMeanRatingProduct = (req, res) => {
    const { id_postre } = req.params;
    db.query(
        "SELECT AVG(puntuacion) AS promedio FROM valoraciones_postres WHERE id_postre = ?",
        [id_postre],
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al obtener la valoración promedio");
            }
            res.status(200).json(results[0]);
        }
    );
};

/** Obtener los productos mejor valorados
 * @param {*} req 
 * @param {*} res 
 */
const getTopRatingedProducts = (req, res) => {
    db.query(
        `SELECT p.*, AVG(vp.puntuacion) AS promedio
            FROM postres p
            JOIN valoraciones_postres vp ON p.id_postre = vp.id_postre
            GROUP BY p.id_postre
            ORDER BY promedio DESC
            LIMIT 5`,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al obtener los productos mejor valorados");
            }
            res.status(200).json(results);
        }
    );
};

module.exports = {addRatingProduct, getRatingsProduct, getMeanRatingProduct, getTopRatingedProducts};