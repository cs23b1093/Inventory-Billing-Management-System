import logger from "../utils/logger.js";
import { ApiError } from "../utils/errorFormat.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { Product } from '../models/product.model.js';
import { validateNewProduct } from "../utils/product.validate.js";
// import redis from "../config/redisClient.js"; // Redis disabled for now

// Redis helper functions (commented for review purpose)
// // Build cache keys for product resources
// const keyGenerate = (prefix, operation) => {
//     return `${prefix}:${operation}`
// }

// // Delete keys in batches that match a pattern
// const deleteByPattern = async (pattern) => {
//     let cursor = '0'
//     do {
//         const scanResult = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100)
//         cursor = scanResult[0]
//         const keys = scanResult[1]
//         if (keys.length) {
//             await redis.del(...keys)
//         }
//     } while (cursor !== '0')
// }

// // Invalidate product caches after writes
// const deleteFromCache = async () => {
//     await deleteByPattern('products:*')
//     await deleteByPattern('product:*')
// }

const createProduct = asyncHandler(async (req, res, next) => {
    try {
        logger.info('hit create product...');

        const { error } = validateNewProduct(req.body);
        if (error) {
            logger.error(error.details.map(d => d.message).join(", "));
            const apiError = new ApiError({ 
                message: error.details[0].message, 
                status: 400, 
                error 
            });
            return res.status(400).json(apiError);
        }

        const newProduct = new Product(req.body);
        await newProduct.save();

        // await deleteFromCache(); // Redis cache invalidation disabled
        logger.info('product created');
        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        })
    } catch (error) {
        logger.error(`Create product failed: unexpected error: ${error.message}}`, {
            errorMessage: error?.message,
            stack: error?.stack,
            path: req.originalUrl,
            method: req.method,
            bodyKeys: Object.keys(req.body || {})
        })
        res.status(500).json({
            message: `Internal server error while creating product: ${error.message}}`
        })
    }
})

const editProduct = asyncHandler(async (req, res, next) => {
    try {
        logger.info('hit edit product...');

        const productId = req.params.productId;
        if (!productId) {
            logger.error('id not provided');
            return res.status(404).json({
                message: 'id not provided'
            })
        }

        const product = await Product.findById(productId);
        if (!product) {
            logger.error('product not found');
            return res.status(404).json({
                message: 'Product not found'
            })
        }

        const { error } = validateNewProduct(req.body);
        if (error) {
            logger.error(error.details.map(d => d.message).join(", "));
            const apiError = new ApiError({ 
                message: error.details[0].message, 
                status: 400, 
                error 
            });
            return res.status(400).json(apiError);
        }

        Object.assign(product, req.body);
        await product.save();

        // await deleteFromCache(); // Redis cache invalidation disabled
        logger.info('product updated');
        res.status(200).json({
            message: 'Product updated successfully',
            product
        })
    } catch (error) {
        logger.error(`Edit product failed: unexpected error: ${error.message}}`, {
            errorMessage: error?.message,
            stack: error?.stack,
            path: req.originalUrl,
            method: req.method,
            bodyKeys: Object.keys(req.body || {})
        })
        res.status(500).json({
            message: `Internal server error while editing product: ${error.message}}`
        })
    }
})

const deleteProduct = asyncHandler(async (req, res, next) => {
    try {
        logger.info('hit delete product...');

        const productId = req.params.productId;
        if (!productId) {
            logger.error('id not provided');
            return res.status(404).json({
                message: 'id not provided'
            })
        }

        const product = await Product.findById(productId);
        if (!product) {
            logger.error('product not found');
            return res.status(404).json({
                message: 'Product not found'
            })
        }

        await product.deleteOne();
        // await deleteFromCache(); // Redis cache invalidation disabled
        logger.info('product deleted');
        res.status(200).json({
            message: 'Product deleted successfully'
        })
    } catch (error) {
        logger.error(`Delete product failed: unexpected error: ${error.message}}`, {
            errorMessage: error?.message,
            stack: error?.stack,
        })
        res.status(500).json({
            message: `Internal server error while deleting product: ${error.message}}`
        })
    }
})

const getProduct = asyncHandler(async (req, res, next) => {
    try {
        logger.info('hit get product...');

        const productId = req.params.productId;
        if (!productId) {
            logger.error('id not provided');
            return res.status(404).json({
                message: 'id not provided'
            })
        }

        // Redis cache lookup disabled
        // const cacheKey = keyGenerate('product', productId);
        // const cached = await redis.get(cacheKey);
        // if (cached) {
        //     const product = JSON.parse(cached)
        //     logger.info('product found (from cache)');
        //     return res.status(200).json({
        //         message: 'Product found successfully',
        //         product
        //     })
        // }

        const product = await Product.findById(productId);
        if (!product) {
            logger.error('product not found');
            return res.status(404).json({
                message: 'Product not found'
            })
        }

        //  await redis.set(cacheKey, JSON.stringify(product), 'EX', 300)
        res.status(200).json({
            message: 'Product found successfully',
            product
        })
    } catch (error) {
        logger.error(`geting product failed: unexpected error: ${error.message}`, {
            errorMessage: error?.message,
            stack: error?.stack,
        }),
        res.status(500).json({
            message: `Internal server error while getting product: ${error.message}}`
        })
    }
})

const getAllProducts = asyncHandler(async (_, res, next) => {
    try {
        logger.info('hit get all products...');

        // Redis cache lookup disabled
        // const key = keyGenerate('products', 'all');
        // const cacheProd = await redis.get(key);
        // if (cacheProd) {
        //     logger.info('products found in cache');
        //     const products = JSON.parse(cacheProd);
        //     return res.status(200).json({
        //         message: 'Products found successfully',
        //         products
        //     })
        // }

        const products = await Product.find();
        if (!products) {
            logger.error('products not found');
            return res.status(404).json({
                message: 'Products not found'
            })
        }

        // 🔒 await redis.set(key, JSON.stringify(products), 'EX', 300);
        res.status(200).json({
            message: 'Products found successfully',
            products
        })
    } catch (error) {
        logger.error(`geting all products failed: unexpected error: ${error.message}`);
        res.status(500).json({
            message: `Internal server error while getting all products: ${error.message}}`
        })
    }
})

const searchProducts = asyncHandler(async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({
                message: 'Query not provided'
            })
        }

        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { price: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { stock: { $regex: query, $options: 'i' } },
                { businessId: { $regex: query, $options: 'i' } }
            ]
        })
        if (!products) {
            logger.error('products not found');
            const apiError = new ApiError({ message: 'Products not found', status: 404 })
            return res.status(404).json({
                ...apiError,
                message: 'Products not found'
            })
        }
        
        logger.info('products found');
        res.status(200).json({
            message: 'Products found successfully',
            products
        })
    } catch (error) {
        logger.error(`Search products failed: unexpected error: ${error.message}}`, {
            errorMessage: error?.message,
            stack: error?.stack,
        }) 
        res.status(500).json({
            message: `Internal server error while searching products: ${error.message}}`
        })
    }
})

export {
    createProduct,
    editProduct,
    deleteProduct,
    getProduct,
    getAllProducts,
    searchProducts
}
