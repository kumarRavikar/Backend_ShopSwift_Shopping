import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./DataBase/db.js";
import userRoutes from "./Routes/userRoutes.js";
import productRouter from "./Routes/productRoutes.js";

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "*",
  credentials:true,
   allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/products", productRouter )
// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.log("Server Error:", error);
  }
};

startServer();