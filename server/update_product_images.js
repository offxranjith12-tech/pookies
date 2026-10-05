const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/belleaura').then(async () => {
  await mongoose.connection.collection('products').updateMany({}, { $set: { image: '/uploads/cosmetic-product.jpg' } });
  console.log('Updated products');
  process.exit(0);
});
