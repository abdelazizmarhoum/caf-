const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: [
            'salades',
            'pates',
            'pizza',
            'sandwichs',
            'paninis',
            'burgers',
            'brochettes',
            'marocains',
            'supplements',
            'boissons'
        ],
        required: true
    },
    // Customization Options (e.g. Sugar, Cup Type)
    options: [{
        name: String, // e.g. "Sucre"
        type: { type: String, default: 'select' }, // 'select', 'checkbox'
        choices: [String], // ["Sans", "Un peu", "Normal"]
        required: { type: Boolean, default: true }
    }],
    // New: Weekly availability (0=Sunday, 1=Monday, ... 5=Friday, 6=Saturday)
    availableDays: {
        type: [Number],
        default: undefined // If undefined, available every day
    },
    imageUrl: {
        type: String
    },
    // Kitchen toggle (Short term: "Sold Out")
    isAvailable: {
        type: Boolean,
        default: true
    },
    // Manager toggle (Long term: "Removed from menu")
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date
    }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
