import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../Controllers/productController.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.middleware.js";
import { multipalUploads } from "../middleware/multer.js";

const productRouter = express.Router();
productRouter.post(
  "/add_products",
  isAuthenticated,
  isAdmin,
  multipalUploads,
  addProduct,
);
productRouter.get("/all_products", getAllProducts);
productRouter.put(
  "/updateproduct/:productId",
  isAuthenticated,
  isAdmin,
  multipalUploads,
  updateProduct,
);
productRouter.delete(
  "/delete/:productId",
  isAuthenticated,
  isAdmin,
  deleteProduct,
);
productRouter.get("/singleproduct/:productId", getSingleProduct)
export default productRouter;
