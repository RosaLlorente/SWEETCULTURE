   //Importaciones funcionales
    import { useState, useEffect } from 'react';
    import axios from "axios";

    //Importaciones de diseño
    import '../../assets/CSS/catalog/SearchProduct.css';

    const SearchProduct = ({ onSearch }) => 
    {
        //Declaración de constantes
        const [OpcionesBusqueda, setOpcionesBusqueda] = useState({});
        const[NombreProducto, setNombreProducto]= useState("");
        const[PrecioMaximo, setPrecioMaximo]= useState("");
        const[PaisOrigen, setPaisOrigen]= useState("");
        const[IngredientesExcluir, setIngredientesExcluir]= useState([]);
        const[EtiquetaEspecial,setEtiquetaEspecial] = useState("");
        
        /**
         * Obtiene las opciones disponibles para la búsqueda de productos.
         * Por ejemplo: etiquetas, categorías o filtros predefinidos.
         */
        const optionSearchProducts = () => 
        {
            axios.get("http://localhost:3000/optionSearchProducts")
            .then(res => {  
                setOpcionesBusqueda(res.data);
            })
            .catch(err => console.error(err));
        };

        /**
         * Resetea los campos del formulario de búsqueda a sus valores iniciales.
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
         * Realiza la búsqueda de productos según los filtros proporcionados por el usuario.
         *
         * 1. Previene el comportamiento por defecto del formulario.
         * 2. Construye un objeto `filtros` solo con valores definidos.
         * 3. Envía la solicitud POST al backend con los filtros.
         * 4. Si `onSearch` está definido, pasa los resultados al componente padre.
         * 5. Limpia el formulario después de la búsqueda.
         *
         * @param {Event} e - Evento del formulario.
         */
        const searchProduct = (e) => 
        {
            e.preventDefault();

            const filtros = 
            {
                nombre: NombreProducto || undefined,
                precioMaximo: PrecioMaximo || undefined,
                pais: PaisOrigen || undefined,
                ingredientesExcluir: IngredientesExcluir.length ? IngredientesExcluir : undefined,
                etiquetaEspecial: EtiquetaEspecial || undefined
            };


            axios.post("http://localhost:3000/searchProduct", filtros)
            .then(res => {
                if(onSearch) onSearch(res.data);
                resetForm();
            })
            .catch(err => console.error(err));
        };

        /**
         * Obtiene todos los productos sin aplicar filtros.
         * Se puede usar para mostrar el catálogo completo.
         */
        const showAllProducts = () => 
        {
            axios.get("http://localhost:3000/getProducts")
            .then(res => {
                if (onSearch) onSearch(res.data);
                resetForm(); // opcional: limpiar los filtros
            })
            .catch(err => console.error(err));
        };

        /**
         * Hook que carga las opciones de búsqueda al montar el componente.
         */
        useEffect(() => 
        {
            optionSearchProducts();
        }, []);

        return (
            <>
                <nav id="SearchProduct" className="navbar navbar-expand-lg bg-body-tertiary p-3">
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
                                {OpcionesBusqueda.paises && OpcionesBusqueda.paises.map((pais, index) => (
                                    <option key={index} value={pais}>{pais}</option>
                                ))}
                            </select>

                            {/* Select Temporada */}
                            <select className="form-select w-100 w-md-auto"  value={EtiquetaEspecial} onChange={e => setEtiquetaEspecial(e.target.value)}>
                                <option value="">Temporada</option>
                                {OpcionesBusqueda.temporadas && OpcionesBusqueda.temporadas.map((etiqueta_especial, index) => (
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
                                    {OpcionesBusqueda.ingredientes && OpcionesBusqueda.ingredientes.map((ingrediente, index) => (
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
                                <button className="search-product-navbar" type="submit">
                                    Buscar
                                </button>
                                <button className="search-product-navbar" type="reset">
                                    Reiniciar
                                </button>
                                <button 
                                    className="search-product-navbar"
                                    type="button" // importante: evitar submit
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
