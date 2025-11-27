import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buyerRequestAPI } from '../api/buyerRequestAPI';

export default function RequestConfirmationPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestId) {
      loadRequest();
    }
  }, [requestId]);

  const loadRequest = async () => {
    try {
      const res = await buyerRequestAPI.verify(requestId);
      if (res.success) {
        setRequest(res.request);
      }
    } catch (error) {
      console.error('Error loading request:', error);
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

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Not Found</h2>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 text-center">
            <div className="mb-4">
              <svg
                className="w-20 h-20 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Request Submitted Successfully!</h1>
            <p className="text-green-100 text-lg">
              Thank you for your interest in our PCR materials
            </p>
          </div>

          <div className="p-8">
            <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6">
              <p className="text-green-800 font-semibold">
                Your request has been received and our team will contact you within 24-48 hours.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Request Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="border-b pb-3">
                  <span className="text-sm text-gray-600">Request ID</span>
                  <p className="font-semibold text-gray-800">{request.requestId}</p>
                </div>
                <div className="border-b pb-3">
                  <span className="text-sm text-gray-600">Status</span>
                  <p className="font-semibold text-green-600">{request.status}</p>
                </div>
                <div className="border-b pb-3">
                  <span className="text-sm text-gray-600">Buyer Name</span>
                  <p className="font-semibold text-gray-800">{request.buyerName}</p>
                </div>
                <div className="border-b pb-3">
                  <span className="text-sm text-gray-600">Company</span>
                  <p className="font-semibold text-gray-800">{request.companyName}</p>
                </div>
                <div className="border-b pb-3">
                  <span className="text-sm text-gray-600">Material</span>
                  <p className="font-semibold text-gray-800">{request.material?.name}</p>
                </div>
                <div className="border-b pb-3">
                  <span className="text-sm text-gray-600">Industry</span>
                  <p className="font-semibold text-gray-800">{request.industry?.name}</p>
                </div>
                <div className="border-b pb-3">
                  <span className="text-sm text-gray-600">Quantity</span>
                  <p className="font-semibold text-gray-800">
                    {request.requestedQuantity} {request.requestedUnit}
                  </p>
                </div>
                <div className="border-b pb-3">
                  <span className="text-sm text-gray-600">Submitted On</span>
                  <p className="font-semibold text-gray-800">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-3">What happens next?</h3>
              <ol className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                    1
                  </span>
                  <span>You will receive a confirmation email with your request details</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                    2
                  </span>
                  <span>Our team will review material availability and your requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                    3
                  </span>
                  <span>We will contact you within 24-48 hours with pricing and delivery details</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                    4
                  </span>
                  <span>You will receive email updates as your request progresses</span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Please save your Request ID ({request.requestId}) for future reference.
                You can use this to track your request status.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/eco-materials')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Browse More Materials
              </button>
              <button
                onClick={() => navigate('/eco-home')}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">Need immediate assistance?</p>
          <p className="text-sm">
            Contact us at <a href="mailto:support@ecomarketplace.com" className="text-green-600 hover:text-green-700">support@ecomarketplace.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
