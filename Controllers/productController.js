import { ProductModel } from "../Models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;
    const userId = req.id;
    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }
    //handling multipal image uploads
    const productImg = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileUri = getDataUri(file);
        //create a folder in cloudinary with name mern_products and stors the array of image
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products",
        });
        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    const newProduct = await ProductModel.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImg, // productImg store array of object with url and public_id
    });
    return res.status(200).json({
      success: true,
      message: "Product Added Successfull",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "no product available",
        products: [],
      });
    }
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }
    //delete images from cloudinary
    if (product.productImg && product.productImg.length > 0) {
      for (const img of product.productImg) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }
    // delete product from DB
    await ProductModel.findByIdAndDelete(productId);
    return res.status(200).json({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImg,
    } = req.body;
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }
    let updatedImg = [];
    // keep selected old images
    if (existingImg) {
      const keepIds = JSON.parse(existingImg);
      updatedImg = product.productImg.filter((img) =>
        keepIds.includes(img.public_id),
      );
      //delete only removed images
      const removedImages = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id),
      );
      for (let img of removedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      updatedImg = product.productImg; // keep all if noting sent
    }
    // uploads new images if any
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileuri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileuri, {
          folder: "mern_products",
        });
        updatedImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    //update products
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.productImg = updatedImg;
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getSingleProduct = async(req, res)=>{
  try {
    const {productId} = req.params;
     const singleproduct = await ProductModel.findById(productId);
     if(!singleproduct){
      return res.status(404).json({
        success:false,
        message:"Product not found",
        products:[]
      })
     }
     res.status(200).json({
      success:true,
      product:singleproduct
     })
  } catch (error) {
     return res.status(500).json({
      success:false,
      message:error.message
     })
  }

}