//Importaciones funcionales
import { useState } from 'react';
//Importaciones de componentes
import {ViewOrder} from './ViewOrder';
import {SearchOrder} from './SearchOrder';
//Importaciones diseño
import "../../../assets/CSS/admin_gestion/Modify_Order/ModifyOrder.css";

export function ModifyOrder()
{
    //Declaración de constantes
    const [ListaHistorial, setListaHistorial] = useState([]);

    // Función que recibe los productos filtrados desde SearchOrder
    const handleSearch = (HistorialesFiltrados) => 
    {
        setListaHistorial(HistorialesFiltrados);
    };
    return(
        <>
            <SearchOrder onSearch={handleSearch}/>
            <div className="contentComponentOffers">
            <ViewOrder historiales={ListaHistorial || []}></ViewOrder>
            </div>
        </>
    );
}