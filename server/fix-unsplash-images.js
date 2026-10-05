const https = require('https');
const Product = require('./models/Product');
const { sequelize } = require('./config/db');

const urls = [
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
  "https://images.unsplash.com/photo-1526413232644-8a40f41ce931?auto=format&fit=crop&q=80&w=400"
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 302 ? url : null);
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.abort(); resolve(null); });
    req.end();
  });
}

const fixImages = async () => {
  try {
    await sequelize.authenticate();
    
    console.log('Checking URLs for validity...');
    const results = await Promise.all(urls.map(checkUrl));
    const validUrls = results.filter(u => u !== null);
    
    console.log(`Found ${validUrls.length} valid images out of ${urls.length}`);
    
    if (validUrls.length === 0) {
      console.log('No valid URLs found. Exiting.');
      process.exit(1);
    }
    
    const products = await Product.findAll();
    for (let i = 0; i < products.length; i++) {
      products[i].image = validUrls[i % validUrls.length];
      await products[i].save();
    }
    
    console.log(`Updated ${products.length} products with strictly VALID Unsplash images!`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixImages();
