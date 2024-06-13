const express = require('express');
const multer = require('multer');
const {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem
} = require('../controller/menuItemController');

const router = express.Router();
const upload = multer({
  dest: 'resources/static/assets/uploads',
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/menuItem', upload.single('imageFile'), createMenuItem);
router.get('/menuItem', getAllMenuItems);
router.get('/menuItem/:id', getMenuItemById);
router.put('/menuItem/:id', upload.single('imageFile'), updateMenuItem);
router.delete('/menuItem/:id', deleteMenuItem);

module.exports = router;
