const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const { sequelize } = require('./config/db');

dotenv.config();

const publicImagesDir = path.join(__dirname, '..', 'client', 'public', 'images', 'products');

// Ensure directory exists
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Some nice gradient colors
const gradients = [
  ['#ff9a9e', '#fecfef'],
  ['#fbc2eb', '#a6c1ee'],
  ['#fdcbf1', '#e6dee9'],
  ['#a1c4fd', '#c2e9fb'],
  ['#d4fc79', '#96e6a1'],
  ['#84fab0', '#8fd3f4'],
  ['#fccb90', '#d57eeb'],
  ['#e0c3fc', '#8ec5fc'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a8edea', '#fed6e3'],
  ['#f5576c', '#f093fb'],
  ['#5ee7df', '#b490ca'],
  ['#d299c2', '#fef9d7']
];

function generateSVG(name, brand, index) {
  const [color1, color2] = gradients[index % gradients.length];
  // Extract a short name for large text
  const shortName = name.split(' ').slice(0, 2).join(' ');
  
  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15" />
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad${index})" />
    
    <!-- Decorative cosmetic shape (circle/bottle/compact abstract) -->
    <circle cx="200" cy="180" r="80" fill="#ffffff" fill-opacity="0.2" filter="url(#shadow)" />
    <circle cx="200" cy="180" r="70" fill="#ffffff" fill-opacity="0.9" />
    
    <!-- Icon representing brand letter -->
    <text x="200" y="210" font-family="Arial, sans-serif" font-size="70" font-weight="bold" fill="${color1}" text-anchor="middle">
      ${brand.charAt(0).toUpperCase()}
    </text>
    
    <!-- Brand -->
    <text x="200" y="320" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="2">
      ${brand.toUpperCase()}
    </text>
    
    <!-- Product Name -->
    <text x="200" y="350" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#333333" text-anchor="middle">
      ${shortName}
    </text>
  </svg>`;
}

const generateUniqueImages = async () => {
  try {
    await sequelize.authenticate();
    const products = await Product.findAll();
    
    for (let i = 0; i < products.length; i++) {
      let product = products[i];
      
      const svgContent = generateSVG(product.name, product.brand, i);
      const fileName = `product_${product.id}_${i}.svg`;
      const filePath = path.join(publicImagesDir, fileName);
      
      // Save SVG locally
      fs.writeFileSync(filePath, svgContent);
      
      // Update DB
      product.image = `/images/products/${fileName}`;
      await product.save();
    }
    
    console.log(`Successfully generated and assigned 100% UNIQUE SVG images to all ${products.length} products!`);
    process.exit();
  } catch (error) {
    console.error('Error generating SVGs:', error);
    process.exit(1);
  }
};

generateUniqueImages();
