const express = require('express');
const router = express.Router();
const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');
const authMiddleware = require('../middleware/authMiddleware');

// Borrow a book
router.post('/borrow/:bookId', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const bookId = req.params.bookId;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.copiesAvailable < 1) {
      return res.status(400).json({ message: 'No copies available' });
    }

    // Create borrow record
    const borrowRecord = new BorrowRecord({
      studentId: user.studentId,
      studentName: user.studentName,
      book: book._id,
      borrowDate: new Date(),
      remarks: 'Borrowed',
      penaltyFee: 0,
    });

    await borrowRecord.save();

    // Decrement available copies
    book.copiesAvailable -= 1;
    await book.save();

    res.status(201).json(borrowRecord);
  } catch (error) {
    console.error('Error borrowing book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Return a book
router.post('/return/:borrowId', authMiddleware, async (req, res) => {
  try {
    const borrowId = req.params.borrowId;
    const borrowRecord = await BorrowRecord.findById(borrowId).populate('book');
    if (!borrowRecord) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }
    if (borrowRecord.returnDate) {
      return res.status(400).json({ message: 'Book already returned' });
    }

    const dueDate = new Date(borrowRecord.borrowDate);
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks borrowing period

    const returnDate = new Date();
    borrowRecord.returnDate = returnDate;

    // Calculate penalty fee
    const penaltyDays = Math.ceil((returnDate - dueDate) / (1000 * 3600 * 24));
    borrowRecord.penaltyFee = penaltyDays > 0 ? penaltyDays : 0;

    borrowRecord.remarks = borrowRecord.penaltyFee > 0 ? 'Overdue' : 'Returned';

    await borrowRecord.save();

    // Increment available copies
    const book = borrowRecord.book;
    book.copiesAvailable += 1;
    await book.save();

    res.json(borrowRecord);
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get borrow records for logged-in user
router.get('/my-borrows', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const records = await BorrowRecord.find({ studentId: user.studentId })
      .populate('book')
      .sort({ borrowDate: -1 });
    res.json(records);
  } catch (error) {
    console.error('Error fetching borrow records:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
