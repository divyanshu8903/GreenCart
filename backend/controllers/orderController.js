import Order from "../models/Order.js";
import Product from "../models/product.js";
import stripe from "stripe";
import User from "../models/user.js"

// Place order COD:  /api/order/cod

export const placeOrderCOD = async (req, res) => {

    try {
        const {userId, items, address} = req.body;

        if(!address ){
            return res.json({success : false, message : "Please select address!"})
        }
        if(items.length ===0){
            return res.json({success : false , message : "Please select at least 1 item!"})
        }

        //Calculate amount using items

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);

            return (await acc) + product.offerPrice * item.quantity;
        }, 0)


        //Add tax charge 2%
        amount += Math.floor(amount*0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"COD",
        })


        return res.json({success : true, message : "Order Placed Successfully!"})

    } catch (error) {
        return res.json({success: false, message : error.message})
    }

}

// Place order stripe:  /api/order/stripe

export const placeOrderStripe = async (req, res) => {

    try {
        const {userId, items, address} = req.body;
        const {origin}=req.headers;

        if(!address){
            return res.json({success : false, message : "Please select address!"})
        }
        if(items.length===0){
            return res.json({success : false , message : "Please select at least 1 item!"})
        }

        let productData=[];

        //Calculate amount using items

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name:product.name,
                price:product.offerPrice,
                quantity:item.quantity,
            });
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)


        //Add tax charge 2%
        amount += Math.floor(amount *0.02);
        amount*=100;

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"Online",
        })


        // Stripe Gateway initialize

        const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY);

        // create line items for stripe

        const priceMultiplier = 1000;

        const line_items=productData.map((item)=>{
            return {
                price_data:{
                    currency:"inr",
                    product_data:{
                        name:item.name,
                    },
                    unit_amount: Math.round(item.price * 1.02 * priceMultiplier * 100), // paise
                },
                quantity:item.quantity,
            }
        })

        //create session
        const session=await stripeInstance.checkout.sessions.create({
            line_items,
            mode:"payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url:`${origin}/cart`,
            metadata:{
                orderId:order._id.toString(),
                userId,
            }
        })

        return res.json({
            success : true, 
            url:session.url, 
            message : "Order Placed Successfully!"
        })
    } catch (error) {
        return res.json({success: false, message : error.message})
    }

}


// Stripe webhooks to verify payments action : /stripe
export const stripeWebHooks=async(req,res)=>{

    // Stripe Gateway Initialize

    const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY);

    const sig=req.headers["stripe-signature"];
    let event;
    try {
        event=stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        res.status(400).send(`Webhook Error: ${error.message}`)
    }

    // Handle the event

    switch(event.type){
        case "payment_intent.succeeded":{
            const paymentIntent=event.data.object;
            const paymentIntentId=paymentIntent.id;

            // Getting session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const {orderId,userId}=session.data[0].metadata;

            // Mark payment as paid

            await Order.findByIdAndUpdate(orderId, {isPaid: true})

            // Clear user Cart

            await User.findByIdAndUpdate(userId,{});
            break;
        }           
        case "payment_intent.payment_failed":{
            const paymentIntent=event.data.object;
            const paymentIntentId=paymentIntent.id;

            // Getting session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const {orderId}=session.data[0].metadata;

            await Order.findByIdAndDelete(orderId);
            break;
        }
        default:
            console.error(`Unhandled event type ${event.type}`)
            break;
    }
    res.json({recieved:true})
}


//Get orders by user id

// /api/order/user

export const getUserOrders = async(req, res) =>{

    try {
        const userId = req.userId;
        const orders = await Order.find({
            userId,
            $or: [{paymentType: "COD"}, {isPaid : true}]
        }).populate("items.product address").sort({createdAt : -1});

        res.json({success : true, orders})

    } catch (error) {
        return res.json({success: false, message : error.message})
    }

}


//Get all orders (for seller /admin)
// /api/order/seller


export const getAllOrders = async(req, res) =>{

    try {

        const orders = await Order.find({
            $or: [{paymentType: "COD"}, {isPaid : true}]
        }).populate("items.product address").sort({createdAt : -1});

        res.json({success : true, orders})

    } catch (error) {
        return res.json({success: false, message : error.message})
    }

}