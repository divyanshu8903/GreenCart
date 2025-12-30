import Address from "../models/address.js";


//add address 
// /apiaddress/add

export const addAddress = async(req, res) => {

    try {
        const userId = req.userId;
        const {address} = req.body;

        await Address.create({...address, userId})

        res.json({success: true, message: "Address added successfully!"})
        

    } catch (error) {
        console.error(error.message);
        return res.json({success: false, message : error.message})
    }
} 



//get the address
// /api/address/get

export const getAddress = async(req, res) => {

    try {
        
        const userId = req.userId;

        const addresses = await Address.find({userId})

        if(addresses.length > 0){
            res.json({success :true, addresses})
        }else{
            res.json({success: false, message: "Please an address first"})
        }

    } catch (error) {
        console.error(error.message);
        return res.json({success: false, message : error.message})
    }
}