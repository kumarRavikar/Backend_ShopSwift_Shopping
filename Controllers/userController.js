import { UserModel } from "../Models/userModel.js";
import bcryptjs, { compare } from "bcryptjs"
import jwt from 'jsonwebtoken'
import verifyEmail from "../EmailVerify/emailVeify.js";
import { SessionModel } from "../Models/sessionModel.js";
import { sendOTPMail } from "../EmailVerify/sendOTPMail.js";
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
export const reVerification = async(req, res)=>{
    try {
        const {email} = req.body;
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:'User Not Found'
            })
        }
        const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'10m'});
        verifyEmail(token, email);
        user.token = token;
        await user.save();
        return res.status(200).json({
            success:true,
            message:'Verification email sent again',
            token:user.token
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const login = async(req, res)=>{
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'All Fields Are Importent'
            })
        }
        const existingUser =await UserModel.findOne({email})
        if(!existingUser){
            return res.status(400).json({
                success:false,
                message:"User not exists"
            })
        }
        const ispasswordValid = await bcryptjs.compare(password, existingUser.password);
        if(!ispasswordValid){
            return res.status(400).json({
                success:false,
                message:'invalid credentials'
            })
        }
        if(existingUser.isVerified === false){
            return res.status(400).json({
                success:false,
                message:'Verify your account then logIn'
            })
        }
        // generating token 
        const accissToken = jwt.sign({id:existingUser._id},process.env.SECRET_KEY,{expiresIn:'15d'});
        const refreshToken = jwt.sign({id:existingUser._id},process.env.SECRET_KEY,{expiresIn:'30d'})
        existingUser.isVerified = true;
        existingUser.isLoggedIn = true
         await existingUser.save()
         // checking session already exist and delete 
         const existingSession = await SessionModel.findOne({userId:existingUser._id}) ;
         if(existingSession){
            await SessionModel.deleteOne({userId:existingUser._id})
         }
         
         //creating new session     
         await SessionModel.create({userId:existingUser._id})
         
         return res.status(200).json({
            success:true,
            message:`Welcome Back ${existingUser.firstName}`,
            user:existingUser,
            accissToken,
            refreshToken
         })
    } catch (error) {
         return res.status(500).json({
            success:false,
            message:error.message
         })
    }
}
export const logout = async(req, res)=>{
    try {
         const userId = req.id
         await SessionModel.deleteMany({userId:userId});
         await UserModel.findByIdAndUpdate(userId,{isLoggedIn:false})
         return res.status(200).json({
            success:true,
            message:"User LogOut SuccessFully"
         })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const forgotPassword = async(req, res)=>{
     try {
        const {email} = req.body;
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User Not Found"
            })
        }
        const otp = Math.floor(10000 + Math.random()*90000).toString()
        const otpExp = new Date(Date.now()+10*60*1000) // this will create 10 min
        user.otp = otp;
        user.otpExpirey = otpExp
        await user.save()
        await sendOTPMail(otp, email)
        return res.status(200).json({
            success:true,
            message:'OTP sent Successfully'
        })
     } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
     }
}
export const verifyOTP = async(req, res)=>{
    try {
        const {otp} = req.body 
        const email = req.params.email //geting a id from email params
        if(!otp){
            return res.status(400).json({
                success:false,
                message:"OTP is required"
            })
        }
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        if(!user.otp || !user.otpExpirey){
            return res.status(400).json({
                success:false,
                message:"OTP is not generated or already verified"
            })
        }
        if(user.otpExpirey < new Date()){
            return res.status(400).json({
                success:false,
                message:"OTP has been expired request for new OTP"
            })
        }
        if(otp !== user.otp){
            return res.status(400).json({
                success:false,
                message:"OTP does Not Matched"
            })
        }
        user.otp = null;
        user.otpExpirey = null;
        await user.save();
        return res.status(200).json({
            success:true,
            message:"OTP verified successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const changePassword = async(req, res)=>{
    try {
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message 
        })
    }
}