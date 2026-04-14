import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ScanAdd = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isbn, setIsbn] = useState('');
  const [recentScans, setRecentScans] = useState([]);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get('/api/locations');
        setLocations(res.data);
      } catch (err) {
        console.error('Failed to fetch locations', err);
        setError('Failed to load locations. Is backend running?');
      }
    };
    fetchLocations();
  }, []);

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      setError('Please select a location first.');
      return;
    }
    if (!isbn.trim()) return;

    try {
      setError('');
      const res = await axios.post('/api/books', {
        isbn: isbn.trim(),
        location_id: parseInt(selectedLocation, 10),
      });

      setRecentScans((prev) => [res.data, ...prev]);
      setIsbn(''); // Clear input for next scan
      if (inputRef.current) inputRef.current.focus();
    } catch (err) {
      console.error('Failed to add book', err);
      setError('Failed to add book. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl print:hidden">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scan & Add Books</h1>
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          &larr; Back
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">1. Select Target Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full p-2 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
          >
            <option value="" disabled>-- Select a Location --</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleScanSubmit}>
          <label className="block text-sm font-medium mb-2">2. Scan ISBN</label>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="Enter ISBN..."
              className="flex-1 p-3 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-lg"
              autoFocus
              disabled={!selectedLocation}
            />
            <button
              type="submit"
              disabled={!selectedLocation || !isbn.trim()}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Add
            </button>
          </div>
          {!selectedLocation && (
            <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
              Select a location above to enable scanning.
            </p>
          )}
        </form>
      </div>

      {recentScans.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Additions (This Session)</h2>
          <div className="space-y-3">
            {recentScans.map((book, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-sm">
                <div>
                  <span className="font-medium">{book.isbn}</span>
                  <span className="text-sm text-gray-500 ml-3">
                    {locations.find(l => l.id === book.location_id)?.name}
                  </span>
                </div>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  Fetching Data...
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanAdd;
