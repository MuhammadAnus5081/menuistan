// routes.js

const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');


// Register a new user
router.post('/signup', userController.registerUser);

// Login
router.post('/login', userController.loginUser);

// Forgot Password
router.put('/forgetpassword', userController.forgotPassword);
//update
//router.put('/updateuser/:id', userController.updateUser);
// Logout
//router.get('/logout', userController.logoutUser);

// Get all users
//router.get('/webusers', userController.getAllUsers);

//router.delete('/webdelete/:id', userController.deleteUser)

module.exports = router;
