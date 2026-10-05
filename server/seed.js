const { sequelize, User, Product, Artist, Order, Booking } = require('./models');
const dotenv = require('dotenv');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@pookies.com',
    password: 'password123',
    role: 'admin',
    phone: '1234567890'
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
    role: 'customer',
    phone: '9876543210'
  }
];

const products = [
  {
    name: 'Strawberry Dew Moisturizer',
    brand: 'Dot & Key',
    category: 'Skincare',
    description: '4-in-1 multipurpose do-it-all moisturizer with niacinamide & peptides.',
    price: 495,
    stock: 50,
    image: '/uploads/dot_key_moisturizer.jpg',
    featured: true
  },
  {
    name: 'Aneri Sunscreen SPF 50',
    brand: 'Aneri',
    category: 'Skincare',
    description: 'SPF 50 PA++++ UVA & UVB protection for all skin types.',
    price: 399,
    stock: 40,
    image: '/uploads/aneri_sunscreen.jpg',
    featured: true
  },
  {
    name: 'Rosemary Anti-Hair Fall Shampoo',
    brand: 'Glomix',
    category: 'Haircare',
    description: 'Clinically proven anti-hair fall shampoo with Rosemary and Methi Dana.',
    price: 449,
    stock: 30,
    image: '/uploads/glomix_shampoo.jpg',
    featured: true
  },
  {
    name: 'Advanced Hair Growth Serum Set',
    brand: 'Neem Villa',
    category: 'Haircare',
    description: 'Rosemary & Rice water hair growth serum set for advanced hair care.',
    price: 999,
    stock: 25,
    image: '/uploads/neem_villa_serum.png',
    featured: false
  },
  {
    name: 'Velvet Matte Lipstick',
    brand: 'Lumiere',
    category: 'Makeup',
    description: 'Long-lasting, deeply pigmented matte lipstick in classic red.',
    price: 299,
    stock: 50,
    image: '/uploads/luxury_lipstick.jpg',
    featured: false
  },
  {
    name: 'Radiance Face Serum',
    brand: 'GlowSkin',
    category: 'Skincare',
    description: 'Hydrating face serum infused with Vitamin C and Hyaluronic Acid.',
    price: 449,
    stock: 30,
    image: '/uploads/face_serum.jpg',
    featured: false
  },
  {
    name: 'Pro Eyeshadow Palette',
    brand: 'ColorVibe',
    category: 'Makeup',
    description: '18 vibrant shades for everyday and party looks.',
    price: 599,
    stock: 25,
    image: '/uploads/eyeshadow_palette.jpg',
    featured: true
  },
  {
    name: 'Premium Makeup Brush Set',
    brand: 'ProTools',
    category: 'Beauty Tools',
    description: '12-piece professional makeup brush set.',
    price: 399,
    stock: 20,
    image: '/uploads/premium_brush_set.jpg',
    featured: false
  }
];

const artists = [
  {
    name: 'Ananya Beauty Studio',
    specialization: 'Bridal Makeup',
    location: 'Madurai',
    experience: '5 Years',
    rating: 4.9,
    startingPrice: 4999,
    description: 'Specializing in traditional and modern bridal looks with premium products.',
    services: ['Bridal Makeup', 'Engagement', 'Reception'],
    image: '/uploads/artist_1.png',
    available: true
  },
  {
    name: 'Glamour by Priya',
    specialization: 'Party Makeup',
    location: 'Chennai',
    experience: '3 Years',
    rating: 4.7,
    startingPrice: 2499,
    description: 'Your go-to artist for flawless party and photoshoot makeup.',
    services: ['Party Makeup', 'Photoshoot', 'Guest Makeup'],
    image: '/uploads/artist_2.jpg',
    available: true
  },
  {
    name: 'Elite Brides & Co.',
    specialization: 'Bridal Makeup',
    location: 'Coimbatore',
    experience: '8 Years',
    rating: 5.0,
    startingPrice: 8999,
    description: 'Luxury bridal makeover packages for your special day.',
    services: ['Bridal Makeup', 'Airbrush Makeup', 'Reception'],
    image: '/uploads/artist_3.png',
    available: true
  },
  {
    name: 'Glow Artistry',
    specialization: 'Engagement & Reception',
    location: 'Trichy',
    experience: '4 Years',
    rating: 4.8,
    startingPrice: 3499,
    description: 'Soft glam and elegant looks for pre-wedding events.',
    services: ['Engagement', 'Reception', 'Party Makeup'],
    image: '/uploads/artist_4.jpg',
    available: true
  },
  {
    name: 'Luxe Makeovers',
    specialization: 'HD Bridal Makeup',
    location: 'Bangalore',
    experience: '6 Years',
    rating: 4.9,
    startingPrice: 7999,
    description: 'High-definition makeup for picture-perfect moments.',
    services: ['HD Bridal Makeup', 'Photoshoot', 'Engagement'],
    image: '/uploads/artist_5.png',
    available: false
  }
];

const importData = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Tables synced!');

    // Use individual create logic for users to trigger the beforeCreate hook (hashing passwords)
    for (const user of users) {
      await User.create(user);
    }
    
    await Product.bulkCreate(products);
    await Artist.bulkCreate(artists);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await sequelize.sync({ force: true }); // This will drop and recreate tables empty
    console.log('Data Destroyed (Tables dropped and recreated empty)!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destroy: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
