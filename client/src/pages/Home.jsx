import React, { useState } from 'react'
import BookCard from '../components/BookCard'
import { useNavigate } from 'react-router-dom';

const Books = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 over">
      {/* Navigation */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src="/logo.png" 
              alt="Book Store Logo" 
              className="h-10 w-10 rounded-full"
            />
            <h2 className="text-xl font-bold text-gray-800 hidden md:block">Book Haven</h2>
          </div>

          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-purple-600 transition duration-300">Home</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition duration-300">Categories</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition duration-300">Bestsellers</a>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate("/addbook")}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300 hidden md:block"
            >
              + Add Book
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden focus:outline-none"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <a href="#" className="block py-2 text-gray-700 hover:bg-gray-100">Home</a>
              <a href="#" className="block py-2 text-gray-700 hover:bg-gray-100">Categories</a>
              <a href="#" className="block py-2 text-gray-700 hover:bg-gray-100">Bestsellers</a>
              <button 
                onClick={() => navigate("/addbook")}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
              >
                + Add Book
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-8 ">
        <h1 className='text-4xl md:text-6xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-center mb-8'>
          Books Collection
        </h1>

        <BookCard />
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Book Haven. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Books