const path = require('path');
const mongoose = require('mongoose');
const Restaurant = require('../models/restaurantModel');
const Menu = require('../models/menuItemModel');
//const User = require('../models/userModel');
const fs = require('fs').promises;

const createRestaurant = async (req, res) => {
  try {
    const { name, location, menuId, userId } = req.body;
    const imageFile = req.file ? req.file.filename : null;

    let imagePath = null;
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const filename = path.basename(req.file.filename, ext);
      imagePath = path.join('resources', 'static', 'assets', 'uploads', `${filename}${ext}`);
      imagePath = imagePath.replace(/\\/g, '/');
    }

    const newRestaurant = new Restaurant({
      name,
      location,
      menuId,
      userId,
      imageFile: imagePath
    });
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(menuId)) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ status: false, message: 'Invalid userId or menuId format' });
    }
    await newRestaurant.save();
    res.status(201).json({ status: true, message: 'Restaurant created successfully', data: newRestaurant });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path);
    res.status(500).json({ status: false, message: 'Error creating Restaurant', error: error.message });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ status: true, message: 'Restaurants fetched successfully', data: restaurants });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching Restaurants', error: error.message });
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
    res.status(500).json({ status: false, message: 'Error fetching Restaurant', error: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const { name, location, menuId, userId } = req.body;
    const imageFile = req.file ? req.file.filename : null;

    let imagePath = null;
    if (imageFile) {
      const ext = path.extname(req.file.originalname);
      const filename = path.basename(req.file.filename, ext);
      imagePath = path.join('resources', 'static', 'assets', 'uploads', `${filename}${ext}`);
      imagePath = imagePath.replace(/\\/g, '/');
    }

    const currentRestaurant = await Restaurant.findById(req.params.id);
    if (!currentRestaurant) {
      return res.status(404).json({ status: false, message: 'Restaurant not found' });
    }

    const updatedData = {
      name: name || currentRestaurant.name,
      location: location || currentRestaurant.location,
      menuId: menuId || currentRestaurant.menuId,
      userId: userId || currentRestaurant.userId,
      imageFile: imagePath || currentRestaurant.imageFile,
    };

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.status(200).json({ status: true, message: 'Restaurant updated successfully', data: updatedRestaurant });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error updating Restaurant', error: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!deletedRestaurant) {
      return res.status(404).json({ status: false, message: 'Restaurant not found' });
    }

    if (deletedRestaurant.imageFile) {
      const filePath = path.join('resources', 'static', 'assets', 'uploads', deletedRestaurant.imageFile);
      await fs.unlink(filePath);
    }

    res.status(200).json({ status: true, message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error deleting Restaurant', error: error.message });
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
};
