const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const authMiddleware = require('../middleware/authMiddleware');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ title: 1 });
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new book (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { title, author, isbn, genre, copiesAvailable, description, coverImageUrl } = req.body;
    if (!title || !author || !isbn || !genre || !copiesAvailable) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }
    const book = new Book({
      title,
      author,
      isbn,
      genre,
      copiesAvailable,
      description,
      coverImageUrl,
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a book (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const bookId = req.params.id;
    const { title, author, isbn, genre, copiesAvailable, description, coverImageUrl } = req.body;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.genre = genre || book.genre;
    book.copiesAvailable = copiesAvailable !== undefined ? copiesAvailable : book.copiesAvailable;
    book.description = description || book.description;
    book.coverImageUrl = coverImageUrl || book.coverImageUrl;
    await book.save();
    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a book (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const bookId = req.params.id;
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
