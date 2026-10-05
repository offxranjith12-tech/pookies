require('dotenv').config({ path: './server/.env' });
const { sequelize } = require('./server/config/db');

sequelize.query("ALTER TABLE Users MODIFY COLUMN role ENUM('customer', 'admin', 'artist') DEFAULT 'customer';")
  .then(() => {
    console.log('Enum updated');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
