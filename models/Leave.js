const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  userId: { type: String, required: true, default: 'Vidisha-IN-01' },
  type: { type: String, required: true }, // Casual, Sick, Academic
  reason: { type: String, required: true },
  days: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  appliedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);