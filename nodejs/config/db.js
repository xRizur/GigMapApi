const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully!');
  } catch (err) {
    console.error('Error with MongoDB Connection: ', err);
    process.exit(1);
  }
};

module.exports = connectDB;
