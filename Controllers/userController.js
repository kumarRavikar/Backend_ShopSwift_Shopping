import { UserModel } from "../Models/userModel.js";
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'
import verifyEmail from "../EmailVerify/emailVeify.js";
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body; //extrect from frontend 

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await UserModel.findOne({ email }); //find user which has already exixt 

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User Already exists"
            });
        }
        const hasedPassword = await bcryptjs.hash(password,10) // hasing password 
        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password:hasedPassword // set hased password
        });
        const token = jwt.sign({id:newUser._id}, process.env.SECRET_KEY,{expiresIn:'10m'}) // creating token 
        verifyEmail(token, email); // sending email from here
        newUser.token = token; 
         await newUser.save();
        return res.status(201).json({
            success: true,
            message: "New User Added Successfully",
            user: newUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const verify = async(req,res)=>{
   try {
     const authHeader = req.headers.authorization; //Extract Bearer token from authorization header
     if(!authHeader || !authHeader.startsWith("Bearer ")){
         return res.status(400).json({
             success:false,
             message:"Authroization token is missing or invalid"
         })
     }
     const token = authHeader.split(" ")[1]; 
     let decoded;
     try {
        decoded = jwt.verify(token,process.env.SECRET_KEY) //has a id of the user by token and secret key 
     } catch (error) {
        if(error.name === "TokenExpiredError"){
            return res.status(400).json({
                success:false,
                message:"The registration token is expired"
            })
        }
        return res.status(400).json({
            success:false,
            message:"Token Verificarion faild"
        })
     }
     const user = await UserModel.findById(decoded.id); // find the user by id 
     if(!user){
        return res.status(400).json({
            success:false,
            message:"User Not Found"
        })
     }
     user.token = null;
      user.isVerified = true; 
      await user.save();
      return res.status(200).json({
        success:true,
        message:"Email verified successful"
      })
   } catch (error) {
      return res.status(500).json({
        success:false,
        message:error.message
      })
   }
}