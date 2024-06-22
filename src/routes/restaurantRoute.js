const express = require('express');
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} = require('../controller/restaurantController');
const validateRestaurant = require('../middleware/validateRestaurant');

const router = express.Router();

router.post('/restaurant', validateRestaurant, createRestaurant);
router.get('/restaurant', getAllRestaurants);
router.get('/restaurant/:id', getRestaurantById);
router.put('/restaurant/:id', validateRestaurant, updateRestaurant);
router.delete('/restaurant/:id', deleteRestaurant);

module.exports = router;
