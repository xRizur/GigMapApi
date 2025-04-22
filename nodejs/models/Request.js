const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    bandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Band', required: true },
    pubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pub', required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    message: { type: String },
    initiator: { type: String, enum: ['band', 'pub'], required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);