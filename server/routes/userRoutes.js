const express = require('express');
const {
  getUsers,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getUsers);
router.route('/:id').delete(deleteUser);

module.exports = router;
