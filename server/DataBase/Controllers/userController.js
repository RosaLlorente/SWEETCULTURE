const db = require('../db');

const addUser = (req, res) => {
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

    const imagen = req.file ? req.file.filename : null;

    db.query(
        `INSERT INTO usuarios 
        (nombre, apellidos, telefono, fecha_nacimiento, imagen, email, contrasena, informacion_publica, fecha_registro)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            Nombre,
            Apellidos,
            Telefono,
            FechaNacimiento,
            imagen,
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

const searchUser = (req, res) => {
 const {
        email,
        contrasena,
    } = req.body;

    db.query(
        "SELECT id_usuario, nombre, apellidos, telefono, fecha_nacimiento, imagen, email, contrasena, informacion_publica, rol FROM usuarios WHERE email = ? AND contrasena = ?",
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

const updateUser = (req, res) => {
    const { id_usuario } = req.params;
    const { nombre, apellidos, telefono, email, contrasena, informacion_publica, fecha_nacimiento } = req.body;

    const imagen = req.file ? req.file.filename : null;

    const query = imagen 
        ? "UPDATE usuarios SET nombre=?, imagen=?, apellidos=?, telefono=?, email=?, contrasena=?, fecha_nacimiento=?, informacion_publica=? WHERE id_usuario=?"
        : "UPDATE usuarios SET nombre=?, apellidos=?, telefono=?, email=?, contrasena=?, fecha_nacimiento=?, informacion_publica=? WHERE id_usuario=?";

    const params = imagen
        ? [nombre, imagen, apellidos, telefono, email, contrasena, fecha_nacimiento, informacion_publica, id_usuario]
        : [nombre, apellidos, telefono, email, contrasena, fecha_nacimiento, informacion_publica, id_usuario];

    db.query(query, params, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al actualizar el usuario");
        }
        res.status(200).send("Usuario actualizado correctamente");
    });
};

const getTopRatingedUsers = (req, res) => {
    const sql = `
        SELECT 
            u.id_usuario,
            u.nombre,
            u.apellidos,
            u.imagen,
            r.ranking_general,
            r.total_compras
        FROM RANKING_USUARIOS r
        INNER JOIN usuarios u ON u.id_usuario = r.id_usuario
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



module.exports = { addUser,searchUser,updateUser,getTopRatingedUsers };
