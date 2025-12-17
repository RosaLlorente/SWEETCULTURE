//Importaciones funcionales
import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const ProductStadistics = () => 
{
    //Declaración de constantes
    const API_URL= process.env.API_URL;
    const [bestProduct, setBestProduct] = useState(null);
    const [topSold, setTopSold] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [salesPerProduct, setSalesPerProduct] = useState([]);

    /**
     * Hook que se ejecuta al montar el componente para cargar estadísticas de productos.
     *
     * Obtiene desde el backend:
     *  - El mejor postre (`getBestProduct`)
     *  - Los 5 productos más vendidos (`getTop5SoldProducts`)
     *  - Los 5 productos mejor valorados (`getTop5RatedProducts`)
     *  - Las ventas totales por cada producto (`getSalesPerProduct`)
     *
     * Cada petición actualiza su correspondiente estado en React, provocando
     * el renderizado de tarjetas, listas o gráficos según los datos recibidos.
     */
    useEffect(() => 
    {
        // Mejor postre
        axios.get(`${API_URL}/getBestProduct`)
        .then(res => setBestProduct(res.data))
        .catch(err => console.error(err));

        // Top 5 más vendidos
        axios.get(`${API_URL}/getTop5SoldProducts`)
        .then(res => setTopSold(res.data))
        .catch(err => console.error(err));

        // Top 5 mejor valorados
        axios.get(`${API_URL}/getTop5RatedProducts`)
        .then(res => setTopRated(res.data))
        .catch(err => console.error(err));

        // Ventas por producto
        axios.get(`${API_URL}/getSalesPerProduct`)
        .then(res => setSalesPerProduct(res.data))
        .catch(err => console.error(err));
    }, []);

    /**
     * Datos para el gráfico de ventas por producto.
     *
     * - `labels`: nombres de los productos.
     * - `datasets`: unidades vendidas por producto.
     * - `backgroundColor`: color de las barras del gráfico.
     */
    const chartDataSales = 
    {
        labels: salesPerProduct.map(p => p.nombre),
        datasets: 
        [
            {
                label: "Unidades vendidas",
                data: salesPerProduct.map(p => p.total_vendido),
                backgroundColor: "rgba(255, 99, 132, 0.7)"
            }
        ]
    };

    /**
     * Datos para el gráfico de ventas por producto.
     *
     * - `labels`: nombres de los productos.
     * - `datasets`: unidades vendidas por producto.
     * - `backgroundColor`: color de las barras del gráfico.
     */
    const chartOptions = 
    {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, precision: 0 } }
    };

    return (
        <div className="container my-4">
            {/* Mejor postre */}
            <div className="card shadow-sm p-3 mb-4">
                <h4>🏆 Mejor postre</h4>
                {bestProduct ? (
                    <div className="d-flex align-items-center gap-3">
                        {!bestProduct.imagen || bestProduct.imagen === "null" ? (
                            <img
                                src="/ProductImage/404product.jpg"
                                alt={bestProduct.nombre}
                                style={{ width: "100px", borderRadius: "8px" }}
                            />
                        ) : (
                            <img
                                src={bestProduct.imagen}
                                alt={bestProduct.nombre}
                                style={{ width: "100px", borderRadius: "8px" }}
                            />
                        )}
                        <div>
                            <h5>{bestProduct.nombre}</h5>
                            <p>Unidades vendidas: <strong>{bestProduct.ventas_totales}</strong></p>
                        </div>
                    </div>
                ) : (
                    <p>Cargando mejor postre...</p>
                )}
            </div>

            {/* Top 5 más vendidos */}
            <div className="card shadow-sm p-3 mb-4">
                <h4>📈 Top 5 postres más vendidos</h4>
                {topSold.length > 0 ? (
                    <ul className="list-group">
                        {topSold.map((p, i) => (
                            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                                {i + 1}. {p.nombre}
                                <span>{p.ventas_totales || 0} unidades</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Cargando top 5 más vendidos...</p>
                )}
            </div>

            {/* Top 5 mejor valorados */}
            <div className="card shadow-sm p-3 mb-4">
                <h4>⭐ Top 5 postres mejor valorados</h4>
                {topRated.length > 0 ? (
                    <ul className="list-group">
                        {topRated.map((p, i) => (
                            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                                {i + 1}. {p.nombre}
                                <span>{p.promedio != null ?  Number(p.promedio).toFixed(1) : "N/A"} / 5</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Cargando top 5 mejor valorados...</p>
                )}
            </div>

            {/* Ventas por producto con acordeón */}
            <div className="card shadow-sm p-3">
                <h4>📊 Ventas por producto</h4>
                <div className="row">
                    <div className="col-md-6">
                        <div className="accordion" id="productsAccordion">
                            {salesPerProduct.map((p, i) => (
                                <div className="accordion-item" key={i}>
                                    <h2 className="accordion-header" id={`heading-${i}`}>
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse-${i}`}
                                            aria-expanded="false"
                                            aria-controls={`collapse-${i}`}
                                        >
                                            {p.nombre}
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapse-${i}`}
                                        className="accordion-collapse collapse"
                                        aria-labelledby={`heading-${i}`}
                                        data-bs-parent="#productsAccordion"
                                    >
                                        <div className="accordion-body">
                                            {!p.imagen || p.imagen === "null" ? (
                                                <img
                                                    src="/ProductImage/404product.jpg"
                                                    alt={p.nombre}
                                                    style={{ width: "100px", borderRadius: "8px" }}
                                                />
                                            ) : (
                                                <img
                                                    src={p.imagen}
                                                    alt={p.nombre}
                                                    style={{ width: "80px", borderRadius: "6px", marginRight: "10px" }}
                                                />
                                            )}
                                            <span>Unidades vendidas: <strong>{p.total_vendido}</strong></span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-6">
                        {salesPerProduct.length > 0 ? (
                            <Bar data={chartDataSales} options={chartOptions} />
                        ) : (
                            <p>Cargando gráfico de ventas...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ProductStadistics };
