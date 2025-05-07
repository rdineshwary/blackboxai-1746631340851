import React, { useEffect, useState } from 'react';

const BorrowList = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBorrows = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/borrow/my-borrows', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch borrow records');
      }
      const data = await response.json();
      setBorrows(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const handleReturn = async (borrowId) => {
    if (!window.confirm('Are you sure you want to return this book?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/borrow/return/${borrowId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to return book');
      }
      await fetchBorrows();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading borrow records...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-red-700 mb-4">My Borrowed Books</h1>
      {borrows.length === 0 ? (
        <p>No borrow records found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-red-100 text-red-700">
            <tr>
              <th className="border px-4 py-2 text-left">Student ID</th>
              <th className="border px-4 py-2 text-left">Student Name</th>
              <th className="border px-4 py-2 text-left">Book</th>
              <th className="border px-4 py-2 text-left">Borrow Date</th>
              <th className="border px-4 py-2 text-left">Return Date</th>
              <th className="border px-4 py-2 text-left">Penalty Fee</th>
              <th className="border px-4 py-2 text-left">Remarks</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((borrow) => (
              <tr key={borrow._id} className="hover:bg-red-50">
                <td className="border px-4 py-2">{borrow.studentId}</td>
                <td className="border px-4 py-2">{borrow.studentName}</td>
                <td className="border px-4 py-2">{borrow.book?.title || 'N/A'}</td>
                <td className="border px-4 py-2">{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">
                  {borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : 'Not Returned'}
                </td>
                <td className={`border px-4 py-2 ${borrow.penaltyFee > 0 ? 'text-red-700 font-bold' : ''}`}>
                  {borrow.penaltyFee > 0 ? `$${borrow.penaltyFee}` : '-'}
                </td>
                <td className="border px-4 py-2">{borrow.remarks}</td>
                <td className="border px-4 py-2">
                  {!borrow.returnDate && (
                    <button
                      onClick={() => handleReturn(borrow._id)}
                      className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800"
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BorrowList;
