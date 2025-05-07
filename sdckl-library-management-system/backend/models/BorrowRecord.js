const mongoose = require('mongoose');

const BorrowRecordSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowDate: { type: Date, required: true, default: Date.now },
  returnDate: { type: Date, default: null },
  remarks: { type: String, default: 'Borrowed' },
  penaltyFee: { type: Number, default: 0 },
}, { timestamps: true });

// Method to calculate penalty fee based on due date and return date
BorrowRecordSchema.methods.calculatePenalty = function(dueDate) {
  if (!this.returnDate) {
    return 0;
  }
  const returnTime = this.returnDate.getTime();
  const dueTime = dueDate.getTime();
  const diffDays = Math.ceil((returnTime - dueTime) / (1000 * 3600 * 24));
  if (diffDays > 0) {
    return diffDays; // Assuming penalty fee is 1 unit per day overdue
  }
  return 0;
};

module.exports = mongoose.model('BorrowRecord', BorrowRecordSchema);
