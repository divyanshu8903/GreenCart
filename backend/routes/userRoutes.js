
//1.
//importing express for routing the the different routes that will come for user routes
import express from 'express';
 


//3.
//imoprting the controller functions to make changes in DB using models
import {registerUser, loginUser, isAuth, logoutUser} from '../controllers/userController.js'


//5. Importing the middlware for authentication
import authUser from '../middlewares/authUser.js'

//2.
//router object
const userRouter = express.Router();



//4.
//Route and function for register the user
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/is-auth',authUser, isAuth);
userRouter.get('/logout', authUser, logoutUser);




export default userRouter;