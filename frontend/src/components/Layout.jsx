import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen">
      <header className="p-4 bg-gray-800 text-white flex justify-between items-center print:hidden">
        <h1 className="text-xl font-bold">Bookstack</h1>
        <nav className="flex space-x-4">
          <Link to="/" className="hover:text-blue-300">Dashboard</Link>
          <Link to="/scan" className="hover:text-blue-300">Scan/Add</Link>
        </nav>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
