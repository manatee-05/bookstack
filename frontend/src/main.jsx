import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LocationView from './pages/LocationView';
import ScanAdd from './pages/ScanAdd';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="locations/:id" element={<LocationView />} />
          <Route path="scan" element={<ScanAdd />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
