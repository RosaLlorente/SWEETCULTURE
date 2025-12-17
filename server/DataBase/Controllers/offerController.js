import db from '../db.js'; // Archivo donde exportas tu conexión a MySQL

// Añadir una oferta
export const addOffer = (req, res) => {
    const { 
        nombre,tipo,valor,id_postre,fecha_inicio,fecha_fin,ser_visible,fecha_creacion
    } = req.body;
    let valorOferta = valor;
    if (tipo !== "descuento") {
        valorOferta = 0; 
    }

    db.query(
        "INSERT INTO OFERTAS (nombre,tipo,valor,id_postre,fecha_inicio,fecha_fin,ser_visible,fecha_creacion) VALUES (?,?,?,?,?,?,?,?)",
        [
            nombre,tipo,valorOferta,id_postre,fecha_inicio,fecha_fin,ser_visible,fecha_creacion
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al añadir oferta");
            }
            res.status(200).send("Oferta añadida correctamente");
        }
    );
};

// Obtener productos
export const getOffers = (req, res) => {
    db.query("SELECT * FROM OFERTAS", (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al obtener las ofertas");
        }
        res.send(result);
    });
};

export const optionSearchOffer = (req, res) => {
    db.query("SELECT DISTINCT tipo FROM OFERTAS", (err, tipoResult) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al obtener tipos de ofertas");
        }
        const tipos = tipoResult.map(row => row.tipo);
        res.status(200).json({ tipo: tipos });
    });
};

export const searchOffer = (req, res) => {
    const { nombre, tipo } = req.body;  
    
    let query = "SELECT * FROM OFERTAS WHERE 1=1";
    const params = [];

    if (nombre) {
        query += " AND nombre LIKE ?";
        params.push(`%${nombre}%`);
    }

     if (tipo) {
        query += " AND tipo = ?";
        params.push(tipo);
    }

    db.query(query, params, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al buscar oferta");
        }
        res.send(result); 
    });

}

export const updateOffer = (req, res) => {
    const { id_oferta } = req.params;
    let { nombre, tipo, valor, id_postre, fecha_inicio, fecha_fin, ser_visible } = req.body;

    if (tipo !== "descuento") {
        valor = 0;
    }

    // Formatear fechas a YYYY-MM-DD
    fecha_inicio = fecha_inicio ? fecha_inicio.split('T')[0] : null;
    fecha_fin = fecha_fin ? fecha_fin.split('T')[0] : null;

    const query = `
        UPDATE OFERTAS
        SET nombre = ?, tipo = ?, valor = ?, id_postre = ?, fecha_inicio = ?, fecha_fin = ?, ser_visible = ?
        WHERE id_oferta = ?
    `;
    const values = [nombre, tipo, valor, id_postre, fecha_inicio, fecha_fin, ser_visible, id_oferta];

    db.query(query, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al actualizar la oferta");
        }
        res.status(200).send("Oferta actualizada correctamente");
    });
};

export const deleteOffer = (req, res) => {
    const { id_oferta } = req.params;

    if (!id_oferta) {
        return res.status(400).send("ID inválido");
    }

    db.query(
        "DELETE FROM OFERTAS WHERE id_oferta = ?",
        [id_oferta],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al eliminar la oferta");
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Oferta no encontrada");
            }

            return res.status(200).send("Oferta eliminada correctamente");
        }
    );
};


