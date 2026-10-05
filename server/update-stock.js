const Product = require('./models/Product');
const { sequelize } = require('./config/db');

const updateStock = async () => {
  try {
    await sequelize.authenticate();
    const products = await Product.findAll();
    
    for (let i = 0; i < products.length; i++) {
      let p = products[i];
      // Let's make ~15% out of stock (0)
      // Let's make ~20% low stock (1 to 5)
      // Rest are normal stock (> 10)
      
      const rand = Math.random();
      if (rand < 0.15) {
        p.stock = 0;
      } else if (rand < 0.35) {
        p.stock = Math.floor(Math.random() * 5) + 1; // 1 to 5
      } else {
        p.stock = Math.floor(Math.random() * 50) + 10; // 10 to 59
      }
      
      await p.save();
    }
    console.log(`Updated stock status for ${products.length} products!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateStock();
