const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    otp: String,
    createdAt: { type: Date, expires: '10m', default: Date.now } // Add this line
});

module.exports = mongoose.model('Otp', otpSchema);
