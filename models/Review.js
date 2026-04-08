const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['text', 'image', 'youtube'], 
        required: true 
    },
    customerName: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    text: { 
        type: String 
    }, // Used if text review
    url: { 
        type: String 
    }, // Used if image review (Cloudinary URL)
    videoId: { 
        type: String 
    }, // Used if youtube review
    status: { 
        type: String, 
        enum: ['pending', 'approved'], 
        default: 'pending',
        index: true
    },
    dateAdded: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Review', reviewSchema);
