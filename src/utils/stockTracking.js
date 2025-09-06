import { Product } from "../models/product.model.js";
import logger from "./logger.js";
import { ApiError } from "./errorFormat.js";

const updateStockOnSale = async (products) => {
    try {
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                logger.error(`Product with id ${item._id} not found`);
                const apiError = new ApiError({ message: `Product with id ${item._id} not found`, status: 404 })
                throw apiError;
            }

            if (product.stock < item.quantity) {
                logger.error(`Insufficient stock for product with id ${item._id}`);
                const apiError = new ApiError({ message: `Insufficient stock for product with id ${item._id}`, status: 400 })
                throw apiError;
            }

            product.stock -= item.quantity;
            await product.save();
            return { message: "Stock updated successfully",
                product,
                statusCode: 200,
                success: true
            }
        }
    } catch (error) {
        logger.error(`Update stock on sale failed: ${error.message}`);
        return { message: "Internal Server Error",
            error: error.message,
            statusCode: 500,
            success: false
        }
    }
}

const updateStockOnPurchase = async (products) => {
    try {
        for (const item of products) {
            const product = await Product.findById(item._id);
            if (!product) {
                logger.error(`Product with id ${item._id} not found`);
                const apiError = new ApiError({ message: `Product with id ${item._id} not found`, status: 404 })
                throw apiError;
            }

            product.stock += item.quantity;
            await product.save();
        }
    } catch (error) {
        logger.error(`Update stock on purchase failed: ${error.message}`);
        return { message: "Internal Server Error",
            error: error.message,
            statusCode: 500
        }
    }
}

export { updateStockOnSale, updateStockOnPurchase };