//Importaciones funcionales
import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
//Importaciones diseño
import '../../../assets/CSS/section_home_components/support_components/TopRatedProduct.css';

const TopRatedProduct = () => 
{
    //Declaración de constantes
    const API_URL= process.env.API_URL;
    const [topList, setTopList] = useState([]);
    const [topProduct, setTopProduct] = useState(null);
    const [meanRating, setMeanRating] = useState(0);

    /**
     * Hook que obtiene los productos mejor valorados.
     *
     * 1. Solicita al backend la lista de productos con mejor ranking.
     * 2. Guarda la lista completa en `topList`.
     * 3. Selecciona el producto con mejor valoración (`topProduct`).
     * 4. Obtiene la media de valoración del producto TOP 1.
     */
    useEffect(() => 
    {
        axios.get(`${API_URL}/getTopRatingedProducts`)
        .then(function(resTop) 
    {
            if (resTop.data.length === 0) return;

            setTopList(resTop.data);

            const best = resTop.data[0];
            setTopProduct(best);

            axios.get(`${API_URL}/getMeanRatingProduct/` + best.id_postre)
            .then(function(resMean) 
            {
                setMeanRating(resMean.data.promedio || 0);
            })
            .catch(function(err) 
            {
                console.error("Error al obtener la media del TOP 1:", err);
            });
        })
        .catch(function(err) 
        {
            console.error("Error al obtener los top productos:", err);
        });
    }, []);

    /**
     * Renderiza un loader mientras el producto principal no esté cargado.
     */
    if (!topProduct) return <img src="Image/Loader.gif" alt="Cargando..." style={{ width: "50px" }} />;

    /**
     * Renderiza visualmente una valoración en estrellas.
     * Soporta medias estrellas mediante gradiente.
     *
     * @param {number} rating - Valoración del producto (0 a 5).
     * @returns {JSX.Element[]} Array de elementos span con estrellas.
     */
    const renderStars = (rating) => 
    {
        const stars = [];
        for (let i = 1; i <= 5; i++) 
        {
            let style = { fontSize: "20px" };
            if (rating >= i) style.color = "gold";
            else if (rating >= i - 0.5) 
            {
                style = 
                {
                    fontSize: "20px",
                    background: "linear-gradient(90deg, gold 50%, #ccc 50%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                };
            } else style.color = "#ccc";
            stars.push(<span key={i} style={style}>★</span>);
        }
        return stars;
    };

    /**
     * Datos del gráfico circular (Donut).
     * Usa el nombre del producto como etiqueta y su media como valor.
     */
    const chartData = 
    {
        labels: topList.map(item => item.nombre),
        datasets: 
        [{
            data: topList.map(item => Number(item.promedio)),
            backgroundColor: ["rgb(246, 214, 148)", "rgb(244, 164, 123)", "rgba(211, 133, 206, 0.855)", "rgb(204, 171, 202)", "rgb(43, 140, 137)"],
            borderWidth: 0
        }]
    };

    /**
     * Opciones de configuración del gráfico.
     * - Estilo tipo donut
     * - Animación de rotación
     * - Leyenda oculta
     */
    const chartOptions = 
    {
        cutout: "70%",
        animation: { animateRotate: true, duration: 1500 },
        plugins: { legend: { display: false } }
    };

    return (
        <section className="top-rated-products">

            {/* TOP 1 */}
            <div className="top-product-card">
                <h3 className="section-title">⭐ Producto mejor valorado</h3>

                {!topProduct.imagen || topProduct.imagen === "null" ? (
                    <img 
                        src="/ProductImage/404product.jpg"
                        alt={topProduct.nombre}
                        className="top-product-img"
                    />
                ) : (
                    <img 
                        src={topProduct.imagen}
                        alt={topProduct.nombre}
                        className="top-product-img"
                    />
                )}

                <h4 className="top-product-name">{topProduct.nombre}</h4>

                <div className="rating-stars">
                    {renderStars(meanRating)}
                    <span className="rating-value">
                        { Number(meanRating).toFixed(1)} / 5
                    </span>
                </div>
            </div>

            {/* GRID */}
            <div className="products-grid">

                {/* LISTA */}
                <div className="products-list-card">
                    <h4 className="section-subtitle">🏅 Top 5 mejor valorados</h4>

                    <ul className="products-ranking">
                        {topList.map((item, index) => (
                            <li key={item.id_postre} className="product-item">
                                <span className="product-pos">{index + 1}</span>

                                <span className="product-name">
                                    {item.nombre}
                                </span>

                                <span className="product-stars">
                                    {renderStars(Number(item.promedio))}
                                    <strong>{Number(item.promedio).toFixed(1)}</strong>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* GRÁFICO */}
                <div className="products-chart-card">
                    <h4 className="section-subtitle">📊 Valoraciones</h4>

                    <div className="chart-wrapper">
                        <Doughnut data={chartData} options={chartOptions} />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default TopRatedProduct;
