import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publicationYear: { type: Number, required: true },
  isbn: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  coverPhoto: { type: String, required: true },
});

const Book = mongoose.model('Book', bookSchema);

export default Book 