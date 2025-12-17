import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { upload } from "./Multerconfing/cloudinary.js";
import {PORT} from "./confing.js";
import "./ResetEffects/cronJobs.js";
import multer from "multer";


import { addProduct, getProducts, updateProduct, deleteProduct, optionSearchProducts, optionSearchProductsAdmin, searchProduct, } from './DataBase/Controllers/productController.js';
import { addUser,searchUser,updateUser,getTopRatingedUsers } from './DataBase/Controllers/userController.js';
import {addOffer,getOffers,optionSearchOffer,searchOffer,updateOffer,deleteOffer} from './DataBase/Controllers/offerController.js';
import { addRating,getRatingsServices } from'./DataBase/Controllers/serviceRatingsController.js';
import { addRatingProduct,getRatingsProduct,getMeanRatingProduct,getTopRatingedProducts} from'./DataBase/Controllers/productRatingsController.js';
import { newOrder,getCurrentOrder,addItemToOrder,removeItemFromOrder,getOrderDetailsEspecificProduct,updateOrderStatus,deleteOrder,
    addToHistorial,getUsersOrders,getUserOrders,updateOrderHistorial,deleteOrderHistorial,searchHistorial } from'./DataBase/Controllers/orderController.js';
import {getVentasTotales,getPedidosTotales,getVentasPorEstado,getBestProduct,getTop5SoldProducts,getTop5RatedProducts,getSalesPerProduct,getTotalUsers,getTopUsuarios} from'./DataBase/Controllers/stadisticAdminController.js';

app.use(cors({ 
  origin: [
    "https://sweetculture.vercel.app", 
    "https://sweetculture-git-main-rosallorentes-projects.vercel.app", // Tu dominio de la captura
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());


//Rutas de acceso a la tabla de usuarios
app.post("/addUser", upload.single("Imagen"), addUser);


app.post("/searchUser", searchUser);
app.put("/updateUser/:id_usuario", upload.single("Imagen"), updateUser);
app.get("/getTopRatingedUsers",getTopRatingedUsers);

// Rutas de acceso a la tabla de productos
app.post("/addProduct", upload.single("Imagen"), addProduct);
app.get("/getProducts", getProducts);
app.get("/optionSearchProducts", optionSearchProducts);
app.get("/optionSearchProductsAdmin", optionSearchProductsAdmin);
app.post("/searchProduct", searchProduct);
app.put("/updateProduct/:id_postre", upload.single("Imagen"), updateProduct);
app.delete("/deleteProduct/:id_postre", deleteProduct);

//Rutas de acceso a la tabla de ofertas
app.post("/addOffer", upload.none(), addOffer);
app.get("/getOffers", getOffers);
app.get("/optionSearchOffer", optionSearchOffer);
app.post("/searchOffer", searchOffer);
app.put("/updateOffer/:id_oferta", upload.none(), updateOffer);
app.delete("/deleteOffer/:id_oferta", deleteOffer);

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
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error("🔥 ERROR GLOBAL:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: "Error al subir archivo",
      details: err.message,
    });
  }

  res.status(500).json({
    error: "Error interno del servidor",
    details: err.message,
  });
});

