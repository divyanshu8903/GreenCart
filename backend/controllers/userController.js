import User from "../models/user.js"; // Added .js extension
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Changed to bcryptjs

// Register User
// access Public
// api/user/register

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details!" }); // Changed to 400
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" }); // Changed to 400
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript access to cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookie in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
    });

    return res
      .status(201)
      .json({ success: true, user: { email: user.email, name: user.name } , token: token}); // Changed to 201
  } catch (error) {
    console.error(error); // Log the entire error object
    res.status(500).json({ success: false, message: "Internal server error" }); // Changed to 500 and message
  }
};



// Login User
// access Public
// api/user/login


export const loginUser = async(req, res) => {

  try {
    const {email, password} = req.body;

    if(!email || !password){
      return res.json({success: false, message: "Email and Password required!"});
    }
    const user = await User.findOne({email});

    if(!user){
      return res.json({success: false, message: "Invalid Email and Password!"});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      return res.json({success : false, message: "Invalid Email or Password!"})
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript access to cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookie in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
    });

    return res
      .status(201)
      .json({ success: true, user: { email: user.email, name: user.name }, token : token  });


  } catch (error) {
    
    console.error(error.message);
    res.json({success : false, message: error.message})

  }

}


//Check auth 
//api/user/is-auth

export const isAuth = async(req, res) =>{
  // console.log(req);
  try {
    
    const userId = req.userId;
    

    const user = await User.findById(userId).select("-password");
    
    return res.json({success : true, user});

  } catch (error) {
    console.error(error.message);
    res.json({success : false, message: error.message})
  }

} 


//logout user
//access public
//api/user/logout

export const logoutUser = (req, res) =>{

  try {
    res.clearCookie('token', {
      httpOnly : true,
      secure : process.env.NODE_ENV === 'production',
      sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });

    return res.json({success : true, message : "Logged Out!"})

  } catch (error) {
    console.error(error.message);
    res.json({success : false, message: error.message})
  }


}