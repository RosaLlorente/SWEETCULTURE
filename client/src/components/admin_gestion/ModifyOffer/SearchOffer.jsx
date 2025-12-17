//Importaciones funcionales
import { useState, useEffect } from 'react';
import axios from "axios";
//Importaciones de diseño
import "../../../assets/CSS/admin_gestion/ModifyOffers/SearchOfers.css";

const SearchOffer = ({onSearch}) => 
{

    //Declaración de constantes
    const API_URL= process.env.API_URL;
    const [OpcionesBusqueda, setOpcionesBusqueda] = useState({});
    const[NombreOferta, setNombreOferta]= useState("");
    const[TipoOferta, setTipoOferta]= useState("");
    
    /**
     * Obtiene las opciones de búsqueda de ofertas desde el backend.
     * Actualiza el estado `opcionesBusqueda` con los datos recibidos.
     *
     * */
    const optionSearchOffers= () => 
    {
        axios.get(`${API_URL}/optionSearchOffer`)
        .then(res => {  
            setOpcionesBusqueda(res.data);
        })
        .catch(err => console.error(err));
    };

    /**
     * Resetea los campos del formulario de búsqueda de ofertas.
     */
    const resetForm = () => 
    {
        setNombreOferta("");
        setTipoOferta("");
    };

    /**
     * Realiza la búsqueda de ofertas según los filtros proporcionados.
     *
     * 1. Previene la recarga de la página.
     * 2. Construye un objeto `filtros` con los campos que tengan valor.
     * 3. Envía los filtros al backend mediante POST.
     * 4. Actualiza la lista de resultados usando `onSearch`.
     * 5. Resetea el formulario tras la búsqueda.
     *
     * @param {Event} e - Evento del formulario.
     */
    const searchOffer = (e) => 
    {
        e.preventDefault(); // Evitar reload de la página

        const filtros = 
        {
            nombre: NombreOferta || undefined,
            tipo: TipoOferta || undefined,
        };


        axios.post(`${API_URL}/searchOffer`, filtros)
        .then(res => {
                if(onSearch) onSearch(res.data);
            resetForm();
        })
        .catch(err => console.error(err));
    };

    /**
     * Muestra todas las ofertas sin aplicar filtros.
     * Llama a `onSearch` con todas las ofertas y resetea el formulario.
     */
    const showAllOffers = () => 
    {
        axios.get(`${API_URL}/getOffers`)
        .then(res => {
            if (onSearch) onSearch(res.data);
            resetForm(); // opcional: limpiar los filtros
        })
        .catch(err => console.error(err));
    };

    /**
     * Hook que se ejecuta al montar el componente.
     * Inicializa las opciones de búsqueda de ofertas.
     */
    useEffect(() => 
    {
        optionSearchOffers();
    }, []);

    return (
        <>
            <nav id='SearchOfersAdmin' className="navbar navbar-expand-lg bg-body-tertiary p-3">
                <div className="container-fluid">

                    <form 
                        className="d-flex flex-column flex-md-row align-items-md-center gap-2 w-100"
                        role="search" onSubmit={searchOffer}
                    >

                        {/* Input búsqueda */}
                        <input 
                            className="form-control w-100"
                            type="search" 
                            placeholder="Buscar oferta" 
                            aria-label="Search"
                            value={NombreOferta}
                            onChange={(event)=>{ setNombreOferta(event.target.value); }}
                        />
                        {/* Tipo de oferta */}
                        <select className="form-select w-100 w-md-auto"  value={TipoOferta} onChange={e => setTipoOferta(e.target.value)}>
                            <option defaultValue="">Tipo de oferta</option>
                            {OpcionesBusqueda.tipo && OpcionesBusqueda.tipo?.map((tipo, index) => (
                                <option key={index} value={tipo}>{tipo}</option>
                            ))}
                        </select>

                        {/* Botones */}
                        <div className="d-flex gap-2 w-100 justify-content-md-end">
                            <button className="btn btn-outline-success w-50 w-md-auto" type="submit">
                                Buscar
                            </button>
                            <button className="btn btn-outline-danger w-50 w-md-auto" type="reset">
                                Reiniciar
                            </button>
                            <button 
                                className="btn btn-outline-primary w-50 w-md-auto" 
                                type="button" 
                                onClick={showAllOffers}
                            >
                                Mostrar todos
                            </button>
                        </div>

                    </form>
                </div>
            </nav>
        </>
    );
};

export { SearchOffer };
