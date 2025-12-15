//Importaciones componentes
import {SalesStadistics} from "./SupportStadistic/SalesStatistics.jsx";
import {ProductStadistics} from "./SupportStadistic/ProductStadistics.jsx";
import {UsersStadistics} from "./SupportStadistic/UserStadistics.jsx";


export function Stadistics() 
{
    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">📊 Estadísticas de SweetCulture</h2>

            {/* Sección 1: Ventas */}
            <section className="mb-5">
                <h3>💰 Ventas</h3>
                <SalesStadistics />
            </section>

            {/* Sección 2: Postres */}
            <section className="mb-5">
                <h3>🍰 Postres</h3>
                <ProductStadistics />
            </section>

            {/* Sección 3: Usuarios */}
            <section className="mb-5">
                <h3>👥 Usuarios</h3>
                <UsersStadistics />
            </section>

            {/* Sección 5: Información general de la web 
            <section className="mb-5">
                <h3>ℹ️ Información general</h3>
                <p>Total de productos en catálogo: ...</p>
                <p>Total de usuarios públicos: ...</p>
                <p>Total de interacciones IA: ...</p>
            </section>*/}
        </div>
    );
}