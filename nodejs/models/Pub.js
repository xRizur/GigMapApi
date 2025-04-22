const mongoose = require('mongoose');

const bandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  map_url: { type: String, required: false },
  image: { type: String, required: false },
  availability: [
    {
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Pub', bandSchema);
