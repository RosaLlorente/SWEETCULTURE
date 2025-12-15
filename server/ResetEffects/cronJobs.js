const cron = require("node-cron");
const db = require("../DataBase/db"); 

// Cron: "0 0 1 * *" -> minuto 0, hora 0, día 1 de cada mes
cron.schedule("0 0 1 * *", () => {
    console.log("✅ Reiniciando ranking_general de todos los usuarios...");

    db.query("UPDATE RANKING_USUARIOS SET ranking_general = 0", (err, result) => 
    {
        if (err) 
        {
            console.error("❌ Error al resetear ranking_general:", err);
        } 
        else 
        {
            console.log(`🎉 Ranking general reseteado para ${result.affectedRows} usuarios`);
        }
    });
}, {
    scheduled: true,
    timezone: "Europe/Madrid" 
});
