import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const LocationView = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locRes, booksRes] = await Promise.all([
          axios.get('/api/locations'),
          axios.get(`/api/locations/${id}/books`),
        ]);
        const currentLocation = locRes.data.find(loc => loc.id === parseInt(id));
        setLocation(currentLocation);
        setBooks(booksRes.data);
      } catch (error) {
        console.error('Error fetching location data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!location) return <div className="p-4 text-red-500">Location not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold">{location.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{location.description}</p>
        </div>
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden print:hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-4 border-b dark:border-gray-600">Cover</th>
              <th className="p-4 border-b dark:border-gray-600">Title</th>
              <th className="p-4 border-b dark:border-gray-600">Author</th>
              <th className="p-4 border-b dark:border-gray-600">Genre</th>
              <th className="p-4 border-b dark:border-gray-600">ISBN</th>
              <th className="p-4 border-b dark:border-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                <td className="p-4 w-24">
                  <img src={book.cover_image_url} alt="Cover" className="w-16 h-24 object-cover shadow" />
                </td>
                <td className="p-4 font-semibold">{book.title}</td>
                <td className="p-4">{book.author}</td>
                <td className="p-4">{book.genre}</td>
                <td className="p-4 text-gray-500 text-sm">{book.isbn}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    book.metadata_status === 'completed' ? 'bg-green-100 text-green-800' :
                    book.metadata_status === 'fetching' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {book.metadata_status}
                  </span>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No books assigned to this location yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationView;
