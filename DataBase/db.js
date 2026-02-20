import mongoose from "mongoose";
import 'dotenv/config'
const connectDB  = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/shopswift`)
        console.log('Database Connected Successfully')
    } catch (error) {
        console.log("DataBase connection faild : " , error)
    }
}
export default connectDB;