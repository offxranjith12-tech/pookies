const { Artist } = require('../models');

// @desc    Get all artists
// @route   GET /api/artists
// @access  Public
exports.getArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll();
    res.status(200).json({ success: true, count: artists.length, data: artists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single artist
// @route   GET /api/artists/:id
// @access  Public
exports.getArtist = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    
    if (!artist) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }

    res.status(200).json({ success: true, data: artist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new artist
// @route   POST /api/artists
// @access  Private/Admin
exports.createArtist = async (req, res) => {
  try {
    // Check for duplicate name
    const existingArtist = await Artist.findOne({ where: { name: req.body.name } });
    if (existingArtist) {
      return res.status(400).json({ success: false, message: 'An artist with this name already exists' });
    }

    if (req.file) {
      req.body.image = '/uploads/' + req.file.filename;
    } else if (!req.body.image) {
      // Provide a default image if none provided
      req.body.image = 'https://images.unsplash.com/photo-1512496015851-a1c8ba134e7a?q=80&w=600&auto=format&fit=crop';
    }

    if (req.body.services && typeof req.body.services === 'string') {
      req.body.services = req.body.services.split(',').map(s => s.trim());
    }

    const artist = await Artist.create(req.body);
    res.status(201).json({ success: true, data: artist });
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update artist
// @route   PUT /api/artists/:id
// @access  Private/Admin
exports.updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);

    if (!artist) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }

    // Check for duplicate name if name is being changed
    if (req.body.name && req.body.name !== artist.name) {
      const existingArtist = await Artist.findOne({ where: { name: req.body.name } });
      if (existingArtist) {
        return res.status(400).json({ success: false, message: 'An artist with this name already exists' });
      }
    }

    if (req.file) {
      req.body.image = '/uploads/' + req.file.filename;
    }

    if (req.body.services && typeof req.body.services === 'string') {
      req.body.services = req.body.services.split(',').map(s => s.trim());
    }

    await artist.update(req.body);

    res.status(200).json({ success: true, data: artist });
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete artist
// @route   DELETE /api/artists/:id
// @access  Private/Admin
exports.deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);

    if (!artist) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }

    await artist.destroy();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
