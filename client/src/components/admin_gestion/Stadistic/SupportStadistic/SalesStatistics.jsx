//Importaciones funcionales
import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const SalesStadistics = () => 
{
    //Declaración de constantes
    const [ventas, setVentas] = useState({ total_pedidos: 0, ventas_totales: 0 });
    const [ventasAll, setVentasAll] = useState({ total_pedidos: 0, ventas_totales: 0 });
    const [ventasPorEstado, setVentasPorEstado] = useState([]);

    /**
     * Hook de efecto que se ejecuta una sola vez al montar el componente.
     *
     * Su función es obtener los datos estadísticos relacionados con los pedidos:
     *  - Total de ventas completadas
     *  - Total de pedidos registrados
     *  - Número de pedidos agrupados por estado
     *
     * Cada petición actualiza su correspondiente estado en React, provocando
     * el renderizado de los gráficos y contadores asociados.
     */
    useEffect(() => 
    {
        // Pedidos completados
        axios.get("http://localhost:3000/getVentasTotales")
        .then(res => setVentas(res.data))
        .catch(err => console.error(err));

        // Todos los pedidos
        axios.get("http://localhost:3000/getPedidosTotales")
        .then(res => setVentasAll(res.data))
        .catch(err => console.error(err));

        // Pedidos agrupados por estado
        axios.get("http://localhost:3000/getVentasPorEstado")
        .then(res => setVentasPorEstado(res.data))
        .catch(err => console.error(err));
    }, []);

    /**
     * Diccionario para traducir los estados internos del sistema
     * a textos más comprensibles para el usuario.
     */
    const estadoLabels = 
    {
        pendiente: "Pendiente",
        en_preparacion: "En preparación",
        listo: "Listo para recoger",
        recogido: "Recogido y pagado"
    };

    /**
     * Datos del gráfico de barras.
     * Muestra la cantidad de pedidos por estado.
     */
    const chartData = 
    {
        labels: ventasPorEstado.map(v => estadoLabels[v.estado] || v.estado),
        datasets: 
        [
            {
                label: "Cantidad de pedidos",
                data: ventasPorEstado.map(v => v.total_pedidos),
                backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"], // Colores por estado
            }
        ]
    };

    /**
     * Opciones de configuración del gráfico.
     * - Responsive para adaptarse a distintos dispositivos.
     * - Eje Y comenzando en 0.
     * - Con animación
     * - Oculta la leyenda para una vista más limpia.
     */
    const chartOptions = 
    {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, precision: 0 } }, // Y eje comienza en 0
        animation: { duration: 1000,easing: 'easeOutQuart',},
        transitions: {
            active: {
                animation: {
                    duration: 400
                }
            }
        }
    };

    return (
        <div className="container my-4">
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card shadow-sm p-3">
                        <h3>💰 Ventas completadas</h3>
                        <p>Total pedidos completados: <strong>{ventas.total_pedidos}</strong></p>
                        <p>Rentabilidad: <strong>${ventas.ventas_totales?.toFixed(2) || 0}</strong></p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow-sm p-3">
                        <h3>📊 Todos los pedidos</h3>
                        <p>Total pedidos: <strong>{ventasAll.total_pedidos}</strong></p>
                        <p>Rentabilidad total estimada: <strong>${ventasAll.ventas_totales?.toFixed(2) || 0}</strong></p>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm p-3">
                <h3 className="mb-3">📈 Pedidos por estado</h3>
                {ventasPorEstado.length > 0 ? (
                    <Bar data={chartData} options={chartOptions} />
                ) : (
                    <p>Cargando estadísticas...</p>
                )}
            </div>
        </div>
    );
};

export { SalesStadistics };
