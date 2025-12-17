//Importaciones funcionales
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MyOrderUtils } from "../my_order/MyOrderUtils.jsx";

//Importaciones de diseño
import '../../assets/CSS/catalog/ViewProduct.css';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const ViewProduct = ({ productos }) => 
{
    //Declaración de constantes
    const { miPedido, AnadirProductoAlPedido, EliminarProductoAlPedido, getOrderDetailsEspecificProduct } = MyOrderUtils();
    const [productosEnPedido, setProductosEnPedido] = useState({});

    // Estado para mostrar texto completo si se desea
    const [expandedProducts, setExpandedProducts] = useState({});

    // Hook que sincroniza los productos del pedido con los productos disponibles
    useEffect(() => 
    {
        if (!miPedido || !productos) 
        {
            setProductosEnPedido({});
            return;
        }

        productos.forEach(product => 
        {
            if (miPedido?.id_pedido && product?.id_postre) 
            {
                getOrderDetailsEspecificProduct(
                    miPedido.id_pedido,
                    product.id_postre,
                    (item) => 
                    {
                        setProductosEnPedido(prev => ({ ...prev, [product.id_postre]: item }));
                    }
                );
            }
        });
    }, [miPedido, productos]);

    /**
     * truncateText
     * 
     * Función que recibe un texto y lo acorta si supera una longitud máxima.
     * Si el texto es más largo que `maxLength`, devuelve una versión truncada
     * terminada con "..." para indicar que hay más contenido.
     *
     * @param {string} text - El texto que se desea truncar.
     * @param {number} [maxLength=100] - La longitud máxima permitida antes de truncar.
     * @returns {string} - El texto truncado si excede `maxLength`, de lo contrario, el texto original.
     *
     */
    const truncateText = (text, maxLength = 100) => 
    {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    /**
     * toggleExpanded
     * 
     * Función que alterna el estado de expansión de un producto específico
     * en la interfaz. Esto permite mostrar u ocultar la descripción completa
     * o los ingredientes de un producto en la lista.
     *
     * @param {string|number} id - Identificador único del producto cuyo estado se desea alternar.
     *
     */
    const toggleExpanded = (id) => 
    {
        setExpandedProducts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    /**
     * Función que renderiza la lista de productos en el catálogo.
     *
     * 1. Añade información de ofertas a cada producto (`tieneOferta`, `oferta`).
     * 2. Filtra solo los productos visibles.
     * 3. Calcula las unidades restantes considerando las añadidas al pedido.
     * 4. Renderiza un Card por producto mostrando:
     *    - Imagen, nombre, descripción, precio y unidades disponibles.
     *    - Información de ofertas si aplica.
     *    - Botones para añadir/eliminar unidades al pedido.
     *    - Botón de "Más información" que navega a la página de detalle.
     *
     * @returns {JSX.Element[]} Lista de elementos `<li>` con los productos.
     */
    const renderProduct = () => 
    {
        const productosConOferta = productos?.map(p => 
        {
            if (p.id_oferta) 
            {
                return {
                    ...p,
                    tieneOferta: true,
                    oferta: 
                    {
                        id: p.id_oferta,
                        nombre: p.oferta_nombre,
                        tipo: p.tipo,
                        valor: p.valor
                    }
                };
            } 
            else 
            {
                return { ...p, tieneOferta: false };
            }
        });

        return productosConOferta
            .filter(p => p.ser_visible === 1 || p.ser_visible === true)
            ?.map((product, index) => {
                const item = productosEnPedido[product.id_postre];
                const unidadesRestantes = product.unidades - (item?.cantidad || 0);
                const isExpanded = expandedProducts[product.id_postre];

                return (
                    <li key={index}>
                        <Card sx={{ maxWidth: 345 }}>
                            {!product.imagen || product.imagen === "null" ? (
                                <CardMedia
                                    component="img"
                                    alt={product.nombre}
                                    height="140"
                                    image="/ProductImage/404product.jpg"
                                />
                            ) : (
                                <CardMedia
                                    component="img"
                                    alt={product.nombre}
                                    height="140"
                                    image={product.imagen}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h5">
                                    {product.nombre} temporada: {product.etiqueta_especial}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {isExpanded ? product.descripcion : truncateText(product.descripcion, 100)}
                                    {product.descripcion.length > 100 && (
                                        <Button size="small" onClick={() => toggleExpanded(product.id_postre)}>
                                            {isExpanded ? "Ver menos" : "Ver más"}
                                        </Button>
                                    )}
                                </Typography>

                                {product.ingredientes && (
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                        Ingredientes: {isExpanded ? product.ingredientes : truncateText(product.ingredientes, 80)}
                                    </Typography>
                                )}

                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {product.disponible
                                        ? `Unidades: ${unidadesRestantes} | Precio: $${product.precio}`
                                        : `No disponible actualmente | Precio: $${product.precio}`
                                    }
                                </Typography>
                                {product.tieneOferta && product.oferta && (
                                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold', mt: 1 }}>
                                        🌟 Oferta: {product.oferta.nombre} - {product.oferta.tipo === "descuento" ? `${product.oferta.valor}% de descuento` : product.oferta.tipo.toUpperCase()}
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions>
                                {product.disponible && product.unidades > 0 ? (
                                    item ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <Button
                                                size="small"
                                                onClick={() => EliminarProductoAlPedido(product.id_postre, 1)}
                                            >
                                                −
                                            </Button>
                                            <span>{item.cantidad} u</span>
                                            <Button
                                                size="small"
                                                onClick={() => AnadirProductoAlPedido(product.id_postre, 1)}
                                                disabled={item.cantidad >= product.unidades}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            size="small"
                                            onClick={() => AnadirProductoAlPedido(product.id_postre, 1)}
                                        >
                                            Añadir
                                        </Button>
                                    )
                                ) : (
                                    <Button size="small" disabled>No disponible</Button>
                                )}
                                <Link
                                    to="/detalle"
                                    state={{ producto: product }}
                                    style={{ textDecoration: "none" }}
                                >
                                    <Button size="small">Más información</Button>
                                </Link>
                            </CardActions>
                        </Card>
                    </li>
                );
            });
    };

    return (
        <div>
            <ul className="product-grid">
                {renderProduct()}
            </ul>
            {productos.length === 0 && (
                <p>No hay productos disponibles.</p>
            )}
        </div>
    );
};

export { ViewProduct };
