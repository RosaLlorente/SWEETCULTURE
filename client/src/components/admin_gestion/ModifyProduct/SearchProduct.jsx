//Importaciones funcionales
import { useState, useEffect } from 'react';
import axios from "axios";
//Importaciones diseño
import '../../../assets/CSS/admin_gestion/Modify_Product/SearchProduct.css';

const SearchProduct = ({ onSearch }) => 
{

    //Declaración de constantes
    const API_URL= process.env.API_URL;
    const [OpcionesBusqueda, setOpcionesBusqueda] = useState({});
    const[NombreProducto, setNombreProducto]= useState("");
    const[PrecioMaximo, setPrecioMaximo]= useState("");
    const[PaisOrigen, setPaisOrigen]= useState("");
    const[IngredientesExcluir, setIngredientesExcluir]= useState([]);
    const[EtiquetaEspecial,setEtiquetaEspecial] = useState("");
    

    /**
     * Obtiene las opciones de búsqueda disponibles para el administrador.
     * Actualiza el estado `opcionesBusqueda` con los datos obtenidos.
     */
    const optionSearchProductsAdmin = () => 
    {
        axios.get(`${API_URL}/optionSearchProductsAdmin`)
        .then(res => {  
            setOpcionesBusqueda(res.data);
        })
        .catch(err => console.error(err));
    };

    /**
     * Resetea el formulario de búsqueda del administrador.
     * Limpia todos los campos y filtros aplicados.
     */
    const resetForm = () => 
    {
        setNombreProducto("");
        setPrecioMaximo("");
        setPaisOrigen("");
        setIngredientesExcluir([]);
        setEtiquetaEspecial("");
    };

    /**
     * Realiza la búsqueda de productos según los filtros proporcionados.
     *
     * 1. Previene la recarga de la página.
     * 2. Construye un objeto de filtros tomando solo los campos con valor.
     * 3. Envía los filtros al backend mediante POST.
     * 4. Actualiza la lista de productos usando `onSearch`.
     * 5. Resetea el formulario tras la búsqueda.
     *
     * @param {Event} e - Evento del formulario.
     */
    const searchProduct = (e) => 
    {
        e.preventDefault(); // Evitar reload de la página

        const filtros = 
        {
            nombre: NombreProducto || undefined,
            precioMaximo: PrecioMaximo || undefined,
            pais: PaisOrigen || undefined,
            ingredientesExcluir: IngredientesExcluir.length ? IngredientesExcluir : undefined,
            etiquetaEspecial: EtiquetaEspecial || undefined
        };


        axios.post(`${API_URL}/searchProduct`, filtros)
        .then(res => {
                if(onSearch) onSearch(res.data);
            resetForm();
        })
        .catch(err => console.error(err));
    };

    /**
     * Muestra todos los productos disponibles sin aplicar filtros.
     * Llama a `onSearch` con todos los productos y resetea el formulario.
     */
    const showAllProducts = () => 
    {
        axios.get(`${API_URL}/getProducts`)
        .then(res => {
            if (onSearch) onSearch(res.data);
            resetForm(); // opcional: limpiar los filtros
        })
        .catch(err => console.error(err));
    };

    /**
     * Hook que se ejecuta al montar el componente.
     * Llama a `optionSearchProductsAdmin` para cargar las opciones de búsqueda iniciales.
     */
    useEffect(() => 
    {
        optionSearchProductsAdmin();
    }, []);

    return (
        <>
            <nav id='SearchProductAdmin' className="navbar navbar-expand-lg bg-body-tertiary p-3">
                <div className="container-fluid">

                    <form 
                        className="d-flex flex-column flex-md-row align-items-md-center gap-2 w-100"
                        role="search" onSubmit={searchProduct}
                    >

                        {/* Input búsqueda */}
                        <input 
                            className="form-control w-100"
                            type="search" 
                            placeholder="Buscar postre" 
                            aria-label="Search"
                            value={NombreProducto}
                            onChange={(event)=>{ setNombreProducto(event.target.value); }}
                        />

                         <input 
                            className="form-control w-100"
                            type="search" 
                            placeholder="Buscar precio máximo €" 
                            aria-label="Search"
                            value={PrecioMaximo}
                            onChange={(event)=>{ setPrecioMaximo(event.target.value); }}
                        />

                        {/* Select País */}
                        <select className="form-select w-100 w-md-auto"  value={PaisOrigen} onChange={e => setPaisOrigen(e.target.value)}>
                            <option defaultValue="">País de origen</option>
                            {OpcionesBusqueda.paises && OpcionesBusqueda.paises?.map((pais, index) => (
                                <option key={index} value={pais}>{pais}</option>
                            ))}
                        </select>

                        {/* Select Temporada */}
                        <select className="form-select w-100 w-md-auto"  value={EtiquetaEspecial} onChange={e => setPaisOrigen(e.target.value)}>
                            <option defaultValue="">Temporada</option>
                            {OpcionesBusqueda.temporadas && OpcionesBusqueda.temporadas?.map((etiqueta_especial, index) => (
                                <option key={index} value={etiqueta_especial}>{etiqueta_especial}</option>
                            ))}
                        </select>

                        {/* Dropdown de ingredientes */}
                        <div className="dropdown w-100 w-md-auto">
                            <button 
                                className="btn btn-secondary dropdown-toggle w-100" 
                                type="button" 
                                data-bs-toggle="dropdown"
                            >
                                Excluir ingredientes
                            </button>

                            <ul className="dropdown-menu p-3" style={{ minWidth: "220px" }}>
                                {OpcionesBusqueda.ingredientes && OpcionesBusqueda.ingredientes?.map((ingrediente, index) => (
                                    <li key={index}>
                                        <div className="form-check">    
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox"
                                                id={`checkIngrediente${index}`}
                                                checked={IngredientesExcluir.includes(ingrediente)}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        // agregar ingrediente al array
                                                        setIngredientesExcluir([...IngredientesExcluir, ingrediente]);
                                                    } else {
                                                        // quitar ingrediente del array
                                                        setIngredientesExcluir(
                                                            IngredientesExcluir.filter(i => i !== ingrediente)
                                                        );
                                                    }
                                                }}
                                            />
                                            <label 
                                                className="form-check-label" 
                                                htmlFor={`checkIngrediente${index}`}    
                                            >
                                                {ingrediente}
                                            </label>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

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
                                onClick={showAllProducts}
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

export { SearchProduct };
