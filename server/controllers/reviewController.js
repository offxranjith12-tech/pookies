const { Review, User, Product, Artist } = require('../models');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { targetType, targetId, rating, comment } = req.body;

    // Optional validation to ensure the customer has actually purchased/booked
    // Can be added later. For now, any logged-in user can review.

    const review = await Review.create({
      customerId: req.user.id,
      targetType,
      targetId,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a target (Product or Artist)
// @route   GET /api/reviews/:targetType/:targetId
// @access  Public
exports.getTargetReviews = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    
    const reviews = await Review.findAll({
      where: { targetType, targetId },
      include: [
        { model: User, as: 'Customer', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, as: 'Customer', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
