//1.
//Express package for build express server
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import "dotenv/config";

//6.
//connection function for connect mongoDB
import connectDB from "./configs/db.js";

//Routers files imported for specific routes
import userRouter from "./routes/userRoutes.js";
import sellerRouter from "./routes/sellerRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoutes.js";
import orderRouter from "./routes/orderRoute.js";

import connectClodinary from "./configs/cloudinary.js";
import { stripeWebHooks } from "./controllers/orderController.js";

//2.
//created a server using express() function
const app = express();

//7.
//function call
await connectDB();
await connectClodinary();

//5.
//Allow multiple origins
const allowedOrigin = ["http://localhost:5173","https://green-cart-frontend-pi.vercel.app"];
app.post('/stripe',express.raw({type: `application/json`}),stripeWebHooks);

//4.
//Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigin, credentials: true }));

//3. created a port number for creating a server
const PORT = process.env.PORT || 4000;

//dummytest
app.get("/", (req, res) => res.send("API is working"));

//9. some routes middlwares for some specific route to make server code easy.
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

//listening on port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
