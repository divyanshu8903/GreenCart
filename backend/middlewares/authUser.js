import jwt from 'jsonwebtoken'

const authUser = async(req, res, next) =>{
    const {token} = req.cookies;
    console.log(token);

    
    if(!token){
        return res.status(400).json({success : false, message: "Not Authorized!"})
    }

    try {
        const tokenDecode = await jwt.verify(token, process.env.JWT_SECRET);
        console.log(tokenDecode);
        if(tokenDecode.id){
            
            req.userId = tokenDecode.id;
        }else{
            return res.status(400).json({success: false, message: "Not Authorized!"})
        }
        next();

    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}

export default authUser;