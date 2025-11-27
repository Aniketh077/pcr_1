import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { materialAPI } from '../api/materialAPI';
import { buyerRequestAPI } from '../api/buyerRequestAPI';

export default function MaterialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [relatedMaterials, setRelatedMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerMobile: '',
    countryCode: '+91',
    companyName: '',
    requestedQuantity: '',
    specifications: ''
  });

  useEffect(() => {
    loadMaterial();
  }, [id]);

  const loadMaterial = async () => {
    try {
      setLoading(true);
      const res = await materialAPI.getById(id);
      if (res.success) {
        setMaterial(res.material);
        setRelatedMaterials(res.relatedMaterials || []);
      }
    } catch (error) {
      console.error('Error loading material:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!formData.buyerEmail && !formData.buyerMobile) {
      alert('Please provide either email or mobile number');
      return;
    }

    try {
      setSubmitting(true);
      const res = await buyerRequestAPI.create({
        ...formData,
        materialId: material._id,
        requestedQuantity: parseFloat(formData.requestedQuantity)
      });

      if (res.success) {
        navigate(`/request-confirmation/${res.requestId}`);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Material not found</h2>
          <button
            onClick={() => navigate('/eco-materials')}
            className="text-green-600 hover:text-green-700"
          >
            ← Back to Materials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-green-600 hover:text-green-700 mb-6 flex items-center"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            {material.images && material.images.length > 0 ? (
              <img
                src={material.images[0]}
                alt={material.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-sm text-green-600 font-semibold mb-2">
              {material.materialCode}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {material.name}
            </h1>
            <p className="text-gray-600 mb-6">{material.description}</p>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Available Quantity:</span>
                <span className="text-gray-800">
                  {material.availableQuantity} {material.unit}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Minimum Order:</span>
                <span className="text-gray-800">
                  {material.minimumOrderQuantity} {material.unit}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Industry:</span>
                <span className="text-gray-800">{material.industry?.name}</span>
              </div>
              {material.supplyRegion && (
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Supply Region:</span>
                  <span className="text-gray-800">{material.supplyRegion}</span>
                </div>
              )}
            </div>

            {material.certifications && material.certifications.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Certifications:</h3>
                <div className="flex flex-wrap gap-2">
                  {material.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {showRequestForm ? 'Hide Request Form' : 'Request Quote'}
            </button>
          </div>
        </div>

        {showRequestForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Request</h2>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.buyerName}
                    onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-gray-500 text-xs">(Email or Mobile required)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.buyerEmail}
                    onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number <span className="text-gray-500 text-xs">(Email or Mobile required)</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>
                    <input
                      type="tel"
                      value={formData.buyerMobile}
                      onChange={(e) => setFormData({ ...formData, buyerMobile: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity Required ({material.unit}) *
                </label>
                <input
                  type="number"
                  required
                  min={material.minimumOrderQuantity}
                  value={formData.requestedQuantity}
                  onChange={(e) => setFormData({ ...formData, requestedQuantity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={`Min: ${material.minimumOrderQuantity} ${material.unit}`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Specifications (Optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Any specific requirements or questions..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        )}

        {material.attributes && material.attributes.size > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from(material.attributes.entries()).map(([key, attr]) => (
                <div key={key} className="border-b pb-3">
                  <span className="font-semibold text-gray-700">{attr.label}:</span>
                  <span className="ml-2 text-gray-800">
                    {Array.isArray(attr.value) ? attr.value.join(', ') : attr.value}
                    {attr.unit && ` ${attr.unit}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {relatedMaterials.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Materials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedMaterials.map(mat => (
                <div
                  key={mat._id}
                  onClick={() => navigate(`/eco-materials/${mat._id}`)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
                >
                  {mat.images && mat.images[0] && (
                    <img
                      src={mat.images[0]}
                      alt={mat.name}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2">{mat.name}</h3>
                    <p className="text-sm text-gray-600">
                      Available: {mat.availableQuantity} {mat.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
