const { sequelize } = require('./config/db');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const newProducts = [
  {
    name: 'Attarful MOGRA Eau De Perfume',
    brand: 'Attarful',
    category: 'Fragrance',
    description: 'The New Essence of Jasmine. Long lasting fragrance, apparel perfume. 60ml of pure elegance.',
    price: 1599.00,
    stock: 35,
    image: '/images/products/attarful_mogra.jpg',
    featured: true
  },
  {
    name: 'VOKKA Pure Luxury Perfume',
    brand: 'VOKKA',
    category: 'Fragrance',
    description: 'Pure Luxury Unisex Perfume. 20ML travel size with premium gold cap design.',
    price: 999.00,
    stock: 50,
    image: '/images/products/vokka_perfume.jpg',
    featured: true
  }
];

const seedProducts = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    for (const product of newProducts) {
      await Product.create(product);
      console.log(`Created product: ${product.name}`);
    }

    console.log('Data Import Success');
    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

seedProducts();
