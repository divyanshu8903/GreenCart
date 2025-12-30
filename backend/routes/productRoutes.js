//1.
//importing express for routing the the different routes that will come for user routes
import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, productById, productsList } from '../controllers/productsController.js';


const productRouter = express.Router();

productRouter.post('/add', upload.array(["images"]), authSeller, addProduct);
productRouter.get('/list', productsList);
productRouter.get('/id', productById);
productRouter.post('/stock', authSeller, changeStock);


export default productRouter;