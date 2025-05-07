const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  genre: { type: String, required: true },
  copiesAvailable: { type: Number, required: true, default: 1 },
  description: { type: String },
  coverImageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
