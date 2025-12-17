//Importaciones funcionales
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
//Importaciones diseño
import '../../assets/CSS/section_home_components/index.css';
//Importar componentes
import CardCarrusel3D from './support_components/CardCarrusel3D';
import BannerNavidad from './support_components/BannerNavidad';
import TopRatedProduct from './support_components/TopRatedProduct';
import TopRankingUsers from "./support_components/TopRankingUsers";

export function Inicio()
{
    //Declaración de constantes
    const [ofertas, setOfertas] = React.useState([]);
    const [productos, setProductos] = React.useState([]);
    const navigate = useNavigate();

    useEffect(() => 
    {
        // 1️⃣ Traer todas las ofertas
        fetch("http://localhost:3000/getOffers")
            .then(res => res.json())
            .then(data => setOfertas(data))
            .catch(err => console.log(err));

        // 2️⃣ Traer todos los productos
        fetch("http://localhost:3000/getProducts")
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.log(err));
    }, []);

    const productosConOferta = productos.filter(
    producto =>ofertas.some(oferta => oferta.id_postre === producto.id_postre));

    const productosAleatorios = productosConOferta.sort(() => 0.5 - Math.random()).slice(0, 3);

    const irAlCatalogoNavidad = () => 
    {
        navigate("/catalogo", { state: { temporada: "Navidad" } });
    };

    const irAlaOferta= (id_postre) => 
    {
        navigate("/catalogo", { state: {id_postre} });
    };
    return(
        <>
            <section className="banner-section">
                <div className="banner-container">
                    {/* Rectángulo de texto encima */}
                    <div className="banner-text">
                        <h2>Sabores que cruzan fronteras</h2>
                    </div>

                    {/* Videos lado a lado */}
                    <div className="videos-container">
                        <video autoPlay loop muted>
                            <source src="/Video/Banner1.mp4" type="video/mp4" />
                        </video>
                        <video autoPlay loop muted>
                            <source src="/Video/Banner2.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </section>
            <section className="card-carrusel-3d-section">
                <CardCarrusel3D/>
            </section>
            {productosAleatorios.length > 0 && (
                <>
                    <div className="line" />
                    <section className="ofertas py-4">
                        <h3 className="text-center mb-4">Ofertas</h3>
                        <div className="container">
                            <div className="row">
                                {productosAleatorios.map((producto) => {
                                    const oferta = ofertas.find(o => o.id_postre === producto.id_postre);

                                    return (
                                        <div className="col-md-4 mb-3" key={producto.id_postre}>
                                            <div className="card">
                                                {!producto.imagen || producto.imagen === "null" ? (
                                                    <img
                                                        src="/ProductImage/404product.jpg" 
                                                        className="card-img-top"
                                                        alt={producto.nombre}
                                                    />
                                                ) : (
                                                    <img
                                                        src={producto.imagen}
                                                        className="card-img-top"
                                                        alt={producto.nombre}
                                                    />
                                                )}
                                                <div className="card-body">
                                                    <h5 className="card-title">{producto.nombre}</h5>
                                                    <p className="card-text">
                                                        {oferta
                                                            ? oferta.tipo === "descuento"
                                                                ? `Descuento: ${oferta.valor}%`
                                                                : "Oferta especial"
                                                            : ""}
                                                    </p>
                                                </div>
                                                <div className="card-footer text-center">
                                                    <button className="btn btn-danger" onClick={() => irAlaOferta(producto.id_postre)}>Ver Oferta</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </>
            )}
            <section className="promocion-navidad-section text-center">
                <BannerNavidad filterBySeason={irAlCatalogoNavidad}/>
            </section>
            <section className="cumpleanos d-flex justify-content-between align-items-center">
                <div className="cumpleanoscontent">
                    <h3>Celebra tu cumpleaños con nosotros</h3>
                    <p>🎉¡Es tu cumpleaños! 🎉 Te lo mereces todo… ¡empezando por este regalo!🎉</p>
                </div>
                <div>
                    <img src="Image/SWEETCULTUREtaza.png" alt="Tazas de cumpleaños" />
                </div>
            </section>
            <section>
                <h3>Ranking del mejor postre</h3>
                <TopRatedProduct/>
            </section>
            <section>
                <h3>Ranking al mejor cliente</h3>
                <TopRankingUsers/>
            </section>
        </>
    );
}