import { StakeHolder } from "../models/stakeHolder.model.js";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/errorFormat.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { validateNewStakeHolder, validateUpdateStakeHolder } from "../utils/stackHolder.validate.js";

const createNewStackHolder = asyncHandler(async (req, res, next) => {
    try {
        logger.info('hit create stack holder...');

        const { error } = validateNewStakeHolder(req.body);
        if (error) {
            logger.error(error.details.map(d => d.message).join(", "));
            const apiError = new ApiError({ 
                message: error.details[0].message, 
                status: 400, 
                error 
            });
            return res.status(400).json(apiError);
        }

        const stackHolderExists = await StakeHolder.findOne({ email: req.body.email });
        if (stackHolderExists) {
            logger.error('stack holder already exists');
            const apiError = new ApiError({ message: 'Stack holder already exists', status: 400 })
            return res.status(400).json({
                ...apiError,
                message: 'Stack holder already exists',
                stackHolderExists
            })
        }

        const newStackHolder = new StakeHolder({
            ...req.body
        });
        await newStackHolder.save();
        logger.info('stack holder created');
        res.status(201).json({
            message: 'Stack holder created successfully',
            newStackHolder
        })
    } catch (error) {
        logger.error(`Create stack holder failed: unexpected error: ${error.message}`);
        res.status(500).json({
            message: `Internal server error while getting stack holders: ${error.message}}`,
            stack: error?.stack,
            statusCode: 500
        })
    }
})

const updateStackHolder = asyncHandler(async (req, res, next) => {
    try {
        logger.info('hit update stack holder...');

        const stackHolderId = req.params.stackHolderId;
        if (!stackHolderId) {
            logger.error('id not provided');
            return res.status(404).json({
                message: 'id not provided'
            })
        }

        const { error } = validateUpdateStakeHolder(req.body);
        if (error) {
            logger.error(error.details.map(d => d.message).join(", "));
            const apiError = new ApiError({ 
                message: error.details[0].message, 
                status: 400, 
                error 
            });
            return res.status(400).json(apiError);
        }

        const stackHolder = await StakeHolder.findById(stackHolderId);
        Object.assign(stackHolder, req.body);
        await stackHolder.save();
        logger.info('stack holder updated');
        res.status(200).json({
            message: 'Stack holder updated successfully',
            stackHolder
        })
    } catch (error) {
        logger.errorr(`Update stack holder failed: unexpected error: ${error?.message}}`);
        res.status(500).json({
            message: `Internal server error while updating stack holder: ${error?.message}}`,
            statusCode: 500,
            stack: error?.stack
        })
    }
})

const deleteStackHolder = asyncHandler(async (req, res, next) => {
    try {
        logger.info('hit delete stack holder...');

        const stackHolderId = req.params.stackHolderId;
        if (!stackHolderId) {
            logger.error('id not provided');
            return res.status(404).json({
                message: 'id not provided'
            })
        }

        const response = await StakeHolder.findByIdAndDelete(stackHolderId);
        if (!response) {
            logger.error('stack holder not found');
            const apiError = new ApiError({ message: 'Stack holder not found', status: 404 })
            return res.status(404).json({
                ...apiError
            })
        }

        logger.info('stack holder deleted');
        res.status(200).json('Stack holder deleted successfully', response?._id);
    } catch (error) {
        logger.error(`Delete stack holder failed: unexpected error: ${error.message}}`);
        res.status(500).json({
            message: `Internal server error while getting stack holders: ${error.message}}`,
            stack: error?.stack,
            statusCode: 500
        })
    }
})

const getStackHolder = asyncHandler(async (req, res, next) => {
    try {
        logger.info('hit get stack holder...');

        const stackHolderId = req.params.stackHolderId;
        if (!stackHolderId) {
            logger.error('id not provided');
            return res.status(404).json({
                message: 'id not provided'
            })
        }

        const stackHolder = await StakeHolder.findById(stackHolderId);
        if (!stackHolder) {
            logger.error('stack holder not found');
            return res.status(404).json({
                message: 'Stack holder not found'
            })
        }

        logger.info('stack holder found');
        res.status(200).json({
            message: 'Stack holder found successfully',
            stackHolder
        })
    } catch (error) {
        logger.error(`Get stack holder failed: unexpected error: ${error.message}}`);
        res.status(500).json({
            message: `Internal server error while getting stack holders: ${error.message}}`,
            stack: error?.stack,
            statusCode: 500
        })
    }
})

const getAllStackHolders = asyncHandler(async (req, res, next) => {
    try {
        logger.info('hit get all stack holders...');

        const stackHolders = await StakeHolder.find();
        if (!stackHolders) {
            logger.error('stack holders not found');
            return res.status(404).json({
                message: 'Stack holders not found'
            })
        }

        logger.info('stack holders found');
        res.status(200).json({
            message: 'Stack holders found successfully',
            stackHolders
        })
    } catch (error) {
        logger.error(`Get Stack holders Failed: unexpected error: ${error.message}}`);
        res.status(500).json({
            message: `Internal server error while getting stack holders: ${error.message}}`,
            stack: error?.stack,
            statusCode: 500
        })
    }
})

const searchStackHolders = asyncHandler(async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query) {
            logger.error('query not provided');
            return res.status(400).json({
                message: 'Query not provided'
            })
        }

        const stackHolders = await StakeHolder.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } },
                { address: { $regex: query, $options: 'i' } },
            ]
        })
        if (!stackHolders) {
            logger.error('stack holders not found');
            const apiError = new ApiError({ message: 'Stack holders not found', status: 404 })
            return res.status(404).json({
                ...apiError,
                message: 'Stack holders not found'
            })
        }

        logger.info('stack holders found');
        res.status(201).json({
            message: 'Stack holders found successfully',
            stackHolders
        })
    } catch (error) {
        logger.error(`Get Stack holders Failed: unexpected error: ${error.message}}`);
        res.status(500).json({
            message: `Internal server error while getting stack holders: ${error.message}}`,
            stack: error?.stack,
            statusCode: 500
        })
    }
})

export {
    createNewStackHolder,
    updateStackHolder,
    deleteStackHolder,
    getStackHolder,
    getAllStackHolders,
    searchStackHolders
}