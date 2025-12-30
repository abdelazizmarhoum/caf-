const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    tableNumber: {
        type: Number,
        required: true
    },
    items: [{
        menuItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem'
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        selectedOptions: [{
            name: String,
            value: String
        }],
        specialInstructions: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'cancelled'],
        default: 'pending'
    },
    customerNotes: String,
    kitchenStaffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    startedAt: Date,
    readyAt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    deletedAt: Date
});

module.exports = mongoose.model('Order', orderSchema);
