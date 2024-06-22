const mongoose = require('mongoose');
const Restaurant = require('../models/restaurantModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../resources/static/assets/uploads'); // Adjust path
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure the directory exists
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB file size limit
}).single('imageFile');

const validateMenuItem = async (req, res, next) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ status: false, message: 'Multer error', error: err.message });
    } else if (err) {
      return res.status(500).json({ status: false, message: 'Unknown error', error: err.message });
    }

    const { restaurantId, name, price } = req.body;


    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      if (req.file) await fs.promises.unlink(req.file.path);
      return res.status(400).json({ status: false, message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      if (req.file) await fs.promises.unlink(req.file.path);
      return res.status(400).json({ status: false, message: 'Restaurant not found' });
    }

    next();
  });
};

module.exports = validateMenuItem;
