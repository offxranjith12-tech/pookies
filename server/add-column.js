const { sequelize } = require('./config/db');

const addColumn = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.query(`ALTER TABLE Orders ADD COLUMN paymentMethod VARCHAR(255) DEFAULT 'Cash on Delivery'`);
    console.log('Successfully added paymentMethod column to Orders table.');
    process.exit(0);
  } catch (error) {
    if (error.message.includes('duplicate column name') || error.message.includes('already exists')) {
      console.log('Column already exists, all good.');
      process.exit(0);
    }
    console.error('Error adding column:', error.message);
    process.exit(1);
  }
};

addColumn();
