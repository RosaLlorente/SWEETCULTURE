//Importaciones funcionales
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ViewProduct } from './ViewProduct';
import { SearchProduct } from './SearchProduct';
import axios from 'axios';

//Importaciones de diseño
import "../../assets/CSS/catalog/Catalog.css"

export function Catalog() 
{
    //Declaración de constantes
    const API_URL= process.env.API_URL;
    const location = useLocation();
    const [ListaProductos, setListaProductos] = useState([]);

    /**
     * Obtiene productos del backend según distintos criterios de filtrado.
     *
     * @param {string|null} filterTemporada - Temporada o etiqueta especial para filtrar productos.
     * @param {number|null} id_postre - ID de un producto específico.
     *
     * Prioridad de búsqueda:
     * 1. Filtrado por temporada (etiqueta especial).
     * 2. Filtrado por ID de producto.
     * 3. Obtención de todos los productos (sin filtros).
     */
    const GetProducts = (filterTemporada,id_postre) => 
    {
        // Filtrar productos por temporada / etiqueta especial
        if (filterTemporada) 
        {
            axios.post(`${API_URL}/searchProduct`, { etiquetaEspecial: filterTemporada })
            .then((response) => setListaProductos(response.data))
            .catch(err => console.error(err));

            return;
        } 
        // Filtrar productos por ID específico
        else if (id_postre) 
        {
            axios.post(`${API_URL}/searchProduct`, { id_postre })
            .then((response) => setListaProductos(response.data))
            .catch(err => console.error(err));

            return;
        }
        // Obtener todos los productos sin filtros
        else 
        {
            axios.get(`${API_URL}/getProducts`)
            .then((response) => setListaProductos(response.data))
            .catch(err => console.error(err));
        }
    };

    /**
     * Hook que carga los productos al entrar al catálogo
     * o cuando cambian los parámetros de navegación.
     *
     * Lee los valores enviados por `navigate`:
     * - temporada → filtra productos por etiqueta especial.
     * - id_postre → muestra un producto específico.
     */
    useEffect(() => 
    {
        const temporada = location.state?.temporada; 
        const id_postre = location.state?.id_postre; 
        if(!temporada && !id_postre) 
        {
            GetProducts();
        }
        else if(temporada) 
        {
            GetProducts(temporada,null);
        }
        else if(id_postre) 
        {
            GetProducts(null,id_postre);
        }
    }, [location.state]);

    /**
     * Maneja los resultados filtrados desde el componente de búsqueda.
     *
     * @param {Array} productosFiltrados - Lista de productos filtrados.
     */
    const handleSearch = (productosFiltrados) => 
    {
        setListaProductos(productosFiltrados);
    };

    return (
        <>
            <SearchProduct onSearch={handleSearch} />
            <div className="contentComponent">
                <ViewProduct productos={ListaProductos} />
            </div>
        </>
    );
}
