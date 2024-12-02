const express = require("express");
require('dotenv').config();
const cors = require('cors');
const mongoose = require("mongoose");
const multer = require("multer");  // Para manejar uploads de imágenes
const product_routes = require('./routes/product_route');
const category_routes = require('./routes/category_route');
const coupon_routes = require("./routes/coupon_route");
const userRouter = require('./routes/UserRouter');
const cartRoute = require('./routes/cart_route');

const api_prefix = process.env.API_PREFIX;
const app = express();
app.use(cors());
app.use(express.json());  // Manejo de JSON en las solicitudes
app.use(express.urlencoded({ extended: true }));  // Manejo de formularios

const port = process.env.APP_PORT;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Iniciar conexión con MongoDB y rutas
main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(process.env.CONN_STRING);
    console.log("Connected to the database");

    app.use(`${api_prefix}/products`, product_routes);  // Rutas de productos
    app.use(`${api_prefix}/categories`, category_routes);
    app.use(`${api_prefix}/users`, userRouter);
    app.use(`${api_prefix}/coupon`, coupon_routes);
    app.use(`${api_prefix}/cart`, cartRoute);

    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
}
