import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch(err => console.error('Error fetching books:', err));
  }, []);

  useEffect(() => {
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.genre.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [search, books]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-red-700">Books</h1>
        <Link to="/books/new" className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
          Add New Book
        </Link>
      </div>
      <input
        type="text"
        placeholder="Search by title, author, or genre"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <table className="min-w-full border border-gray-300">
        <thead className="bg-red-100 text-red-700">
          <tr>
            <th className="border px-4 py-2 text-left">Title</th>
            <th className="border px-4 py-2 text-left">Author</th>
            <th className="border px-4 py-2 text-left">Genre</th>
            <th className="border px-4 py-2 text-left">ISBN</th>
            <th className="border px-4 py-2 text-left">Copies Available</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">No books found.</td>
            </tr>
          ) : (
            filteredBooks.map(book => (
              <tr key={book._id} className="hover:bg-red-50">
                <td className="border px-4 py-2">{book.title}</td>
                <td className="border px-4 py-2">{book.author}</td>
                <td className="border px-4 py-2">{book.genre}</td>
                <td className="border px-4 py-2">{book.isbn}</td>
                <td className="border px-4 py-2">{book.copiesAvailable}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
