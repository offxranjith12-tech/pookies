const dotenv = require('dotenv');
const Product = require('./models/Product');
const { sequelize } = require('./config/db');

dotenv.config();

const updateAllProductsV2 = async () => {
  try {
    await sequelize.authenticate();
    
    const products = await Product.findAll();
    
    const unsplashImages = [
      "https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1591130901221-0f298226eca2?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1512496015851-a1c8d15c7117?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1583241495945-81643c7b3b3a?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1571781526291-c477ce4ed0cd?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1625014603092-2d1f7c1a82f3?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1598440947619-225228b49520?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1590156546946-cb5ee38c0356?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1512496015851-a1c8d15c7117?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1526413232644-8a40f41ce931?auto=format&fit=crop&q=80&w=400"
    ];
    
    for (let i = 0; i < products.length; i++) {
      let product = products[i];
      // Assign an image from our reliable Unsplash list
      product.image = unsplashImages[i % unsplashImages.length];
      await product.save();
    }
    
    console.log(`Successfully updated ${products.length} products with reliable Unsplash images!`);
    
    process.exit();
  } catch (error) {
    console.error('Error updating products:', error);
    process.exit(1);
  }
};

updateAllProductsV2();
