import Book from '../models/Book.js';
import elasticsearchClient from '../utils/elasticsearchClient.js';
import fs from 'fs';

// Create a new book
export const createBook = async (req, res) => {
  try {
    req.body.coverPhoto = process.env.BASE_URL + '/uploads/' + req.file.filename;

    // Save to MongoDB
    const book = new Book(req.body);
    await book.save();

    // Index in Elasticsearch
    await elasticsearchClient.index({
      index: 'books',
      id: book._id.toString(),
      document: {
        title: book.title,
        author: book.author,
        description: book.description,
        coverPhoto: book.coverPhoto,
      },
    });

    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a book by ID
export const updateBookById = async (req, res) => {
  try {
    if (req.file) {
      req.body.coverPhoto = process.env.BASE_URL + '/uploads/' + req.file.filename;
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });

    // Update Elasticsearch
    await elasticsearchClient.index({
      index: 'books',
      id: book._id.toString(),
      document: book.toObject(),
    });

    res.status(200).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a book by ID
export const deleteBookById = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    // Delete from Elasticsearch
    await elasticsearchClient.delete({
      index: 'books',
      id: req.params.id,
    });

    const { coverPhoto } = book;
    if (coverPhoto) {
      const filePath = coverPhoto.split('uploads/')[1];
      const imagePath = './uploads/' + filePath;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search books
export const searchBooks = async (req, res) => {
  const { keyword } = req.query;
  try {
    const result = await elasticsearchClient.search({
      index: 'books',
      query: {
        multi_match: {
          query: keyword,
          fields: ['title', 'author', 'description'],
        },
      },
    });

    const hits = result.hits.hits.map((hit) => hit._source);
    res.json(hits);
  } catch (err) {
    res.status(500).json({ error: 'Search failed.' });
  }
};
