//1.
//importing express for routing the the different routes that will come for user routes
import express from 'express';
import { isSellerAuth, logoutSeller, sellerLogin } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';
 
//2.
//router object
const sellerRouter = express.Router();


sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/is-auth', authSeller,isSellerAuth);
sellerRouter.get('/logout',authSeller ,logoutSeller);


export default sellerRouter;