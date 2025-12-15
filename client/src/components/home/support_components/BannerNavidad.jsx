//Importaciones diseño
import '../../../assets/CSS/section_home_components/support_components/BanerNavidad.css';
const BannerNavidad = ({ filterBySeason }) => {
    return (
        <div className="banner-navidad">
            <div className="banner-container">
                <div>
                    <p>
                        Porque estas fiestas son el momento perfecto para hacer una pausa, sonreír y darte ese capricho que tanto mereces…  
                        y qué mejor manera de celebrarte que con algo verdaderamente dulce. Disfruta, comparte y déjate envolver por el sabor 
                        de la Navidad.
                    </p>
                </div>
                <div>
                    <button 
                        className="btn-lg px-4" 
                        onClick={() => filterBySeason("Navidad")}
                    >
                        Ir a ver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BannerNavidad;
