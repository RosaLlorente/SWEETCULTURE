import db from '../db.js';

export const addUser = (req, res) => {
    const {
        Nombre,
        Apellidos,
        Telefono,
        FechaNacimiento,
        Email,
        Password,
        Informacion_publica,
        fecha_registro
    } = req.body;

    const imagen = req.file ? req.file.path : null; 
    const imagenPublicId = req.file ? req.file.filename : null;

    db.query(
        `INSERT INTO USUARIOS 
        (nombre, apellidos, telefono, fecha_nacimiento, imagen, imagen_public_id, email, contrasena, informacion_publica, fecha_registro)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            Nombre,
            Apellidos,
            Telefono,
            FechaNacimiento,
            imagen,
            imagenPublicId,
            Email,
            Password,
            Informacion_publica,
            fecha_registro
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al añadir el usuario");
            }
            res.status(200).send("Usuario añadido correctamente");
        }
    );
};

export const searchUser = (req, res) => {
 const {
        email,
        contrasena,
    } = req.body;

    db.query(
        "SELECT id_usuario, nombre, apellidos, telefono, fecha_nacimiento, imagen, imagen_public_id, email, contrasena, informacion_publica, rol FROM USUARIOS WHERE email = ? AND contrasena = ?",
        [
            email,
            contrasena,
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al loguear al usuario");
            }
            if (result.length === 0) {
                return res.status(401).send("Email o contraseña incorrectos");
            }
            res.status(200).send({usuario: result[0],});
        }
    );
}

export const updateUser = (req, res) => {
    const { id_usuario } = req.params;
    const { nombre, apellidos, telefono, email, contrasena, informacion_publica, fecha_nacimiento } = req.body;

    // Obtener public_id de la imagen anterior
    db.query("SELECT imagen_public_id FROM USUARIOS WHERE id_usuario = ?", [id_usuario], (err, results) => {
        if (err) return res.status(500).send("Error al buscar usuario");
        if (!results.length) return res.status(404).send("Usuario no encontrado");

        const oldPublicId = results[0].imagen_public_id;

        const updateUserInDb = (imagen = null, newPublicId = null) => {
            let query;
            let params;

            if (imagen) {
                // Si hay nueva imagen
                query = "UPDATE USUARIOS SET nombre=?, imagen=?, imagen_public_id=?, apellidos=?, telefono=?, email=?, contrasena=?, fecha_nacimiento=?, informacion_publica=? WHERE id_usuario=?";
                params = [nombre, imagen, newPublicId, apellidos, telefono, email, contrasena, fecha_nacimiento, informacion_publica, id_usuario];
            } else {
                // Solo datos
                query = "UPDATE USUARIOS SET nombre=?, apellidos=?, telefono=?, email=?, contrasena=?, fecha_nacimiento=?, informacion_publica=? WHERE id_usuario=?";
                params = [nombre, apellidos, telefono, email, contrasena, fecha_nacimiento, informacion_publica, id_usuario];
            }

            db.query(query, params, (err) => {
                if (err) return res.status(500).send("Error al actualizar el usuario");

                // Traer el usuario actualizado
                db.query("SELECT * FROM USUARIOS WHERE id_usuario = ?", [id_usuario], (err, results) => {
                    if (err) return res.status(500).send("Error al traer usuario actualizado");
                    res.status(200).send({ usuario: results[0] });
                });
            });
        };

        if (req.file) {
            const filePath = req.file.path; // archivo temporal
            const folder = "ProfileUserImage"; // forzar carpeta de perfil
            const oldPublicId = usuario.oldPublicId; // public_id de la imagen anterior

            updateImage(filePath, folder, oldPublicId, (result) => {
                if (result) {
                    updateUserInDb(result.secure_url, result.public_id); // guardar URL y public_id
                } else {
                    console.error("Error subiendo imagen");
                }
            });
        } else {
            updateUserInDb(); // solo actualiza otros campos
        }
    });
};




export const getTopRatingedUsers = (req, res) => {
    const sql = `
        SELECT 
            u.id_usuario,
            u.nombre,
            u.apellidos,
            u.imagen,
            r.ranking_general,
            r.total_compras
        FROM RANKING_USUARIOS r
        INNER JOIN USUARIOS u ON u.id_usuario = r.id_usuario
        WHERE u.informacion_publica = TRUE
        ORDER BY r.ranking_general DESC
        LIMIT 5
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Error al cargar el ranking usuario:", err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result);
    });
};
