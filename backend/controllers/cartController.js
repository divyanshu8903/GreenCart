import User from "../models/user.js";



//Update user cart data 
//access public
//api/cart/update
export const updateCart = async (req, res) => {

    try {
        const userId = req.userId;
        const { cartItems} = req.body;
        if(!cartItems){
            res.status(400).json({success : false, message : "Cart is Empty!"});
        }
        // console.log(userId, cartItems);
        await User.findByIdAndUpdate(userId, {cartItems});
        res.json({success : true, message : "Cart Updated!"})

    } catch (error) {
        console.error(error.message);
        return res.json({success: false, message : error.message})
    }

}