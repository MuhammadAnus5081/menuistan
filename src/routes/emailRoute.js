const express = require("express");
const router = express.Router();
const emailController = require("../controller/emailController");

// Route for sending email with attachment
router.post("/sendemail", emailController.sendEmailWithAttachment);

module.exports = router;
