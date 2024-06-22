const path = require('path');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs').promises;
const UserModel = require('../models/UserModel');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../resources/static/assets/uploads');
    fs.mkdir(uploadPath, { recursive: true })
      .then(() => cb(null, uploadPath))
      .catch(err => cb(err, uploadPath));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  },
}).single('image'); // 'image' should match the name attribute in your form

const validateUser = async (req, res, next) => {
  try {
    // Handle file upload (form-data)
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ status: false, message: 'Multer error', error: err.message });
      } else if (err) {
        return res.status(500).json({ status: false, message: 'Unknown error', error: err.message });
      }

      // Validate JSON fields
      const { name, email, password, passwordConf, role } = req.body;

      // Check if email is already registered
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        // If user already exists, respond with an error (do not delete the uploaded image)
        return res.status(400).json({ status: false, message: 'Email is already registered' });
      }

      // Validate fields
      if (!name || !email || !password || !passwordConf || !role) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ status: false, message: 'All fields are required' });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ status: false, message: 'Invalid email format' });
      }

      // Password validation
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
      if (!passwordRegex.test(password)) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({
          status: false,
          message: 'Password must be at least 8 characters and contain 1 uppercase letter, 1 lowercase letter, 1 symbol, and 1 number'
        });
      }

      // Proceed with password hashing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Prepare validated user data
      const userData = {
        name,
        email,
        password: hashedPassword,
        passwordConf: hashedPassword, // Ensure this matches the password hashing
        role,
        image: req.file ? `/resources/static/assets/uploads/${req.file.filename}` : null
      };

      req.validatedUser = userData;
      next();
    });
  } catch (error) {
    console.error('Error validating user:', error);
    return res.status(500).json({ status: false, message: 'Error validating user' });
  }
};

module.exports = validateUser;
