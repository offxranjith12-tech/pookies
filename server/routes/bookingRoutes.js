const express = require('express');
const {
  createBooking,
  getBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  getArtistBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public/Customer routes (require login)
router.route('/').post(protect, createBooking);
router.route('/mybookings').get(protect, getMyBookings);

// Artist only routes
router.route('/artist').get(protect, authorize('artist'), getArtistBookings);

// Admin only routes
router.route('/').get(protect, authorize('admin'), getBookings);
router.route('/:id').get(protect, getBookingById);
router.route('/:id/status').put(protect, authorize('admin', 'artist'), updateBookingStatus);

module.exports = router;
