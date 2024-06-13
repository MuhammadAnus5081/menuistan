const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  menuId: {
    type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Menu' 
},
  userId: {
    type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' 
  },
  imageFile: {
    type: String,
    required: false
  }
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;
