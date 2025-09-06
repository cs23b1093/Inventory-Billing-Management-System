import mongoose from "mongoose";

const transitionSchema = new mongoose.Schema({
    totalAmount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['sale', 'purchase'],
        default: 'sale'
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }], 
    date: {
        type: Date,
        default: Date.now
    },
    businessId: {
        type: String,
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StakeHolder',
        required: true
    },
    vendorId: {
        type: String,
        required: true
    }
})

export const Transition = mongoose.model('Transition', transitionSchema);