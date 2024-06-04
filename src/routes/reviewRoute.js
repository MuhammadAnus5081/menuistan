const express = require('express');
const { body, param } = require('express-validator');
const {
    createReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview
} = require('../controller/reviewController');

const router = express.Router();

router.post(
    '/createReview',
    [
        body('userId').isMongoId().withMessage('Invalid User ID'),
        body('restaurantId').isMongoId().withMessage('Invalid Restaurant ID'),
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('comment').notEmpty().withMessage('Comment is required')
    ],
    createReview
);

router.get('/getReview', getReviews);

router.get(
    '/getReview/:id',
    [param('id').isMongoId().withMessage('Invalid Review ID')],
    getReviewById
);

router.put(
    '/updateReview/:id',
    [
        param('id').isMongoId().withMessage('Invalid Review ID'),
        body('userId').optional().isMongoId().withMessage('Invalid User ID'),
        body('restaurantId').optional().isMongoId().withMessage('Invalid Restaurant ID'),
        body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('comment').optional().notEmpty().withMessage('Comment is required')
    ],
    updateReview
);

router.delete(
    '/deleteReview/:id',
    [param('id').isMongoId().withMessage('Invalid Review ID')],
    deleteReview
);

module.exports = router;
