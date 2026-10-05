const express = require('express');
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getTodayOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public/Customer routes (but require login)
router.route('/').post(protect, createOrder);
router.route('/myorders').get(protect, getMyOrders);

// Admin only routes
router.route('/').get(protect, authorize('admin'), getOrders);
router.route('/stats/today').get(protect, authorize('admin'), getTodayOrders);
router.route('/:id').get(protect, getOrderById); // Both can access, controller handles auth
router.route('/:id/status').put(protect, authorize('admin'), updateOrderStatus);

module.exports = router;
