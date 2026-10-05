const dotenv = require('dotenv');
const Product = require('./models/Product');
const { sequelize } = require('./config/db');

dotenv.config();

const updateAllProducts = async () => {
  try {
    await sequelize.authenticate();
    
    const products = await Product.findAll();
    
    for (let i = 0; i < products.length; i++) {
      let product = products[i];
      
      // 1. Give every product a UNIQUE image using loremflickr with a lock parameter
      // Using 'makeup' or 'cosmetics' as keyword
      // Lock ensures it doesn't change on every refresh, but is unique per product
      let keyword = product.category.toLowerCase().includes('skincare') ? 'skincare' 
                  : product.name.toLowerCase().includes('eyeliner') ? 'eyeliner'
                  : product.name.toLowerCase().includes('foundation') ? 'foundation'
                  : 'cosmetics';
                  
      // Use loremflickr for unique images
      product.image = `https://loremflickr.com/400/400/${keyword}?lock=${product.id || (i + 100)}`;
      
      // 2. Decrease the price
      // Let's decrease all prices by 40% to make them significantly cheaper, or set a new range
      let oldPrice = parseFloat(product.price);
      let newPrice = Math.floor(oldPrice * 0.5); // Reduce by 50%
      
      // Ensure a minimum price
      if (newPrice < 99) newPrice = 99;
      
      product.price = newPrice;
      
      await product.save();
    }
    
    console.log(`Successfully updated ${products.length} products with UNIQUE images and decreased prices!`);
    
    process.exit();
  } catch (error) {
    console.error('Error updating products:', error);
    process.exit(1);
  }
};

updateAllProducts();
