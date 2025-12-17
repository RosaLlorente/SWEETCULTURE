import db from '../db.js'; // Archivo donde exportas tu conexión a MySQL

export const addRating = (req, res) => {
    const { 
        id_usuario,comentario,puntuacion,fecha_valoracion
    } = req.body;


    db.query(
        "INSERT INTO VALORACIONES_SERVICIO (id_usuario,comentario,puntuacion,fecha_valoracion) VALUES (?,?,?,?)",
        [
            id_usuario,comentario,puntuacion,fecha_valoracion
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

export const getRatingsServices = (req, res) => {
    db.query(`SELECT vs.*, u.nombre, u.imagen FROM VALORACIONES_SERVICIO vs INNER JOIN USUARIOS u ON vs.id_usuario = u.id_usuario`, 
        (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al obtener las valoraciones de servicio");
        }
        res.status(200).json(results);
    });
};
