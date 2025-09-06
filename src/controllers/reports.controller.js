import { asyncHandler } from "../middleware/errorHandler.js";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/errorFormat.js";
import { Product } from "../models/product.model.js";
import { Transition } from "../models/transition.model.js";

const getInventoryReport = asyncHandler (async (req, res, next) => {
    try {
        logger.info('hit get inventory report...');

        const inventoryReport = await Product.find({}, 'name category stock price');
        if (!inventoryReport) {
            logger.error('inventory report not found');
            const apiError = new ApiError({ message: 'Inventory report not found', status: 404 })
            return res.status(404).json({
                ...apiError
            })
        }

        logger.info('inventory report found');
        res.status(200).json({
            message: 'Inventory report found successfully',
            inventoryReport
        })
    } catch (error) {
        logger.error(`Get inventory report failed: unexpected error: ${error.message}}`);
        res.status(500).json({
            message: `Internal server error while getting inventory report: ${error.message}}`,
            stack: error?.stack,
            statusCode: 500
        })
    }
})

const getTransactionReport = asyncHandler (async (req, res, next) => {
    try {
        logger.info('hit get transaction report...');

        const { type, startDate, endDate } = req.query;
        const query = {};

        if (type) {
            query.type = type;
        }

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }

        const transactionReport = await Transition.find(query)
                                                    .populate("products.productId", "name price")
                                                    .populate("customerId", "name email")
                                                    .populate("vendorId", "name email")
                                                    .sort({ date: -1 });
  
        if (!transactionReport) {
            logger.error('transaction report not found');
            const apiError = new ApiError({ message: 'Transaction report not found', status: 404 })
            return res.status(404).json({
                ...apiError
            })
        }

        logger.info('transaction report found');
        res.status(200).json({
            message: 'Transaction report found successfully',
            transactionReport
        });
    } catch (error) {
        logger.error(`Get Transition History failed: unexpected error: ${error.message}}`);
        res.status(500).json({
            message: `Internal server error while getting inventory report: ${error.message}}`,
            stack: error?.stack,
            statusCode: 500
        })
    }
})

export {
    getInventoryReport,
    getTransactionReport
}