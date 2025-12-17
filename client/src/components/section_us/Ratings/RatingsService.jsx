//Importaciones funcionales
import { useEffect, useState } from "react";
import axios from "axios";

//Importaciones diseño
import Alert from "@mui/material/Alert";
import "../../../assets/CSS/SectionUs/Ratings.css";

const RatingsService = () => 
{
  //Declaración de constantes
  const [ratingsServices, setRatingsServices] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [sortOrder, setSortOrder] = useState("ratingAsc");

  /**
 * Hook que carga las valoraciones de servicios al montar el componente.
 */
  useEffect(() => 
  {
    fetchRatings();
  }, []);

  /**
   * Obtiene todas las valoraciones de servicios desde el backend.
   * Actualiza el estado `ratingsServices`.
   * Maneja errores mostrando alertas si la petición falla.
   */
  const fetchRatings = () => 
  {
    axios.get("http://localhost:3000/getRatingsServices") // Ajusta la ruta según tu backend
    .then((res) => 
      setRatingsServices(res.data)
    )
    .catch((err) => 
    {
      console.error(err);
      setAlertMessage("No se ha podido cargar las valoraciones");
      setAlertSeverity("error");
    });
  };

  /**
   * Renderiza visualmente la puntuación en estrellas.
   *
   * @param {number|string} rating - Valoración del servicio (0 a 5).
   * @returns {JSX.Element[]} Array de elementos span representando las estrellas.
   */
  const renderStars = (rating) => 
  {
      const maxStars = 5;
      const stars = [];
      const numericRating = Number(rating); // <-- convertir a número

      for (let i = 1; i <= maxStars; i++) 
      {
          stars.push( <span key={i} style={{ color: i <= numericRating ? 'gold' : '#ccc' }}>★</span>);
      }

      return stars;
  };  

  /**
   * Renderiza la lista de valoraciones de servicios.
   *
   * 1. Crea una copia de `ratingsServices` para no modificar el estado original.
   * 2. Ordena las valoraciones según `sortOrder`:
   *    - "ratingAsc": de menor a mayor puntuación.
   *    - "ratingDesc": de mayor a menor puntuación.
   * 3. Renderiza cada valoración con:
   *    - Imagen del usuario (o imagen por defecto si no hay).
   *    - Nombre, puntuación en estrellas y comentario.
   *    - Fecha de la valoración formateada.
   *
   * @returns {JSX.Element[]} Lista de elementos JSX representando las valoraciones.
   */
  const renderServices = () => 
  {
    let ratingsCopy = [...ratingsServices];
    if (sortOrder === "ratingAsc") 
    {
        ratingsCopy.sort(function(a, b) 
        {
        return Number(a.puntuacion) - Number(b.puntuacion);
        });
    } 
    else if (sortOrder === "ratingDesc") 
    {
        ratingsCopy.sort(function(a, b) 
        {
          return Number(b.puntuacion) - Number(a.puntuacion);
        });
    }
    return ratingsCopy.map((item, index) => (
        <div key={index} className="rating-item">
           <div>
                <div>
                  {!item.imagen || item.imagen === "null" ? (
                      <img src="/ProfileUserImage/DefaultImage.jpg" width="80" alt={item.nombre} />
                  ) : (
                      <img src={item.imagen} width="80" alt={item.nombre} />
                  )}
                </div>
                <div>
                    <h4>{item.nombre}</h4>
                    <p>Puntuación: {renderStars(item.puntuacion)} / 5</p>
                    <p>Comentario: {item.comentario}</p>
                </div>
           </div>
           <div>
                <p>{new Date(item.fecha_valoracion).toLocaleDateString()}</p>
           </div>
        </div>
    ));
  };

  return (
    <div className="ratings-service-container">
      <h2>Valoraciones de los usuarios</h2>

      <div>
        <p>Ordenar por:</p>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="ratingAsc">Rating peores valoraciones</option>
          <option value="ratingDesc">Rating mejores valoraciones</option>
        </select>
      </div>

      {alertMessage && (
        <Alert
          severity={alertSeverity}
          onClose={() => setAlertMessage("")}
          style={{ marginBottom: "10px" }}
        >
          {alertMessage}
        </Alert>
      )}
      <div>{renderServices()}</div>
    </div>
  );
};

export { RatingsService };
