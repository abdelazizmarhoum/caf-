const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        unique: true,
        required: true
    },
    qrCodeUrl: {
        type: String,
        required: true
    },
    currentOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    sessionToken: {
        type: String,
        select: false // Hide by default, only explicit fetch
    },
    lastOrderCompletedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Table', tableSchema);
