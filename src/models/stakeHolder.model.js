import mongoose from "mongoose";

const stakeHolderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bussinessId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['customer', 'vendor', 'both'],
        default: 'customer'
    },
})

export const StakeHolder = mongoose.model('StakeHolder', stakeHolderSchema);