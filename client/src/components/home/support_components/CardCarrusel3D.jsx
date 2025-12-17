//Importaciones funcionales
import axios from "axios";
import { useState, useEffect } from "react";
//Importaciones diseño
import "../../../assets/CSS/section_home_components/support_components/CardCarrusel3D.css";

const CardCarrusel3D = () => {
	const API_URL= process.env.API_URL;
	/**
	 * Función que obtiene hasta 10 imágenes aleatorias de productos visibles desde el backend.
	 *
	 * 1. Hace una petición GET a "/getProducts".
	 * 2. Filtra solo los productos visibles (`ser_visible` === true).
	 * 3. Mezcla aleatoriamente los productos visibles.
	 * 4. Selecciona hasta 10 productos.
	 * 5. Retorna un array con las URLs de las imágenes.
	 *
	 * @returns {Promise<string[]>} Array de URLs de imágenes de productos.
	 */
	const get10RandomImages = async () => 
	{
		try {
			const response = await axios.get(`${API_URL}/getProducts`);
			const products = response.data;

			// Filtramos solo los productos visibles
			const visibleProducts = products.filter(product => product.ser_visible);

			if (visibleProducts.length === 0) 
			{
				return [];
			}

			// Mezclamos aleatoriamente sin modificar el array original
			const shuffled = [...visibleProducts].sort(() => 0.5 - Math.random());

			// Tomamos entre 1 y 10 productos
			const count = Math.min(10, shuffled.length);
			const selected = shuffled.slice(0, count);

			// Retornamos solo las URLs de las imágenes
			return selected?.map(product => product.imagen);
		} 
		catch (error) 
		{
			console.error("Error fetching products:", error);
			return [];
		}
	};
 

	const [images, setImages] = useState([]);

	/**
	 * Hook que carga las imágenes aleatorias al montar el componente.
	 */
	useEffect(() => 
	{
		const fetchImages = async () => {
		const imgs = await get10RandomImages();
		setImages(imgs);
		};
		fetchImages();
	}, []);


	/**
	 * Variables para cálculo de ángulos en un carrusel o disposición circular de tarjetas.
	 */
	const cardCount = images.length;
	const angle = 360 / cardCount;

	return (
		<>
			<div className="carrusel-3d-container">
				<div className="carrusel-3d">
					{images?.map((img, idx) => (
						<div
							className="carrusel-3d-card"
							key={idx}
							style={{
								transform: `rotateY(${idx * angle}deg) translateZ(340px)`
							}}
						>
							{!img || img === "null" ? (
								<img src="/ProductImage/404product.jpg" alt={`slide-${idx}`} />
                            ) : (
                                <img src={img} alt={`slide-${idx}`} />
                            )}
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default CardCarrusel3D;
