const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect('mongodb://127.0.0.1:27017/actify')
  .then(async () => {
    console.log('MongoDB connected');
    
    const email = 'admin@actify.com';
    const password = 'admin123';
    
    // Check if admin already exists
    let admin = await User.findOne({ email });
    if (admin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }
    
    // Create admin
    admin = new User({
      name: 'Admin',
      email: email,
      password: password,
      role: 'admin'
    });
    
    await admin.save();
    console.log('Admin user seeded successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
