const rateLimit = require('express-rate-limit');

// Rate limiter for form submissions (Reviews and Quotes)
const formSubmitLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 submissions per windowMs
    message: {
        error: "Too many submissions from this IP. Please try again after 15 minutes."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
    formSubmitLimiter
};
