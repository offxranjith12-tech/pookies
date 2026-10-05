const dotenv = require('dotenv');
const Product = require('./models/Product');
const { sequelize } = require('./config/db');

// Load env vars
dotenv.config();

const brandImages = {
  foundation: [
    "https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1591130901221-0f298226eca2?auto=format&fit=crop&q=80&w=400",
    "https://plus.unsplash.com/premium_photo-1671569429599-52317cdaecba?auto=format&fit=crop&q=80&w=400"
  ],
  eyeliner: [
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1512496015851-a1c8d15c7117?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1583241495945-81643c7b3b3a?auto=format&fit=crop&q=80&w=400"
  ]
};

const brands = ['L\'Oreal', 'Maybelline', 'MAC', 'Lakme', 'NYX', 'Revlon', 'Fenty Beauty', 'Huda Beauty', 'Sephora', 'Colorbar'];

const products = [];

// Generate 10 Foundations
for(let i=1; i<=10; i++) {
  const brand = brands[i % brands.length];
  products.push({
    name: `${brand} Flawless Liquid Foundation ${i}`,
    brand: brand,
    category: 'Makeup',
    description: `A flawless, long-lasting liquid foundation by ${brand}. Provides excellent coverage and matches your skin tone perfectly.`,
    price: Math.floor(Math.random() * (2000 - 500 + 1)) + 500, // Random price between 500 and 2000
    stock: Math.floor(Math.random() * 50) + 10, // Stock between 10 and 60
    image: brandImages.foundation[i % brandImages.foundation.length],
    featured: i <= 3
  });
}

// Generate 40 Eyeliners
for(let i=1; i<=40; i++) {
  const brand = brands[i % brands.length];
  products.push({
    name: `${brand} Precision Liquid Eyeliner ${i}`,
    brand: brand,
    category: 'Makeup',
    description: `A precise and smudge-proof liquid eyeliner from ${brand}. Intense black finish for the perfect winged look.`,
    price: Math.floor(Math.random() * (1000 - 200 + 1)) + 200, // Random price between 200 and 1000
    stock: Math.floor(Math.random() * 100) + 20, // Stock between 20 and 120
    image: brandImages.eyeliner[i % brandImages.eyeliner.length],
    featured: i <= 5
  });
}

const seedProducts = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    
    await Product.bulkCreate(products);
    console.log(`Added ${products.length} products successfully!`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
