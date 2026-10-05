const { sequelize } = require('../config/db');

const User = require('./User');
const Product = require('./Product');
const Artist = require('./Artist');
const Booking = require('./Booking');
const Order = require('./Order');
const Review = require('./Review');

// Define associations
User.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(User, { foreignKey: 'customerId' });

User.hasMany(Booking, { foreignKey: 'customerId' });
Booking.belongsTo(User, { foreignKey: 'customerId' });

Artist.hasMany(Booking, { foreignKey: 'artistId' });
Booking.belongsTo(Artist, { foreignKey: 'artistId' });

User.hasOne(Artist, { foreignKey: 'userId' });
Artist.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Review, { foreignKey: 'customerId' });
Review.belongsTo(User, { as: 'Customer', foreignKey: 'customerId' });

module.exports = {
  sequelize,
  User,
  Product,
  Artist,
  Booking,
  Order,
  Review
};
