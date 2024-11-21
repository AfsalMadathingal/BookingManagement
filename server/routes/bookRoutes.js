import express from 'express';
import upload from '../utils/multer.js';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
  searchBooks
} from '../controllers/booksController.js';

const router = express.Router();

// Create a new book
router.post('/', upload, createBook);

// Get all books
router.get('/', getAllBooks);

// Get a book by ID
router.get('/:id', getBookById);

// Update a book by ID
router.put('/:id', upload, updateBookById);

// Delete a book by ID
router.delete('/:id', deleteBookById);

// Search books
router.get('/search/q', searchBooks);

export default router;
