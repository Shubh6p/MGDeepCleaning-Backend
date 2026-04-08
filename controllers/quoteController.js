const Quote = require('../models/Quote');
const nodemailer = require('nodemailer');

const submitQuoteRequest = async (req, res) => {
    try {
        const { name, phone, service, address, date, message } = req.body;

        // 1. Save to MongoDB
        const newQuote = new Quote({ name, phone, service, address, date, message });
        await newQuote.save();

        // 2. Send Email
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.OWNER_EMAIL,
            subject: `New Deep Clean Quote Request from ${name}`,
            text: `
You have a new quote request from your website!

Customer Details:
-----------------
Name: ${name}
Phone: ${phone}
Service Requested: ${service || 'Not specified'}
Address: ${address || 'Not specified'}
Preferred Date: ${date || 'Not specified'}

Additional Message:
${message || 'None'}
            `
        };

        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ message: "Quote request saved and email sent successfully!" });

    } catch (error) {
        console.error("Quote Submission Error:", error);
        res.status(500).json({ error: "Failed to process quote request." });
    }
};

const getAllQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find().sort({ date: -1 });
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch quotes." });
    }
};

const deleteQuote = async (req, res) => {
    try {
        await Quote.findByIdAndDelete(req.params.id);
        res.json({ message: "Quote request deleted." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete quote." });
    }
};

module.exports = {
    submitQuoteRequest,
    getAllQuotes,
    deleteQuote
};
