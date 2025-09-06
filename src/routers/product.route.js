import express from "express";
import { createProduct, getAllProducts, getProduct, editProduct, deleteProduct } from '../controllers/product.controller.js'
import getUserByCookies from "../middleware/getUser.js";

const productRouter = express.Router();

productRouter.route('/create').post(getUserByCookies, createProduct);
productRouter.route('/all').get(getAllProducts);
productRouter.route('/get/:productId').get(getProduct)
productRouter.route('/update/:productId').put(getUserByCookies, editProduct);
productRouter.route('/delete/:productId').delete(getUserByCookies, deleteProduct);

export default productRouter;