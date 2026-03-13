const mongoose = require('mongoose');

const SavedInternshipSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internshipId: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  salary: { type: String },
  description: { type: String },
  url: { type: String, required: true },
  category: { type: String },
  postedDate: { type: String },
  savedAt: { type: Date, default: Date.now }
});

SavedInternshipSchema.index({ user: 1, internshipId: 1 }, { unique: true });

module.exports = mongoose.model('SavedInternship', SavedInternshipSchema);