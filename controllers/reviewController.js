const Review = require('../models/Review');

// 1. Fetch all approved reviews
const getApprovedReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'approved' }).sort({ dateAdded: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};

// 2. Fetch all pending reviews
const getPendingReviews = async (req, res) => {
    try {
        const pendingReviews = await Review.find({ status: 'pending' }).sort({ dateAdded: 1 });
        res.json(pendingReviews);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch pending reviews" });
    }
};

// 3. Submit a customer review (pending default)
const submitCustomerReview = async (req, res) => {
    try {
        const { customerName, category, rating, reviewText } = req.body;
        
        let reviewData = {
            type: 'text',
            customerName,
            category,
            rating: parseInt(rating),
            text: reviewText,
            status: 'pending'
        };

        if (req.file) {
            reviewData.type = 'image';
            reviewData.url = req.file.path; // Cloudinary secure URL
        }

        const newReview = new Review(reviewData);
        await newReview.save();
        
        res.status(201).json({ message: "Review submitted successfully and is pending approval." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit review." });
    }
};

// 4. Admin direct upload
const adminUploadMedia = async (req, res) => {
    try {
        const { type, customerName, category, rating, youtubeUrl } = req.body;
        
        let reviewData = {
            type,
            customerName,
            category,
            rating: parseInt(rating) || 5,
            text: req.body.text || "", 
            status: 'approved'
        };

        if (type === 'image') {
            if (!req.file) return res.status(400).json({ error: "Image file is required for type 'image'." });
            reviewData.url = req.file.path;
        } else if (type === 'youtube') {
            if (!youtubeUrl) return res.status(400).json({ error: "YouTube URL is required for type 'youtube'." });
            const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
            if (!match || !match[1]) return res.status(400).json({ error: "Invalid YouTube URL format." });
            reviewData.videoId = match[1];
        }

        const newReview = new Review(reviewData);
        await newReview.save();
        
        res.status(201).json({ message: "Admin media uploaded and published successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to upload admin media." });
    }
};

// 5. Approve a review
const approveReview = async (req, res) => {
    try {
        await Review.findByIdAndUpdate(req.params.id, { status: 'approved' });
        res.json({ message: "Review approved!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to approve review." });
    }
};

// 6. Delete a review
const deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Review deleted." });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete review." });
    }
};

// 7. GET: Admin dashboard statistics
const getAdminStats = async (req, res) => {
    try {
        const totalReviews = await Review.countDocuments({ status: 'approved' });
        const pendingReviews = await Review.countDocuments({ status: 'pending' });
        const uniqueCustomers = await Review.distinct('customerName');
        
        // Fetch total quotes from Quote model (imported above)
        const Quote = require('../models/Quote');
        const totalQuotes = await Quote.countDocuments();

        res.json({
            totalReviews,
            pendingReviews,
            totalQuotes,
            totalCustomers: uniqueCustomers.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch admin stats." });
    }
};

// 8. PUT: Update a specific review
const updateReview = async (req, res) => {
    try {
        const { customerName, category, rating, text } = req.body;
        const updated = await Review.findByIdAndUpdate(req.params.id, {
            customerName,
            category,
            rating: parseInt(rating),
            text
        }, { new: true });
        
        if (!updated) return res.status(404).json({ error: "Review not found" });
        res.json({ message: "Review updated successfully!", review: updated });
    } catch (err) {
        res.status(500).json({ error: "Failed to update review." });
    }
};

module.exports = {
    getApprovedReviews,
    getPendingReviews,
    submitCustomerReview,
    adminUploadMedia,
    approveReview,
    deleteReview,
    getAdminStats,
    updateReview
};
