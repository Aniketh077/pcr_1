import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { materialAPI } from '../api/materialAPI';
import { industryAPI } from '../api/industryAPI';

export default function MaterialsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [materials, setMaterials] = useState([]);
  const [filters, setFilters] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const industrySlug = searchParams.get('industry');
  const page = searchParams.get('page') || 1;

  useEffect(() => {
    loadIndustries();
  }, []);

  useEffect(() => {
    loadMaterials();
    if (industrySlug) {
      loadFilters();
    }
  }, [industrySlug, page, selectedFilters]);

  const loadIndustries = async () => {
    try {
      const res = await industryAPI.getAll();
      if (res.success) {
        setIndustries(res.industries);
      }
    } catch (error) {
      console.error('Error loading industries:', error);
    }
  };

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const params = {
        industry: industrySlug,
        page,
        filters: JSON.stringify(selectedFilters)
      };

      const res = await materialAPI.getAll(params);
      if (res.success) {
        setMaterials(res.materials);
        setPagination(res.pagination);
      }
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const res = await materialAPI.getFilters(industrySlug);
      if (res.success) {
        setFilters(res.filters);
      }
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
  };

  const renderFilter = (filter) => {
    switch (filter.type) {
      case 'select':
      case 'multiselect':
        return (
          <div key={filter.key} className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">{filter.label}</h4>
            <div className="space-y-2">
              {filter.options.map(option => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters[filter.key]?.includes(option)}
                    onChange={(e) => {
                      const current = selectedFilters[filter.key] || [];
                      const updated = e.target.checked
                        ? [...current, option]
                        : current.filter(v => v !== option);
                      handleFilterChange(filter.key, updated);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div key={filter.key} className="mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters[filter.key] || false}
                onChange={(e) => handleFilterChange(filter.key, e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{filter.label}</span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            PCR Materials Catalog
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                searchParams.delete('industry');
                setSearchParams(searchParams);
              }}
              className={`px-4 py-2 rounded-lg ${
                !industrySlug
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Industries
            </button>
            {industries.map(industry => (
              <button
                key={industry._id}
                onClick={() => {
                  searchParams.set('industry', industry.slug);
                  setSearchParams(searchParams);
                }}
                className={`px-4 py-2 rounded-lg ${
                  industrySlug === industry.slug
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {industry.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          {filters.length > 0 && (
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Clear All
                  </button>
                </div>
                {filters.map(renderFilter)}
              </div>
            </div>
          )}

          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600 text-lg">No materials found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {materials.map(material => (
                    <Link
                      key={material._id}
                      to={`/eco-materials/${material._id}`}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                    >
                      {material.images && material.images[0] && (
                        <img
                          src={material.images[0]}
                          alt={material.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <div className="text-xs text-green-600 font-semibold mb-2">
                          {material.materialCode}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {material.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {material.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Available: {material.availableQuantity} {material.unit}
                          </span>
                          <span className="text-green-600 font-semibold text-sm">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => {
                          searchParams.set('page', pageNum);
                          setSearchParams(searchParams);
                        }}
                        className={`px-4 py-2 rounded-lg ${
                          pagination.page === pageNum
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
