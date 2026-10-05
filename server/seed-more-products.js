const { sequelize } = require('./config/db');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const newProducts = [
  {
    name: 'MAC Powder Kiss Lipsticks',
    brand: 'MAC Cosmetics',
    category: 'Makeup',
    description: '12-hour wear, conditions and nourishes lips. Pigment-rich color with a soft-focus matte finish.',
    price: 1950.00,
    stock: 45,
    image: '/images/products/mac_lipsticks.jpg',
    featured: true
  },
  {
    name: 'The 11 Types of Foundation',
    brand: 'Beauty Collection',
    category: 'Makeup',
    description: 'A comprehensive collection of 11 different foundation types ranging from sheer tints to full coverage.',
    price: 8500.00,
    stock: 5,
    image: '/images/products/types_foundation.jpg',
    featured: true
  },
  {
    name: 'BB Beauty & Babe Foundation',
    brand: 'Beauty & Babe',
    category: 'Makeup',
    description: 'Delicate essence foundation cream. Perfectly fits skin, glossy appearance, intensive restoration. SPF 45 PA+++.',
    price: 1299.00,
    stock: 60,
    image: '/images/products/bb_foundation.jpg',
    featured: true
  },
  {
    name: 'K10 Pro Nail Colour',
    brand: 'K10 Pro',
    category: 'Nails',
    description: 'Metallic finish nail color available in stunning Silver and Gold. Long-lasting shine.',
    price: 299.00,
    stock: 150,
    image: '/images/products/k10_nail_colour.jpg',
    featured: true
  },
  {
    name: 'Elan Beaute Eyeliner & Mascara',
    brand: 'Elan Beaute',
    category: 'Eye Makeup',
    description: 'Beauty that empowers. Long-lasting & waterproof 36H eyeliner and mascara combo. Smudge-proof with precision tip.',
    price: 899.00,
    stock: 80,
    image: '/images/products/elan_beaute.jpg',
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
