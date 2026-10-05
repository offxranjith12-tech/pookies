const { Booking, Artist, User } = require('../models');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const {
      artistId,
      customerName,
      phone,
      email,
      eventType,
      eventDate,
      eventTime,
      location,
      notes
    } = req.body;

    const booking = await Booking.create({
      customerId: req.user.id,
      artistId,
      customerName,
      phone,
      email,
      eventType,
      eventDate,
      eventTime,
      location,
      notes
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [{ model: Artist, attributes: ['name', 'specialization'] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { customerId: req.user.id },
      include: [{ model: Artist, attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Artist, attributes: ['name'] }]
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if customer owns booking or user is admin
    if (booking.customerId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role === 'artist') {
      const artist = await Artist.findOne({ where: { userId: req.user.id } });
      if (!artist || booking.artistId !== artist.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    booking.status = req.body.status;
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get artist's bookings
// @route   GET /api/bookings/artist
// @access  Private/Artist
exports.getArtistBookings = async (req, res) => {
  try {
    const artist = await Artist.findOne({ where: { userId: req.user.id } });
    if (!artist) {
      return res.status(404).json({ success: false, message: 'Artist profile not found' });
    }

    const bookings = await Booking.findAll({
      where: { artistId: artist.id },
      order: [['eventDate', 'ASC']]
    });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
