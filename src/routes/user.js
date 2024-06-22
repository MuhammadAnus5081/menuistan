const express = require('express');
const {
    registerUser,
    loginUser,
    forgotPassword,
} = require('../controller/userController');
const validateUser = require('../middleware/validateUser');

const router = express.Router();

router.post('/signup', validateUser, registerUser);
router.post('/login', loginUser);
router.put('/forgetpassword', forgotPassword);

module.exports = router;
