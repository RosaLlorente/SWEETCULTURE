//Importaciones funcionales
import { useState } from 'react';
//Importaciones de componentes
import {ViewOffer} from './ViewOffer';
import {SearchOffer} from './SearchOffer';
//Importaciones diseño
import "../../../assets/CSS/admin_gestion/ModifyOffers/ModifyOffers.css";

export function ModifyOffer()
{
    //Declaración de constantes
    const [ListaOfertas, setListaOfertas] = useState([]);
    // Función que recibe los productos filtrados desde SearchOffer
    const handleSearch = (ofertasFiltradas) => 
    {
        setListaOfertas(ofertasFiltradas);
    };
    return(
        <>
            <SearchOffer onSearch={handleSearch} />
            <div className="contentComponentOffers">
                <ViewOffer ofertas={ListaOfertas || []}></ViewOffer>
            </div>
        </>
    );
}