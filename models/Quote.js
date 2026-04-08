const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    service: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    date: {
        type: String // We can store this as string or Date depending on HTML input
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quote', quoteSchema);
