const express = require('express');
const { addReview, getTargetReviews, getAllReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, addReview)
  .get(protect, authorize('admin'), getAllReviews); // Admin gets all reviews

router.route('/:targetType/:targetId')
  .get(getTargetReviews);

module.exports = router;
