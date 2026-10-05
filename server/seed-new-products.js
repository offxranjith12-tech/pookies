const { sequelize } = require('./config/db');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const newProducts = [
  {
    name: 'Zylvex Vitamin C Face Wash',
    brand: 'Zylvex',
    category: 'Skincare',
    description: 'Brightens, refreshes & deeply cleanses dull skin. Daily glow face wash with Niacinamide & Vitamin B3 for all skin types. 60ml/2.02 fl.oz.',
    price: 399.00,
    stock: 50,
    image: '/images/products/zylvex_facewash.png',
    featured: true
  },
  {
    name: 'Assorted Luxury Makeup Kit',
    brand: 'Dior & NARS',
    category: 'Makeup Sets',
    description: 'A curated premium collection featuring Dior eyeshadow palettes, NARS concealers, Bobbi Brown pencils, and Estee Lauder illuminator for the perfect soft glam look.',
    price: 4999.00,
    stock: 15,
    image: '/images/products/makeup_kit_1.jpg',
    featured: true
  },
  {
    name: 'Premium Lipstick & Palette Bundle',
    brand: 'Pookies Exclusives',
    category: 'Makeup Sets',
    description: 'Elevate your vanity with this premium bundle featuring our signature red lipstick, luxury eyeshadow palette, high-quality makeup brush, and matching nail polish.',
    price: 2499.00,
    stock: 25,
    image: '/images/products/makeup_bundle.jpg',
    featured: true
  },
  {
    name: '36H Precision Liquid Eyeliner',
    brand: 'Highlight Nails',
    category: 'Eye Makeup',
    description: 'Waterproof precision liquid eyeliner. 36H durability, smudge-proof, and intense black pigment for the perfect wing every time.',
    price: 450.00,
    stock: 100,
    image: '/images/products/precision_eyeliner.jpg',
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
