import logger from '../utils/logger.js';
import { ApiError } from '../utils/errorFormat.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Transition } from '../models/transition.model.js';
import { validateNewTransition } from '../utils/transition.validate.js';
import { updateStockOnPurchase, updateStockOnSale } from '../utils/stockTracking.js';

const createTransition = asyncHandler(async (req, res, next) => {
    try {
        const { error } = validateNewTransition(req.body);
        if (error) {
            logger.error(error.details.map(d => d.message).join(", "));
            const apiError = new ApiError({ 
                message: error.details[0].message, 
                status: 400, 
                error 
            })}

        const { type, products } = req.body;
        const totalAmount = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
        
        if (type === 'sale') {
            const result = await updateStockOnSale(req.body.products);
            if (!result.success) {
                logger.error('Could not able to update stock');
                const apiError = new ApiError({ 
                    message: 'Could not able to update stock', 
                    status: 400, 
                    error 
                })
                return res.status(400).json({
                    ...apiError
                })
            }
        }

        if (type === 'purchase') {
            const result = await updateStockOnPurchase(req.body.products);
            if (!result.success) {
                logger.error('Could not able to update stock');
                const apiError = new ApiError({ 
                    message: 'Could not able to update stock', 
                    status: 400, 
                    error 
                })
                return res.status(400).json({
                    ...apiError
                })
            }
        }

        const newTransition = new Transition({
            ...req.body,
            totalAmount: totalAmount
        });
            await newTransition.save();
            logger.info('transition created');
            res.status(201).json({
                message: 'Transition created successfully',
                transition: newTransition
            })
    } catch (error) {
        logger.error(`Create transition failed: unexpected error: ${error.message}}`);
        res.status(500).json({
            message: `Internal server error while creating transition: ${error.message}}`,
            stack: error?.stack,
            statusCode: 500,
            success: false
        })
    }
})

const getTransitions = asyncHandler(async (req, res, next) => {
    try {
        logger.info('hit get transitions...');

        const transitions = await Transition.find();
        if (!transitions) {
            logger.error('transitions not found');
            const apiError = new ApiError({ message: 'Transitions not found', status: 404 })
            return res.status(404).json({
                ...apiError
            })
        }

        logger.info('transitions found');
        res.status(200).json({
            message: 'Transitions found successfully',
            transitions
        })
    } catch (error) {
        logger.error(`Get transitions failed: unexpected error: ${error.message}}`);
        res.status(500).json({
            message: `Internal server error while getting transitions: ${error.message}}`,
            stack: error?.stack,
            statusCode: 500
        })
    }
})

export {
    createTransition,
    getTransitions
}