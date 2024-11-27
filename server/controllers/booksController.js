import Book from '../models/Book.js';
import elasticsearchClient from '../utils/elasticsearchClient.js';
import cloudinary from '../utils/cloudinaryCofig.js';
import fs from 'fs';



export const createBook = async (req, res) => {
  try {


    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'books', // Optional: specify a folder in Cloudinary
      public_id: `${req.body.title}-${Date.now()}`, // Unique identifier for the image
      resource_type: 'image',
      use_filename: true,
      unique_filename: true
    });

    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Failed to delete local file:', err);
    });

    // Add Cloudinary URL to the book's cover photo
    req.body.coverPhoto = result.secure_url;

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
    console.log(err);
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
      const publicId = `books/`+coverPhoto.split('/').pop().split('.')[0];
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Deleted from Cloudinary:", result);
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
