import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { industryAPI } from '../api/industryAPI';
import { materialAPI } from '../api/materialAPI';

export default function EcoHomePage() {
  const [industries, setIndustries] = useState([]);
  const [featuredMaterials, setFeaturedMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [industriesRes, materialsRes] = await Promise.all([
        industryAPI.getAll(),
        materialAPI.getAll({ featured: true, limit: 6 })
      ]);

      if (industriesRes.success) {
        setIndustries(industriesRes.industries);
      }

      if (materialsRes.success) {
        setFeaturedMaterials(materialsRes.materials);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Eco Marketplace for PCR Materials
            </h1>
            <p className="text-xl mb-8 text-green-100">
              Connecting Industries with Sustainable Post-Consumer Recycled Materials
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/eco-industries"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                Browse Industries
              </Link>
              <Link
                to="/eco-materials"
                className="bg-green-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition"
              >
                View All Materials
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Industries We Serve
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <Link
                key={industry._id}
                to={`/eco-materials?industry=${industry.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border-2 border-gray-100 hover:border-green-500"
              >
                <div className="flex items-center mb-4">
                  {industry.icon && (
                    <img
                      src={industry.icon}
                      alt={industry.name}
                      className="w-12 h-12 object-contain mr-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-gray-800">
                    {industry.name}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">{industry.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold">
                    {industry.materialCount} Materials Available
                  </span>
                  <span className="text-green-600">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featuredMaterials.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Featured Materials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMaterials.map((material) => (
                <Link
                  key={material._id}
                  to={`/eco-materials/${material._id}`}
                  className="bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  {material.images && material.images[0] && (
                    <img
                      src={material.images[0]}
                      alt={material.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="text-sm text-green-600 font-semibold mb-2">
                      {material.materialCode}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {material.name}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-gray-600">
                        Available: {material.availableQuantity} {material.unit}
                      </span>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">
                        Request Quote
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Eco Marketplace?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                All PCR materials are certified and tested for quality compliance
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Sustainable Sourcing</h3>
              <p className="text-gray-600">
                Supporting circular economy through responsible recycling
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Response</h3>
              <p className="text-gray-600">
                Expert team responds to requests within 24-48 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Source Sustainable Materials?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Browse our catalog and submit a request. No registration required.
          </p>
          <Link
            to="/eco-industries"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
