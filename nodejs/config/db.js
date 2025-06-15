const mongoose = require('mongoose');

async function connectDB() {
  let mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
    console.log('Używam in-memory MongoDB:', mongoUri);
  }
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error with MongoDB Connection: ', err);
  }
}

module.exports = connectDB;