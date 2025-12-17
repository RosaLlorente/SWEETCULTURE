import db from '../db.js'; // Archivo donde exportas tu conexión a MySQL

export const addRatingProduct = (req, res) => {
    const { 
        id_usuario,id_postre,comentario,puntuacion,fecha_valoracion
    } = req.body;


    db.query(
        "INSERT INTO VALORACIONES_POSTRES (id_usuario,id_postre,comentario,puntuacion,fecha_valoracion) VALUES (?,?,?,?,?)",
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
export const getRatingsProduct = (req, res) => {
    db.query(`SELECT 
            vp.*, 
            u.nombre AS nombre_usuario, 
            u.imagen AS imagen_usuario,
            p.nombre AS nombre_postre,
            p.imagen AS imagen_postre
        FROM VALORACIONES_POSTRES vp
        INNER JOIN USUARIOS u ON vp.id_usuario = u.id_usuario
        INNER JOIN POSTRES p ON vp.id_postre = p.id_postre`, 
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
export const getMeanRatingProduct = (req, res) => {
    const { id_postre } = req.params;
    db.query(
        "SELECT AVG(puntuacion) AS promedio FROM VALORACIONES_POSTRES WHERE id_postre = ?",
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
export const getTopRatingedProducts = (req, res) => {
    db.query(
        `SELECT p.*, AVG(vp.puntuacion) AS promedio
            FROM postres p
            JOIN VALORACIONES_POSTRES vp ON p.id_postre = vp.id_postre
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
