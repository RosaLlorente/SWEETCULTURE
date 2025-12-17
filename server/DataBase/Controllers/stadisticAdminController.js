import db from '../db.js';

// 1️⃣ Ventas totales
export const getVentasTotales = (req, res) => {
    db.query(
        `SELECT COUNT(*) AS total_pedidos, SUM(total) AS ventas_totales
         FROM HISTORIAL_PEDIDOS
         WHERE estado = 'recogido'`,    
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results[0]);
        }
    );
};

export const getPedidosTotales = (req, res) => {
    db.query(
        `SELECT COUNT(*) AS total_pedidos, SUM(total) AS ventas_totales
         FROM HISTORIAL_PEDIDOS`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results[0]);
        }
    );
};

export const getVentasPorEstado = (req, res) => {
    db.query(
        `SELECT estado, COUNT(*) AS total_pedidos, SUM(total) AS ventas_totales
         FROM HISTORIAL_PEDIDOS
         GROUP BY estado`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        }
    );
};



    // 1️⃣ Mejor postre por ventas (el que más se vendió)
export const getBestProduct = (req, res) => {
    db.query(
        `SELECT p.id_postre, p.nombre, p.imagen, pmv.ventas_totales
        FROM postres p
        LEFT JOIN postres_mas_vendidos pmv ON p.id_postre = pmv.id_postre
        ORDER BY pmv.ventas_totales DESC
        LIMIT 1`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results[0] || null);
        }
    );
};

    // 2️⃣ Top 5 postres más vendidos
export const getTop5SoldProducts = (req, res) => {
    db.query(
        `SELECT p.id_postre, p.nombre, p.imagen, pmv.ventas_totales
        FROM postres p
        LEFT JOIN postres_mas_vendidos pmv ON p.id_postre = pmv.id_postre
        ORDER BY pmv.ventas_totales DESC
        LIMIT 5`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        }
    );
};

// 3️⃣ Top 5 postres mejor valorados
export const getTop5RatedProducts = (req, res) => {
    db.query(
        `SELECT p.id_postre, p.nombre, p.imagen, AVG(v.puntuacion) AS promedio
        FROM postres p
        LEFT JOIN valoraciones_postres v ON p.id_postre = v.id_postre
        GROUP BY p.id_postre
        ORDER BY promedio DESC
        LIMIT 5`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        }
    );
};
export const getSalesPerProduct = (req, res) => {
    const query = `
        SELECT p.nombre, p.imagen, SUM(jt.cantidad) AS total_vendido
        FROM HISTORIAL_PEDIDOS hp
        JOIN JSON_TABLE(
            hp.postres,
            "$[*]" COLUMNS (
                id_postre INT PATH "$.id_postre",
                cantidad INT PATH "$.cantidad"
            )
        ) AS jt
        JOIN POSTRES p ON jt.id_postre = p.id_postre
        WHERE hp.estado = 'recogido'
        GROUP BY p.id_postre
        ORDER BY total_vendido DESC
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};


// 3️⃣ Usuarios
export const getTotalUsers = (req, res) => {
    db.query(
        `SELECT COUNT(*) AS total_usuarios FROM usuarios`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results[0]);
        }
    );
};

// Top 5 usuarios con más compras (basado en ranking_general)
export const getTopUsuarios = (req, res) => {
    db.query(
        `SELECT 
            u.id_usuario,
            u.nombre,
            u.apellidos,
            u.imagen,
            r.total_compras,
            r.ranking_general
        FROM ranking_usuarios r
        JOIN usuarios u ON r.id_usuario = u.id_usuario
        ORDER BY r.ranking_general DESC
        LIMIT 5`,
        (err, results) => {
            if (err) {
                console.error("Error obteniendo top usuarios:", err);
                return res.status(500).json({ error: err });
            }
            res.json(results);
        }
    );
};


// 4️⃣ Ofertas
export const getOfertas = (req, res) => {
    db.query(
        `SELECT COUNT(*) AS total_ofertas FROM ofertas WHERE ser_visible = TRUE`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results[0]);
        }
    );
};

// 5️⃣ Información general
export const getInfoGeneral = (req, res) => {
    db.query(
        `SELECT 
            (SELECT COUNT(*) FROM postres) AS total_productos,
            (SELECT COUNT(*) FROM usuarios WHERE informacion_publica = TRUE) AS usuarios_publicos,
            (SELECT COUNT(*) FROM asistente_ia) AS interacciones_ia`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results[0]);
        }
    );
};

