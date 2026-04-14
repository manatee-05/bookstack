import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PrintableLabels from '../components/PrintableLabels';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalBooks: 0 });
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [printingLocations, setPrintingLocations] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, locationsRes] = await Promise.all([
          axios.get('/api/stats'),
          axios.get('/api/locations'),
        ]);
        setStats(statsRes.data);
        setLocations(locationsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSelectLocation = (id) => {
    setSelectedLocations((prev) =>
      prev.includes(id) ? prev.filter((locId) => locId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLocations.length === locations.length) {
      setSelectedLocations([]);
    } else {
      setSelectedLocations(locations.map((loc) => loc.id));
    }
  };

  const handlePrintSelected = () => {
    if (selectedLocations.length === 0) return;
    const locsToPrint = locations.filter((loc) => selectedLocations.includes(loc.id));
    setPrintingLocations(locsToPrint);
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
      setPrintingLocations([]);
    }, 100);
  };

  const handlePrintSingle = (location) => {
    setPrintingLocations([location]);
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
      setPrintingLocations([]);
    }, 100);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Printable Area - Only visible during printing */}
      {isPrinting && <PrintableLabels locations={printingLocations} />}

      {/* Main Dashboard Content - Hidden during printing */}
      <div className="print:hidden">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-2">Total Books</h2>
          <p className="text-4xl text-blue-600 dark:text-blue-400">{stats.totalBooks}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Locations</h2>
            <div className="space-x-2">
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {selectedLocations.length === locations.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={handlePrintSelected}
                disabled={selectedLocations.length === 0}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Print Selected Labels
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(location.id)}
                    onChange={() => handleSelectLocation(location.id)}
                    className="w-5 h-5"
                  />
                  <div>
                    <Link
                      to={`/locations/${location.id}`}
                      className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {location.name}
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {location.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handlePrintSingle(location)}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Print Label
                </button>
              </div>
            ))}
            {locations.length === 0 && (
              <p className="text-gray-500 italic">No locations found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
