//Importaciones funcionales
import { useState, useEffect } from "react";
import axios from "axios";

//Importaciones de diseño
import "../../../assets/CSS/admin_gestion/Modify_Order/SearchOrder.css";

const SearchOrder = ({ onSearch }) => 
{
    //Declaración de constantes
    const [OpcionesBusqueda, setOpcionesBusqueda] = useState({});
    const [idHistorial, setIdHistorial] = useState("");
    const [idUsuario, setIdUsuario] = useState("");
    const [nombre, setNombre] = useState("");      // ⬅️ Nuevo
    const [apellidos, setApellidos] = useState(""); // ⬅️ Nuevo
    const [estado, setEstado] = useState("");

    /**
     * Inicializa las opciones de búsqueda para el historial de pedidos.
     * Por defecto, establece los estados posibles de los pedidos.
     * Se puede actualizar dinámicamente si cambian en el backend.
     */
    const optionSearchHistorial = () => 
    {
        setOpcionesBusqueda({
            estado: ['pendiente', 'en_preparacion', 'recogido', 'cancelado']
        });
    };

    /**
     * Resetea los campos del formulario de búsqueda de historial.
     */
    const resetForm = () => 
    {
        setIdHistorial("");
        setIdUsuario("");
        setNombre("");
        setApellidos("");
        setEstado("");
    };

    /**
     * Realiza la búsqueda de historial de pedidos según los filtros proporcionados.
     *
     * 1. Previene la recarga de la página.
     * 2. Construye un objeto `filtros` con los campos que tengan valor.
     * 3. Envía los filtros al backend mediante POST.
     * 4. Actualiza la lista de resultados usando `onSearch`.
     * 5. Resetea el formulario tras la búsqueda.
     *
     * @param {Event} e - Evento del formulario.
     */
    const searchHistorial = (e) => 
    {
        e.preventDefault();

        const filtros = 
        {
            id_historial: idHistorial || undefined,
            id_usuario: idUsuario || undefined,
            nombre: nombre || undefined,       // ⬅️ Añadido
            apellidos: apellidos || undefined, // ⬅️ Añadido
            estado: estado || undefined
        };


        axios.post("http://localhost:3000/searchHistorial", filtros)
        .then(res => {
            if (onSearch) onSearch(res.data);
            resetForm();
        })
        .catch(err => console.error(err));
    };

    /**
     * Muestra todos los historiales de pedidos sin aplicar filtros.
     * Llama a `onSearch` con todos los registros y resetea el formulario.
     */
    const showAllHistorial = () => 
    {
        axios.get("http://localhost:3000/getUsersOrders")
            .then(res => {
                if (onSearch) onSearch(res.data);
                resetForm();
            })
            .catch(err => console.error(err));
    };

    /**
     * Hook que se ejecuta al montar el componente.
     * Inicializa las opciones de búsqueda para el historial de pedidos.
     */
    useEffect(() => 
    {
        optionSearchHistorial();
    }, []);

    return (
        <nav id="SearchOrderAdmin" className="navbar navbar-expand-lg bg-body-tertiary p-3">
            <div className="container-fluid">
                <form
                    className="d-flex flex-column flex-md-row align-items-md-center gap-2 w-100"
                    role="search"
                    onSubmit={searchHistorial}
                >
                    {/* ID Historial */}
                    <input
                        className="form-control w-100"
                        type="number"
                        placeholder="Buscar por ID Historial"
                        value={idHistorial}
                        onChange={(e) => setIdHistorial(e.target.value)}
                    />

                    {/* ID Usuario */}
                    <input
                        className="form-control w-100"
                        type="number"
                        placeholder="Buscar por ID Usuario"
                        value={idUsuario}
                        onChange={(e) => setIdUsuario(e.target.value)}
                    />

                    {/* Nombre */}
                    <input
                        className="form-control w-100"
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />

                    {/* Apellidos */}
                    <input
                        className="form-control w-100"
                        type="text"
                        placeholder="Apellidos"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                    />

                    {/* Estado */}
                    <select
                        className="form-select w-100 w-md-auto"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    >
                        <option value="">Estado</option>
                        {OpcionesBusqueda.estado &&
                            OpcionesBusqueda.estado.map((e, i) => (
                                <option key={i} value={e}>{e}</option>
                            ))
                        }
                    </select>

                    {/* Botones */}
                    <div className="d-flex gap-2 w-100 justify-content-md-end">
                        <button className="btn btn-outline-success w-50 w-md-auto" type="submit">
                            Buscar
                        </button>
                        <button
                            className="btn btn-outline-danger w-50 w-md-auto"
                            type="reset"
                            onClick={resetForm}
                        >
                            Reiniciar
                        </button>
                        <button
                            className="btn btn-outline-primary w-50 w-md-auto"
                            type="button"
                            onClick={showAllHistorial}
                        >
                            Mostrar todos
                        </button>
                    </div>
                </form>
            </div>
        </nav>
    );
};

export { SearchOrder };
