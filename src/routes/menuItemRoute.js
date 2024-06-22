const express = require('express');
const {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem
} = require('../controller/menuItemController');
const validateMenuItem = require('../middleware/validateMenuItem');

const router = express.Router();

router.post('/menuItem', validateMenuItem, createMenuItem);
router.get('/menuItem', getAllMenuItems);
router.get('/menuItem/:id', getMenuItemById);
router.put('/menuItem/:id', validateMenuItem ,updateMenuItem);
router.delete('/menuItem/:id', deleteMenuItem);

module.exports = router;
