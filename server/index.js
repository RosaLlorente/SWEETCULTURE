require('dotenv').config();
const express = require('express');
const multer = require("multer");
const upload = multer();
const path = require("path");
const Cors = require('cors');
const PORT = process.env.PORT || 3000;
const { addProduct, getProducts, updateProduct, deleteProduct, optionSearchProducts, optionSearchProductsAdmin, searchProduct, } = require('./DataBase/Controllers/productController');
const { addUser,searchUser,searchUserID,updateUser,getTopRatingedUsers } = require('./DataBase/Controllers/userController');
const {addOffer,getOffers,optionSearchOffer,searchOffer,updateOffer,deleteOffer} = require ('./DataBase/Controllers/offerController');
const { addRating,getRatingsServices } = require('./DataBase/Controllers/serviceRatingsController');
const { addRatingProduct,getRatingsProduct,getMeanRatingProduct,getTopRatingedProducts} = require('./DataBase/Controllers/productRatingsController');
const { newOrder,getCurrentOrder,addItemToOrder,removeItemFromOrder,getOrderDetailsEspecificProduct,updateOrderStatus,deleteOrder,
    addToHistorial,getUsersOrders,getUserOrders,updateOrderHistorial,deleteOrderHistorial,searchHistorial } = require('./DataBase/Controllers/orderController');
const{getVentasTotales,getPedidosTotales,getVentasPorEstado,getBestProduct,getTop5SoldProducts,getTop5RatedProducts,getSalesPerProduct,getTotalUsers,getTopUsuarios}= require('./DataBase/Controllers/stadisticAdminController');

const app = express();
app.use(Cors());
app.use(express.json());
require("./ResetEffects/cronJobs");

// Configuración multer
const Productstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../client/public/ProductImage"));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const uploadProductImage = multer({ storage: Productstorage });


const Userstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../client/public/ProfileUserImage"));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const uploadUsertImage = multer({ storage: Userstorage });



//Rutas de acceso a la tabla de usuarios
app.post("/addUser", uploadUsertImage.single("Imagen"), addUser);
app.post("/searchUser", searchUser);
app.put("/updateUser/:id_usuario", uploadUsertImage.single("imagen"), updateUser);
app.get("/getTopRatingedUsers",getTopRatingedUsers);

// Rutas de acceso a la tabla de productos
app.post("/addProduct", uploadProductImage.single("imagen"), addProduct);
app.get("/getProducts", getProducts);
app.get("/optionSearchProducts", optionSearchProducts);
app.get("/optionSearchProductsAdmin", optionSearchProductsAdmin);
app.post("/searchProduct", searchProduct);
app.put("/updateProduct/:id_postre", uploadProductImage.single("imagen"), updateProduct);
app.delete("/deleteProduct/:id_postre", deleteProduct);

//Rutas de acceso a la tabla de ofertas
app.post("/addOffer", upload.none(), addOffer);
app.get("/getOffers", getOffers);
app.get("/optionSearchOffer", optionSearchOffer);
app.post("/searchOffer", searchOffer);
app.put("/updateOffer/:id_oferta", uploadProductImage.single("imagen"), updateOffer);
app.delete("/deleteOffer/:id_postre", deleteOffer);

// Ruta de acceso a la tabla de valoraciones de servicios
app.post("/addRating", upload.none(), addRating);
app.get("/getRatingsServices", getRatingsServices);

// Ruta de acceso a la tabla de valoraciones de productos
app.post("/addRatingProduct", upload.none(), addRatingProduct);
app.get("/getRatingsProduct", getRatingsProduct);
app.get("/getMeanRatingProduct/:id_postre", getMeanRatingProduct);
app.get("/getTopRatingedProducts", getTopRatingedProducts);

//Rutas de acceso a la tabla de pedidos
app.post("/newOrder", upload.none(), newOrder);
app.get("/getCurrentOrder/:id_usuario",getCurrentOrder)
app.post("/addItemToOrder", upload.none(), addItemToOrder);
app.post("/removeItemFromOrder",  upload.none(), removeItemFromOrder);
app.get("/getOrderDetailsEspecificProduct/:id_pedido/:id_postre",getOrderDetailsEspecificProduct);
app.post("/updateOrderStatus", upload.none(), updateOrderStatus);
app.post("/addToHistorial", upload.none(), addToHistorial)
app.delete("/deleteOrder", deleteOrder);

//Ruta de acceso a la tabla de historial de pedidos
app.get('/getUsersOrders',getUsersOrders);
app.get('/getUserOrders/:id_usuario', getUserOrders);
app.post("/updateOrderHistorial", upload.none(), updateOrderHistorial);
app.delete('/deleteOrderHistorial',deleteOrderHistorial);
app.post("/searchHistorial", searchHistorial);

//Ruta de acceso a las estadisticas de administración
app.get('/getVentasTotales',getVentasTotales);
app.get('/getPedidosTotales',getPedidosTotales);
app.get('/getVentasPorEstado',getVentasPorEstado);
app.get('/getBestProduct',getBestProduct);
app.get('/getTop5SoldProducts',getTop5SoldProducts);
app.get('/getTop5RatedProducts',getTop5RatedProducts);
app.get('/getSalesPerProduct',getSalesPerProduct);
app.get('/getTotalUsers',getTotalUsers);
app.get('/getTopUsuarios',getTopUsuarios);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

