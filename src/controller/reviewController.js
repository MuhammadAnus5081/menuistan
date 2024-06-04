const Review = require('../models/reviewModel');
const { validationResult } = require('express-validator');

const createReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { userId, restaurantId, rating, comment } = req.body;

    try {
        const newReview = new Review({ userID: userId, restaurantID: restaurantId, rating, comment });
        await newReview.save();
        res.status(201).json({ status: true, data: newReview });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({ status: true, data: reviews });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ status: false, message: 'Review not found' });
        }
        res.status(200).json({ status: true, data: review });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const updateReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { userId, restaurantId, rating, comment } = req.body;

    try {
        const updateData = {};
        if (userId) updateData.userID = userId;
        if (restaurantId) updateData.restaurantID = restaurantId;
        if (rating !== undefined) updateData.rating = rating; // explicitly check for undefined to allow 0 as a valid value
        if (comment) updateData.comment = comment;

        const review = await Review.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!review) {
            return res.status(404).json({ status: false, message: 'Review not found' });
        }
        res.status(200).json({ status: true, data: review });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ status: false, message: 'Review not found' });
        }
        res.status(200).json({ status: true, message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

module.exports = {
    createReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview
};
