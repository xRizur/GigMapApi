const mongoose = require('mongoose');

const pubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  map_url: { type: String, required: false },
  image: { type: String, required: false },
  description: { type: String, required: false },
  contactEmail: { type: String, required: false },
  contactPhone: { type: String, required: false },
  websiteUrl: { type: String, required: false },
  availability: [
    {
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Pub', pubSchema);
