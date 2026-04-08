const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/authMiddleware');
const { formSubmitLimiter } = require('../middleware/rateLimiter');
const { submitQuoteRequest, getAllQuotes, deleteQuote } = require('../controllers/quoteController');

// 1. PUBLIC: Submit a quote request
router.post('/', formSubmitLimiter, submitQuoteRequest);

// 2. ADMIN: Fetch all quote requests
router.get('/', verifyAdmin, getAllQuotes);

// 3. ADMIN: Delete a quote request
router.delete('/:id', verifyAdmin, deleteQuote);

module.exports = router;
