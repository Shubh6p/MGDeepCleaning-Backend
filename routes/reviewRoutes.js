const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { verifyAdmin } = require('../middleware/authMiddleware');
const { formSubmitLimiter } = require('../middleware/rateLimiter');
const {
    getApprovedReviews,
    getPendingReviews,
    submitCustomerReview,
    adminUploadMedia,
    approveReview,
    deleteReview,
    getAdminStats,
    updateReview
} = require('../controllers/reviewController');

// 1. PUBLIC: Fetch all approved reviews
router.get('/', getApprovedReviews);

// Dashboard Statistics (Admin)
router.get('/stats', verifyAdmin, getAdminStats);

// 2. ADMIN: Fetch all pending reviews
router.get('/pending', verifyAdmin, getPendingReviews);

// 3. CUSTOMER: Submit a review
router.post('/submit', formSubmitLimiter, upload.single('image'), submitCustomerReview);

// 4. ADMIN: Directly upload media (Image, Youtube, Text)
router.post('/', verifyAdmin, upload.single('image'), adminUploadMedia);

// 5. ADMIN: Approve a pending review
router.put('/:id/approve', verifyAdmin, approveReview);

// 6. ADMIN: Update a review
router.put('/:id', verifyAdmin, updateReview);

// 7. ADMIN: Delete/Decline a review
router.delete('/:id', verifyAdmin, deleteReview);

module.exports = router;
