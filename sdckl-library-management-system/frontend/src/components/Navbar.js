import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-red-700 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/books">SDCKL Library Management System</Link>
      </div>
      <div className="space-x-4">
        {token ? (
          <>
            <Link to="/books" className="hover:underline">Books</Link>
            <Link to="/borrow" className="hover:underline">My Borrows</Link>
            <button onClick={handleLogout} className="bg-red-900 px-3 py-1 rounded hover:bg-red-800">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
