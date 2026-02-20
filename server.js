import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./DataBase/db.js";
import userRoutes from "./Routes/userRoutes.js"
const app = express();
const PORT = process.env.PORT || 3000
app.use(cors()); // it will use for cross origine resource sharing
app.use(express.json()); // handling json 
app.use('/api/user', userRoutes)
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    connectDB();
})