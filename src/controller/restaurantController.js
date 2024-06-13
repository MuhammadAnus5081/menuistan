const path = require('path');
const Restaurant = require('../models/restaurantModel');


const createRestaurant = async (req, res) => {
  try {
    const { name, location, menuId, userId } = req.body;
    const imageFile = req.file ? req.file.filename : null;

    let imagePath = null;
    if (imageFile) {
      const ext = path.extname(req.file.originalname); // Extract the file extension
      const filename = path.basename(req.file.filename, ext); // Get the filename without the extension
      imagePath = path.join('resources', 'static', 'assets', 'uploads', `${filename}${ext}`);
      imagePath = imagePath.replace(/\\/g, '/'); // Normalize the path to use forward slashes
    }

    const newRestaurant = new Restaurant({
      name,
      location,
      menuId,
      userId,
      imageFile: imagePath
    });

    await newRestaurant.save();
    res.status(201).json({ status: true, message: 'Restaurant created successfully', data: newRestaurant });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error creating restaurant', error: error.message });
  }
};
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ status: true, message: 'Restaurants fetched successfully', data: restaurants });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching restaurants', error: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ status: false, message: 'Restaurant not found' });
    }
    res.status(200).json({ status: true, message: 'Restaurant fetched successfully', data: restaurant });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching restaurant', error: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const { name, location, menuId, userId } = req.body;
    const imageFile = req.file ? req.file.filename : null;

    let imagePath = null;
    if (imageFile) {
      const ext = path.extname(req.file.originalname); // Extract the file extension
      const filename = path.basename(req.file.filename, ext); // Get the filename without the extension
      imagePath = path.join('resources', 'static', 'assets', 'uploads', `${filename}${ext}`);
      imagePath = imagePath.replace(/\\/g, '/'); // Normalize the path to use forward slashes
    }

    const updatedData = {
      name,
      location,
      menuId,
      userId,
      imageFile: imagePath
    };

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedRestaurant) {
      return res.status(404).json({ status: false, message: 'Restaurant not found' });
    }

    res.status(200).json({ status: true, message: 'Restaurant updated successfully', data: updatedRestaurant });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error updating restaurant', error: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!deletedRestaurant) {
      return res.status(404).json({ status: false, message: 'Restaurant not found' });
    }

    res.status(200).json({ status: true, message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error deleting restaurant', error: error.message });
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
};
