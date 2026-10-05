const { sequelize } = require('./models/index.js');
const { connectDB } = require('./config/db.js');

async function syncDb() {
  await connectDB();
  console.log('Syncing database...');
  await sequelize.sync({ alter: true });
  console.log('Database synced successfully');
  process.exit(0);
}

syncDb();
