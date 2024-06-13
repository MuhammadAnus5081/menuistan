const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Restaurant'
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageFile: {
    type: String,
    required: false
  }
});

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

module.exports = MenuItem;
