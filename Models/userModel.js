import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    profilePic:{type:String, default:""},
    profilePicPublicId:{type:String}, // cloudnery profil pic public id for delete 
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    address:{type:String},
    city:{type:String},
    pinCode:{type:String},
    phoneNo:{type:String},
    role:{type:String, enum:['user','admin'], default:'user'},
    isVerified:{type:Boolean, default:false},
    isLoggedIn:{type:Boolean, default:false},
    token:{type:String, default:null},
    otp:{type:String, default:null},
    otpExpirey:{type:Date, default:null}
},{timestamps:true})
 
export  const UserModel = mongoose.model('Users',userSchema)