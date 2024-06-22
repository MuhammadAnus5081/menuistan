const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; 

const Menu = mongoose.models.Menu || require('../models/menuItemModel');
//const User = mongoose.models.User || require('../models/userModel');

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
  limits: { fileSize: 10 * 1024 * 1024 }
}).single('imageFile');

const validateRestaurant = async (req, res, next) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ status: false, message: 'Multer error', error: err.message });
    } else if (err) {
      return res.status(500).json({ status: false, message: 'Unknown error', error: err.message });
    }

    const { name, location, menuId, userId } = req.body;


    try {

      const menuExists = await Menu.findById(menuId);
      if (!menuExists) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ status: false, message: 'Menu not found' });
      }


    } catch (error) {
      console.error('Error validating restaurant data:', error);
      return res.status(500).json({ status: false, message: 'Error validating restaurant data' });
    }

    next();
  });
};

module.exports = validateRestaurant;
