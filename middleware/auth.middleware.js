import  jwt  from "jsonwebtoken";
import { UserModel } from "../Models/userModel.js";

export const isAuthenticated = async(req, res, next)=>{
    try {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(400).json({
                success:false,
                message:"Authorization Token missing or invalid"
            })
        }
        const token = authHeader.split(" ")[1];
        let decode ;
        try {
             decode = jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            if(error.message === "TokenExpiredError"){
                return res.status(400).json({
                    success:false,
                    message:'Registered Token Has Expired'
                })
            }
            return res.status(400).json({
                success:false,
                message:"Access token is missing or invalid"
            })
        }
        const user = await UserModel.findById(decode.id);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User Not Found"
            })
        }
        req.user = user
        req.id = user._id
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const isAdmin = async(req, res, next)=>{
    try {
        if(req.user && req.user.role === "admin"){
            next()
        }else{
            return res.status(403).json({
                success:false,
                message:"Only Admin can access"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}