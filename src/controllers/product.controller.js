import logger from "../utils/logger.js";
import { ApiError } from "../utils/errorFormat.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { Product } from '../models/product.model.js';
import { validateNewProduct } from "../utils/product.validate.js";

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

        const product = await Product.findById(productId);
        if (!product) {
            logger.error('product not found');
            return res.status(404).json({
                message: 'Product not found'
            })
        }

        logger.info('product found');
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

        const products = await Product.find();
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

export {
    createProduct,
    editProduct,
    deleteProduct,
    getProduct,
    getAllProducts
}