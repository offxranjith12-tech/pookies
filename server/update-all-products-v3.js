const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const { sequelize } = require('./config/db');

dotenv.config();

const brainDir = "C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\86a6ad2a-a98c-45d7-b0f2-61210920f251";
const publicImagesDir = path.join(__dirname, '..', 'client', 'public', 'images', 'generated');

// Ensure directory exists
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Map the generated files
const generatedFiles = [
  'makeup_eyeliner_1790863395424.jpg',
  'makeup_eyeshadow_1790863421506.jpg',
  'makeup_foundation_1790863381241.jpg',
  'makeup_lipstick_1790863408349.jpg'
];

// Copy files
const localImagePaths = [];
for (let i = 0; i < generatedFiles.length; i++) {
  const sourcePath = path.join(brainDir, generatedFiles[i]);
  const destName = `ai_makeup_${i}.jpg`;
  const destPath = path.join(publicImagesDir, destName);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    localImagePaths.push(`/images/generated/${destName}`);
  }
}

console.log(`Copied ${localImagePaths.length} AI generated images to public folder.`);

const updateAllProductsV3 = async () => {
  try {
    await sequelize.authenticate();
    const products = await Product.findAll();
    
    for (let i = 0; i < products.length; i++) {
      let product = products[i];
      // Assign an image from our guaranteed local AI images
      // If it's foundation, maybe we can try to match it, otherwise random
      const nameLower = product.name.toLowerCase();
      let selectedPath = localImagePaths[0]; // default to eyeliner
      
      if (nameLower.includes('foundation')) selectedPath = localImagePaths.find(p => p.includes('2')) || localImagePaths[0]; // foundation is index 2
      else if (nameLower.includes('eyeliner')) selectedPath = localImagePaths.find(p => p.includes('0')) || localImagePaths[0]; // eyeliner is index 0
      else selectedPath = localImagePaths[i % localImagePaths.length]; // fallback round robin
      
      product.image = selectedPath;
      await product.save();
    }
    
    console.log(`Successfully updated ${products.length} products with GUARANTEED local AI images!`);
    process.exit();
  } catch (error) {
    console.error('Error updating products:', error);
    process.exit(1);
  }
};

updateAllProductsV3();
