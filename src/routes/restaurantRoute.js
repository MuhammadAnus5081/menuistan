const express = require('express');
const multer = require('multer');
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} = require('../controller/restaurantController');

const router = express.Router();
const upload = multer({
  dest: 'resources/static/assets/uploads', // Set destination for file uploads
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB file size limit
});

router.post('/restaurant', upload.single('imageFile'), createRestaurant);
router.get('/restaurant', getAllRestaurants);
router.get('/restaurant/:id', getRestaurantById);
router.put('/restaurant/:id', upload.single('imageFile'), updateRestaurant);
router.delete('/restaurant/:id', deleteRestaurant);

module.exports = router;
