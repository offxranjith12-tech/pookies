const { Order, Product } = require('../models');
const { Op } = require('sequelize');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      address,
      paymentMethod,
      products // Array of { productId, quantity }
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: 'No products in order' });
    }

    let subTotalAmount = 0;
    const orderProducts = [];
    // Calculate total amount from database prices
    for (let i = 0; i < products.length; i++) {
      const product = await Product.findByPk(products[i].productId);
      console.log("Product:", product)
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found with id ${products[i].productId}` });
      }

      const itemTotal = product.price * products[i].quantity;
      subTotalAmount += itemTotal;

      orderProducts.push({
        productId: product.id,
        name: product.name,
        quantity: products[i].quantity,
        price: product.price
      });
      
      // Update stock
      if (product.stock < products[i].quantity) {
        return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}. Available: ${product.stock}` });
      }
      product.stock -= products[i].quantity;
      await product.save();
    }

    const cgst = Math.round(subTotalAmount * 0.09);
    const sgst = Math.round(subTotalAmount * 0.09);
    const totalAmount = subTotalAmount + cgst + sgst;

    const order = await Order.create({
      customerId: req.user.id,
      customerName,
      phone,
      email,
      address,
      paymentMethod,
      products: orderProducts,
      totalAmount
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if customer owns order or user is admin
    if (order.customerId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = req.body.status;
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get today's orders count
// @route   GET /api/orders/stats/today
// @access  Private/Admin
exports.getTodayOrders = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayOrders = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfToday, endOfToday]
        }
      }
    });

    res.status(200).json({ 
      success: true, 
      count: todayOrders.length,
      data: todayOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
