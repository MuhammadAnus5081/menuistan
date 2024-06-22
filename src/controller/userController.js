const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const multer = require('multer');
const path = require('path');


const registerUser = async (req, res) => {
  try {
    const { name, email, password, passwordConf, role, image } = req.validatedUser;

    // Create a new user instance
    const newUser = new UserModel({
      name,
      email,
      password, // Already hashed in middleware
      passwordConf,
      role,
      image
    });

    // Save the user to the database
    await newUser.save();

    // Return success response
    res.status(200).json({ status: true, message: 'User registered successfully', newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};
// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await UserModel.findOne({ email }).exec();
    if (!existingUser) {
      return res.status(400).json({ status: false, message: 'User not found' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: false,
        message: 'Password must be at least 8 characters and contain 1 uppercase letter, 1 lowercase letter, 1 symbol, and 1 number'
      });
    }

    if (existingUser.status === 'Disable') {
      return res.status(400).json({ status: false, message: 'Account is disabled' });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(400).json({ status: false, message: 'Invalid credentials' });
    }

    const userObject = { userId: existingUser._id, name: existingUser.name, email: existingUser.email, role: existingUser.role };
    return res.status(200).json({ status: true, message: 'Login successfully', userObject });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email, password, passwordConf } = req.body;

    if (!email || !password || !passwordConf) {
      return res.status(400).json({ status: false, message: 'All fields are required' });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ status: false, message: 'Email is not registered' });
    }

    if (password !== passwordConf) {
      return res.status(400).json({ status: false, message: 'Passwords do not match' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: false,
        message: 'Password must be at least 8 characters and contain 1 uppercase letter, 1 lowercase letter, 1 symbol, and 1 number',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ status: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error initiating password recovery:', error);
    return res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  // Add other exports here...
};
