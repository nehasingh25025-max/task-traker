const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: String, required: true, default: 'Vidisha-IN-01' },
  date: { type: String, required: true }, // e.g., "May 14, 2026"
  punchInTime: { type: Date }, // Precise HH:MM:SS:ms
  punchOutTime: { type: Date }, // Precise HH:MM:SS:ms
  status: { type: String, enum: ['PRESENT', 'ABSENT', 'HALF_DAY'], default: 'PRESENT' },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);