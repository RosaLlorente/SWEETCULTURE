//Importaciones funcionales
import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

//Importaciones diseño
import '../../../assets/CSS/section_home_components/support_components/TopRankingUsers.css';

const TopRankingUsers = () => 
{
    //Declaración de constantes
    const API_URL= process.env.API_URL;
    const [topUsers, setTopUsers] = useState([]);
    const [topUser, setTopUser] = useState(null);

    /**
     * Hook que obtiene periódicamente los usuarios mejor valorados.
     *
     * 1. Solicita los usuarios con mejor ranking al backend.
     * 2. Guarda los 5 primeros en `topUsers`.
     * 3. Define el usuario con mejor ranking como `topUser`.
     * 4. Repite la petición cada 10 segundos (polling).
     * 5. Limpia el intervalo al desmontar el componente.
     */
    useEffect(() => 
    {
        const fetchTopUsers = () => 
        {
            axios.get(`${API_URL}/getTopRatingedUsers`)
            .then(res => 
            {
                if (!res.data || res.data.length === 0) return;
                setTopUsers(res.data.slice(0, 5));
                setTopUser(res.data[0]);
            })
            .catch(err => console.error(err));
        };

        fetchTopUsers();
        const interval = setInterval(fetchTopUsers, 10000);
        return () => clearInterval(interval);
    }, []);

    /**
     * Renderiza un loader mientras no haya usuario principal cargado.
     */
    if (!topUser) 
    {
        return (
            <div className="text-center my-4">
                <img src="Image/Loader.gif" alt="Cargando..." width="50" />
            </div>
        );
    }

    /**
     * Datos del gráfico (Donut).
     * Usa los nombres de los usuarios como etiquetas
     * y su ranking general como valores numéricos.
     */
    const chartData = 
    {
        labels: topUsers?.map(u => u.nombre),
        datasets: 
        [
            {
                data: topUsers?.map(u => Number(u.ranking_general)),
                backgroundColor: ["rgb(246, 214, 148)", "rgb(244, 164, 123)", "rgba(211, 133, 206, 0.855)", "rgb(204, 171, 202)", "rgb(43, 140, 137)"],
                borderWidth: 0
            }
        ]
    };

    /**
     * Opciones de configuración del gráfico.
     * - Estilo tipo donut
     * - Animación de rotación
     * - Sin leyenda visible
     */
    const chartOptions = 
    {
        cutout: "70%",
        animation: { animateRotate: true, duration: 1500 },
        plugins: { legend: { display: false } }
    };

    return (
        <section className="top-ranking-users">

            {/* TOP 1 */}
            <div className="top-card">
                <h3 className="section-title">🏆 Usuario TOP del mes</h3>

                {!topUser.imagen || topUser.imagen === "null" ? (
                    <img
                        src="/ProfileUserImage/DefaultImage.jpg"
                        alt={topUser.nombre}
                        className="top-avatar"
                    />
                ) : (
                    <img
                    src={topUser.imagen}
                    alt={topUser.nombre}
                    className="top-avatar"
                    />
                )}
                

                <h4 className="top-name">
                    {topUser.nombre} {topUser.apellidos}
                </h4>

                <div className="top-badges">
                    <span className="badge-ranking">🏆 1º</span>
                    <span className="badge-compras">🛒 {topUser.total_compras}</span>
                </div>
            </div>

            {/* GRID */}
            <div className="top-grid">

                {/* LISTA */}
                <div className="top-list-card">
                    <h4 className="section-subtitle">🏅 Top 5 usuarios</h4>

                    <ul className="ranking-list">
                        {topUsers?.map((u, i) => (
                            <li key={u.id_usuario} className="ranking-item">
                                <span className="ranking-pos">{i + 1}</span>
                                {!u.imagen || u.imagen === "null" ? (
                                    <img
                                        src="/ProfileUserImage/DefaultImage.jpg"
                                        alt={u.nombre}
                                        className="top-avatar"
                                    />
                                ) : (
                                    <img
                                    src={u.imagen}
                                    alt={u.nombre}
                                    className="ranking-avatar"
                                    />
                                )}
                                <span className="ranking-name">
                                    {u.nombre} {u.apellidos}
                                </span>

                                <span className="ranking-score">
                                    Compras realizadas: {u.ranking_general}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* GRÁFICO */}
                <div className="top-chart-card">
                    <h4 className="section-subtitle">📊 Distribución del ranking</h4>

                    <div className="chart-wrapper">
                        <Doughnut data={chartData} options={chartOptions} />
                    </div>
                </div>

            </div>
        </section>
    );

};

export default TopRankingUsers;
