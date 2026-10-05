const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Artist = sequelize.define('Artist', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a name' }
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true // True for backward compatibility with old seeds
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: 'no-photo.jpg'
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a specialization' }
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a location' }
    }
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add experience' }
    }
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 5,
    validate: {
      min: 1,
      max: 5
    }
  },
  startingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: { msg: 'Please add starting price' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a description' }
    }
  },
  services: {
    type: DataTypes.JSON,
    allowNull: false
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Artist;
