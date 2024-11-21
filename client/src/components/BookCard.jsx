import React, { useEffect, useState } from 'react';
import { getBooks, searchBooks } from "../services/api";
import toast from 'react-hot-toast';
import BookDetailsModal from './BookDetailsModal';

const BookCard = () => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [keyword, setKeyword] = useState('');

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await getBooks();
      setList(response);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch books');
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await searchBooks(keyword);
      setList(response);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const BookSkeleton = () => (
    <div className="animate-pulse bg-white shadow-md rounded-xl p-4 space-y-4">
      <div className="h-56 bg-gray-300 rounded-lg"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 py-8">
      <BookDetailsModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        book={selectedBook}
      />
      <div className="max-w-6xl mx-auto">
        <form 
          onSubmit={handleSearch} 
          className="flex items-center justify-center mb-8 space-x-4 w-full"
        >
          <input 
            type="text" 
            placeholder="Search books by title, author, or genre" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="p-3 border-2 border-gray-300 rounded-lg w-full max-w-xl focus:ring-2 focus:ring-purple-500 transition duration-300"
          />
          <button 
            type="submit" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 whitespace-nowrap"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
          {isLoading
            ? Array(12).fill().map((_, index) => <BookSkeleton key={index} />)
            : list.map((book, index) => (
                <div 
                  key={index}
                  className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group"
                  onClick={() => {
                    setSelectedBook(book);
                    setIsViewOpen(true);
                  }}
                >
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <img 
                      src={book.coverPhoto} 
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm md:text-base mb-1 truncate">{book.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-semibold text-xs md:text-sm">{book.price}</span>
                      <span className="text-purple-500 hover:text-purple-700 text-xs md:text-sm transition duration-300 opacity-0 group-hover:opacity-100">
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default BookCard;