import React from 'react';
import { Link } from 'react-router-dom';

export default function EcoFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Eco Marketplace</h3>
                <p className="text-xs text-gray-400">PCR Materials</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Connecting industries with sustainable Post-Consumer Recycled materials for a circular economy.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/eco-home" className="hover:text-green-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/eco-industries" className="hover:text-green-400 transition">
                  Industries
                </Link>
              </li>
              <li>
                <Link to="/eco-materials" className="hover:text-green-400 transition">
                  Browse Materials
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-green-400 transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="hover:text-green-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Quality Standards
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@ecomarketplace.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91-XXXXXXXXXX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Eco Marketplace. All rights reserved.</p>
          <p className="mt-2 text-gray-500">
            Sustainable Materials for a Greener Tomorrow
          </p>
        </div>
      </div>
    </footer>
  );
}
