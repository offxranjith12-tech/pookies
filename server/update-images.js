const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User'); // Artists are users? Let me check Artist.js model
const Artist = require('./models/Artist');
const { sequelize } = require('./config/db');

dotenv.config();

const updateImages = async () => {
  try {
    await sequelize.authenticate();
    
    // Update Artists
    const artists = await Artist.findAll({ where: { image: 'no-photo.jpg' } });
    const artistImages = [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=400"
    ];
    for (let i = 0; i < artists.length; i++) {
      artists[i].image = artistImages[i % artistImages.length];
      await artists[i].save();
    }
    console.log(`Updated ${artists.length} artists with new profile images.`);
    
    // Update old products that have no-photo
    const oldProducts = await Product.findAll({ where: { image: 'no-photo.jpg' } });
    const generalProductImage = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400";
    for (let i = 0; i < oldProducts.length; i++) {
      oldProducts[i].image = generalProductImage;
      await oldProducts[i].save();
    }
    console.log(`Updated ${oldProducts.length} old products with general image.`);
    
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

updateImages();
