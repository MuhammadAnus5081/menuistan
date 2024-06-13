const path = require('path');
const MenuItem = require('../models/menuItemModel');

const createMenuItem = async (req, res) => {
  try {
    const { restaurantId, name, price } = req.body;
    const imageFile = req.file ? req.file.filename : null;

    let imagePath = null;
    if (imageFile) {
      const ext = path.extname(req.file.originalname);
      const filename = path.basename(req.file.filename, ext);
      imagePath = path.join('resources', 'static', 'assets', 'uploads', `${filename}${ext}`);
      imagePath = imagePath.replace(/\\/g, '/');
    }

    const newMenuItem = new MenuItem({
      restaurantId,
      name,
      price,
      imageFile: imagePath
    });

    await newMenuItem.save();
    res.status(201).json({ status: true, message: 'MenuItem created successfully', data: newMenuItem });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error creating MenuItem', error: error.message });
  }
};

const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json({ status: true, message: 'MenuItems fetched successfully', data: menuItems });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching MenuItems', error: error.message });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ status: false, message: 'MenuItem not found' });
    }
    res.status(200).json({ status: true, message: 'MenuItem fetched successfully', data: menuItem });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching MenuItem', error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { restaurantId, name, price } = req.body;
    const imageFile = req.file ? req.file.filename : null;

    let imagePath = null;
    if (imageFile) {
      const ext = path.extname(req.file.originalname);
      const filename = path.basename(req.file.filename, ext);
      imagePath = path.join('resources', 'static', 'assets', 'uploads', `${filename}${ext}`);
      imagePath = imagePath.replace(/\\/g, '/');
    }

    const updatedData = {
      restaurantId,
      name,
      price,
      imageFile: imagePath
    };

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedMenuItem) {
      return res.status(404).json({ status: false, message: 'MenuItem not found' });
    }

    res.status(200).json({ status: true, message: 'MenuItem updated successfully', data: updatedMenuItem });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error updating MenuItem', error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deletedMenuItem) {
      return res.status(404).json({ status: false, message: 'MenuItem not found' });
    }

    res.status(200).json({ status: true, message: 'MenuItem deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error deleting MenuItem', error: error.message });
  }
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem
};
