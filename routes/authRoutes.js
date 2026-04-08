const express = require('express');
const router = express.Router();
const { requestOTP, verifyOTP, logout, checkAuth } = require('../controllers/authController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);
router.post('/logout', logout);
router.get('/check-auth', verifyAdmin, checkAuth);

module.exports = router;
