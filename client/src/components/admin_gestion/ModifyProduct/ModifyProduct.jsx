//Importaciones funcionales
import { useState } from 'react';
//Importaciones de componentes
import { ViewProduct } from './ViewProduct';
import { SearchProduct } from './SearchProduct';
//Importaciones diseño
import "../../../assets/CSS/admin_gestion/Modify_Product/ModifyProduct.css"

export function ModifyProcuct()
{
    //Declaración de constantes
    const [ListaProductos, setListaProductos] = useState([]);
    
    // Función que recibe los productos filtrados desde SearchProduct
    const handleSearch = (productosFiltrados) => 
    {
        setListaProductos(productosFiltrados);
    };
    return(
        <>
            <SearchProduct onSearch={handleSearch} />
            <div className="contentComponentProduct">
                <ViewProduct productos={ListaProductos || []}></ViewProduct>
            </div>
        </>
    );
}