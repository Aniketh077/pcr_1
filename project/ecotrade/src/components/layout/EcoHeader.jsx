import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function EcoHeader() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/eco-home" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Eco Marketplace</h1>
              <p className="text-xs text-gray-600">PCR Materials</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-8">
            <Link
              to="/eco-home"
              className="text-gray-700 hover:text-green-600 font-medium transition"
            >
              Home
            </Link>
            <Link
              to="/eco-industries"
              className="text-gray-700 hover:text-green-600 font-medium transition"
            >
              Industries
            </Link>
            <Link
              to="/eco-materials"
              className="text-gray-700 hover:text-green-600 font-medium transition"
            >
              Materials
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
