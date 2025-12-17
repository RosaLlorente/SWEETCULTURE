//Importaciones funcionales
import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const UsersStadistics = () => 
{
    //Declaración de constantes
    const API_URL= process.env.API_URL;
    const [totalUsers, setTotalUsers] = useState(0);
    const [topUsers, setTopUsers] = useState([]);

    /**
     * Hook que carga estadísticas generales de usuarios al montar el componente.
     *
     * 1. Obtiene el número total de usuarios registrados.
     * 2. Obtiene el Top 5 de usuarios según su ranking de compras.
     */
    useEffect(() => 
    {
        // Total usuarios
        axios.get(`${API_URL}/getTotalUsers`)
        .then(res => setTotalUsers(res.data.total_usuarios))
        .catch(err => console.error(err));

        // Top 5 usuarios por ranking
        axios.get(`${API_URL}/getTopUsuarios`)
        .then(res => setTopUsers(res.data))
        .catch(err => console.error(err));
    }, []);

    /**
     * Datos del gráfico de usuarios.
     * Muestra el ranking de compras de los 5 usuarios con mejor puntuación.
     */
    const chartData = 
    {
        labels: topUsers.map(u => `${u.nombre} ${u.apellidos}`),
        datasets: 
        [
            {
                label: "Compras (ranking)",
                data: topUsers.map(u => u.ranking_general),
                backgroundColor: "#0d6efd"
            }
        ]
    };

    
    /**
     * Opciones de configuración del gráfico.
     * - Diseño responsive
     * -Con animación
     * - Sin leyenda visible
     * - Eje Y iniciando en 0 y sin decimales
     */
    const chartOptions = 
    {
        responsive: true,
         animation: {
            duration: 1500,         
            easing: "easeOutQuart",  
            delay: (context) => 
            {
                // Animación progresiva por barra
                if (context.type === "data" && context.mode === "default") 
                {
                    return context.dataIndex * 200;
                }
                return 0;
            }
        },
        plugins: { legend: { display: false } },
        scales: 
        {
            y: {
                beginAtZero: true,
                precision: 0
            }
        }
    };

    return (
        <div className="container my-4">
            
            {/* Total usuarios */}
            <div className="card shadow-sm p-3 mb-4 text-center">
                <h3>👥 Usuarios registrados</h3>
                <h2 className="fw-bold">{totalUsers}</h2>
            </div>

            {/* Top usuarios */}
            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow-sm p-3 h-100">
                        <h4 className="mb-3">🏆 Top 5 usuarios con más compras</h4>
                        <ul className="list-group">
                            {topUsers.map((u, i) => (
                                <li key={u.id_usuario} className="list-group-item d-flex align-items-center gap-3">
                                    <strong>{i + 1}.</strong>
                                    
                                    {!u.imagen || u.imagen === "null" ? (
                                        <img
                                            src="/ProfileUserImage/DefaultImage.jpg"
                                            alt={u.nombre}
                                            style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <img
                                            src={u.imagen}
                                            alt={u.nombre}
                                            style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" }}
                                        />
                                    )}
                                    
                                    <div className="flex-grow-1">
                                        {u.nombre} {u.apellidos}
                                    </div>
                                    <span className="badge bg-primary">
                                        {u.ranking_general}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Gráfico */}
                <div className="col-md-6">
                    <div className="card shadow-sm p-3 h-100">
                        <h4 className="mb-3">📊 Ranking de compras</h4>
                        {topUsers.length > 0 ? (
                            <Bar data={chartData} options={chartOptions} />
                        ) : (
                            <p>Cargando gráfico...</p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export { UsersStadistics };
