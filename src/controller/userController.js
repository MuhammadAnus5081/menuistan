const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const multer = require('multer');
const path = require('path');


// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'resources/static/assets/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.originalname}`;
    req.filename = filename; // Save the filename in the request object
    cb(null, filename);
  },
});

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  },
}).single('image'); // Use single instead of array for a single file upload

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, passwordConf, role } = req.body;

    // Log request body for debugging
    console.log('Request Body:', req.body);

    // Validate fields
    const validFields = ['name', 'email', 'password', 'passwordConf', 'role'];
    const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));
    if (invalidFields.length > 0) {
      return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
    }

    if (!name || !email || !password || !passwordConf || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password !== passwordConf) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: false,
        message: 'Password must be at least 8 characters and contain 1 uppercase letter, 1 lowercase letter, 1 symbol, and 1 number'
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: false, message: 'Email is already registered' });
    }

    // Proceed with file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Check if the file is available
      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Construct image URL
      const imageUrl = `/resources/static/assets/uploads/${req.filename}`;

      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        passwordConf: hashedPassword,
        role,
        image: imageUrl // Save the URL of the uploaded image
      });

      await newUser.save();

      res.status(200).json({ status: true, message: 'User registered successfully', newUser });
    });
  } catch (error) {
    console.error(error);
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
