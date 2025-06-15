const mongoose = require('mongoose');

const bandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genre: { type: String, required: true },
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

module.exports = mongoose.model('Band', bandSchema);
