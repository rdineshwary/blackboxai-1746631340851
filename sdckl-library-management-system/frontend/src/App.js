import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import BorrowList from './components/BorrowList';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const isAuthenticated = !!localStorage.getItem('token'); // Simple auth check

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="p-4 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/books" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {isAuthenticated ? (
              <>
                <Route path="/books" element={<BookList />} />
                <Route path="/books/new" element={<BookForm />} />
                <Route path="/borrow" element={<BorrowList />} />
              </>
            ) : (
              <>
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
