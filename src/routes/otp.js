const express = require('express');
const router = express.Router();
const otpController = require('../controller/otp');

//send OTP
router.post('/send', otpController.sendOTP);

//verify OTP
router.post('/verify', otpController.verifyOTP);

module.exports = router;
