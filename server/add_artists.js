const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Artist = require('./models/Artist');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('MongoDB connected');
  
  const artists = [
    {
      name: 'Thars',
      specialization: 'Bridal Makeup, Engagement & Reception',
      services: ['Bridal Makeup', 'Engagement & Reception', 'Party Makeup'],
      rating: 5.0,
      reviews: 124,
      location: 'Tirunelveli',
      startingPrice: 3500,
      image: '/uploads/thars.jpg',
      bio: 'Professional makeup artist specializing in bridal and engagement looks. I believe in enhancing your natural beauty.',
      description: 'Professional makeup artist specializing in bridal and engagement looks. I believe in enhancing your natural beauty.',
      experience: '5+ Years',
      gallery: [],
      availability: true
    },
    {
      name: 'Kavi',
      specialization: 'HD Bridal Makeup, Party Makeup',
      services: ['HD Bridal Makeup', 'Party Makeup'],
      rating: 4.9,
      reviews: 98,
      location: 'TirunelveliS',
      startingPrice: 3000,
      image: '/uploads/kavi.png',
      bio: 'Creating flawless, camera-ready HD looks for your most memorable events.',
      description: 'Creating flawless, camera-ready HD looks for your most memorable events.',
      experience: '7+ Years',
      gallery: [],
      availability: true
    }
  ];

  try {
    await Artist.insertMany(artists);
    console.log('Artists added successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
