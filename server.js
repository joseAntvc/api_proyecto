const express = require("express");
require('dotenv').config()
const cors = require('cors')
const mongoose = require("mongoose");
const product_routes = require('./routes/product_route');
const category_routes = require('./routes/category_route');
const userRouter = require('./routes/UserRouter');
const cartRoute = require('./routes/cart_route');
const authJwt = require('./libs/jwt')

const api_prefix = process.env.API_PREFIX 
const app = express();
app.use(cors());
app.use(express.json()); 
app.use(authJwt())

const port = process.env.APP_PORT;

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(process.env.CONN_STRING);

    console.log("Connected to the database");
    app.use(`${api_prefix}/products`, product_routes);
    app.use(`${api_prefix}/categories`, category_routes);
    app.use(`${api_prefix}/users`, userRouter);
    app.use(`${api_prefix}/cart`, cartRoute);
    app.listen(port, () => { 
        console.log(`listening on port ${port}`);
    })
}

 