//Importaciones funcionales
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import {PrivateRoute} from './components/rutes/PrivateRoute.jsx';
import { AuthProvider } from "./components/main_components/AuthContext";

//Importaciones componentes principales
import {Error404} from './components/errors/Error404.jsx';
import { LandingPage } from './components/main_components/LandingPage.jsx';
import {Menu} from './components/main_components/Menu.jsx';
import {Footer} from './components/main_components/Footer.jsx';

//Importaciones modales del menu
import InicioSesionForm from './components/main_components/Modals/InicioSesionForm.jsx';
import RegistroFrom from './components/main_components/Modals/RegistroFrom.jsx';
import Perfil from './components/main_components/Modals/Perfil.jsx';

//Importaciones componentes 
import {Inicio} from './components/home/index.jsx';
import {Catalog} from './components/catalog/Catalog.jsx';
import {ProductDetail} from './components/catalog/ProductDetail/ProductDetail.jsx';
import { SectionUs } from './components/section_us/SectionUs.jsx';  
import { RatingsService } from './components/section_us/Ratings/RatingsService.jsx';
import { Contact } from './components/contact/Contact.jsx';

//Importaciones componentes de cliente
import { MyOrder } from './components/my_order/MyOrder.jsx';
import { OrderHistory } from './components/order_history/OrderHistory.jsx';

//Importaciones componentes de administración
import {AddProduct} from './components/admin_gestion/AddProduct/AddProduct.jsx';
import {ModifyProcuct} from './components/admin_gestion/ModifyProduct/ModifyProduct.jsx';
import { AddOffer } from './components/admin_gestion/AddOffer/AddOffer.jsx';
import { ModifyOffer } from './components/admin_gestion/ModifyOffer/ModifyOffer.jsx';
import {ModifyOrder} from './components/admin_gestion/ModifyOrder/ModifyOrder.jsx';
import {Stadistics} from './components/admin_gestion/Stadistic/Stadistic.jsx'

function App() 
{
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}


const AppContent = () =>
{
  const location = useLocation();
  const validRoutes = ['/', '/inicio', '/catalogo', '/addProduct', '/modifyProcuct', '/addOffer', '/modifyOffer','/detalle','/nosotros','/contactanos','/allRatingsServices', '/miPedido', '/orderHistory','/modifyOrder','/stadistics'];
  const invalidRoute = !validRoutes.includes(location.pathname);

  const showMenu = location.pathname !== '/' && !invalidRoute;
  const showFooter = location.pathname !== '/' && !invalidRoute;
  return (
    
        <div className="App">
          {showMenu && <Menu />}

           {/* //hay que añadir la opcion de que se proceda despues de dar al boton de entrar */}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/inicio" element={<div className="content"><Inicio /></div>} />
              <Route path="/catalogo" element={<div className="content"><Catalog /></div>} />
              <Route path="/detalle" element={<div className="content"><ProductDetail /></div>} />
              <Route path="/nosotros" element={<div className="content"><SectionUs /></div>} />
              <Route path="/contactanos" element={<div className="content"><Contact /></div>} />
              <Route path='/allRatingsServices' element={<div className="content"><RatingsService /></div>} />
              
              {/*RUTAS DE CLIENTE */}
              <Route path="/miPedido" element={
                  <div className="content"><MyOrder /></div>} />
              <Route path='/orderHistory' element={
                  <div className="content"><OrderHistory /></div>} />

              {/*RUTAS DE ADMIN */}
              <Route path="/addProduct" element={
                <PrivateRoute roles={["user", "admin"]}>
                <div className="content"><AddProduct /></div>
              </PrivateRoute>} />
              <Route path="/modifyProcuct" element={<PrivateRoute roles={["user", "admin"]}>
                <div className="content"><ModifyProcuct /></div>
              </PrivateRoute>} />
              <Route path="/addOffer" element={<PrivateRoute roles={["user", "admin"]}>
                <div className="content"><AddOffer /></div>
              </PrivateRoute>} />
              <Route path="/modifyOffer" element={<PrivateRoute roles={["user", "admin"]}>
                <div className="content"><ModifyOffer /></div>
              </PrivateRoute>} />
              <Route path="/modifyOrder" element={<PrivateRoute roles={["user", "admin"]}>
                <div className="content"><ModifyOrder /></div>
              </PrivateRoute>} />
              <Route path="/stadistics" element={<PrivateRoute roles={["user", "admin"]}>
                <div className="content"><Stadistics /></div>
              </PrivateRoute>} />

              {/*RUTAS DE ERROR*/}
              <Route path="*" element={<Error404 />} />
            </Routes>
             {showFooter && <Footer />}

          {/*Modales para controlar inicio de sesión y registro*/}
          <InicioSesionForm></InicioSesionForm>
          <RegistroFrom></RegistroFrom>
          <Perfil></Perfil>
        </div>
  );
}

export default App;
