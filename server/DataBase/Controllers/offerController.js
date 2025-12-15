const db = require('../db'); // Archivo donde exportas tu conexión a MySQL

// Añadir una oferta
const addOffer = (req, res) => {
    const { 
        nombre,tipo,valor,id_postre,fecha_inicio,fecha_fin,ser_visible,fecha_creacion
    } = req.body;
    let valorOferta = valor;
    if (tipo !== "descuento") {
        valorOferta = 0; 
    }

    db.query(
        "INSERT INTO ofertas (nombre,tipo,valor,id_postre,fecha_inicio,fecha_fin,ser_visible,fecha_creacion) VALUES (?,?,?,?,?,?,?,?)",
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
const getOffers = (req, res) => {
    db.query("SELECT * FROM ofertas", (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al obtener las ofertas");
        }
        res.send(result);
    });
};

const optionSearchOffer = (req, res) => {
    db.query("SELECT DISTINCT tipo FROM ofertas", (err, tipoResult) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al obtener tipos de ofertas");
        }
        const tipos = tipoResult.map(row => row.tipo);
        res.status(200).json({ tipo: tipos });
    });
};

const searchOffer = (req, res) => {
    const { nombre, tipo } = req.body;  
    
    let query = "SELECT * FROM ofertas WHERE 1=1";
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

const updateOffer = (req, res) => {
    const { id_oferta } = req.params;
    const { nombre,tipo,valor,id_postre,fecha_inicio,fecha_fin,ser_visible} = req.body;

     // Si el tipo no es "descuento", forzar valor a 0 o null
    if (tipo !== "descuento") {
        valor = 0; // o null si tu columna permite null
    }

    const query = `
        UPDATE ofertas
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
}

const deleteOffer = (req, res) => {
    const { id_oferta } = req.params;

    db.query("DELETE FROM ofertas WHERE id_oferta = ?", [id_oferta], (err2) => {
        if (err2) {
            console.log(err2);
            return res.status(500).send("Error al eliminar el producto");
        }});
}

module.exports = { addOffer,getOffers,optionSearchOffer,searchOffer,updateOffer,deleteOffer};