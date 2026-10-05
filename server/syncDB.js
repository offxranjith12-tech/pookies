const { sequelize } = require('./models');

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced successfully, Reviews table created.');
  process.exit();
}).catch(err => {
  console.error('Error syncing DB:', err);
  process.exit(1);
});
