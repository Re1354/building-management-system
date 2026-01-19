import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await api.get('/collections');
      setCollections(res.data);
    } catch (err) {
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCollections = collections.filter(c => {
    const matchesSearch =
      c.tenantId?.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.collectedBy?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalAmount = filteredCollections.reduce((sum, c) => sum + c.amount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Collections
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            All rent collection records
          </p>
        </div>
        <Link
          to="/add-collection"
          className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition font-medium flex items-center justify-center w-full sm:w-auto"
        >
          <span className="mr-2">+</span>
          Add Collection
        </Link>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-green-500/90 to-green-600/80 rounded-xl shadow-lg p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-white text-opacity-90">
              Total Collections
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2 truncate">
              {totalAmount} <span className="text-lg sm:text-xl">BDT</span>
            </p>
            <p className="text-xs sm:text-sm text-white text-opacity-80 mt-1">
              {filteredCollections.length} transactions
            </p>
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by tenant or collector name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {filteredCollections.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No collections found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">
                      Tenant
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">
                      Collected By
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">
                      Month/Year
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCollections.map(c => (
                    <tr
                      key={c._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {c.tenantId?.tenantName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        Floor {c.tenantId?.floor}, Flat {c.tenantId?.flat}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.collectedBy?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        {c.amount} BDT
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(c.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.month}/{c.year}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.note || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredCollections.map(c => (
              <div
                key={c._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {c.tenantId?.tenantName || 'N/A'}
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Floor {c.tenantId?.floor}, Flat {c.tenantId?.flat}
                    </p>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <p className="text-base font-bold text-green-600">
                      {c.amount} BDT
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-500 font-medium">Collected By</p>
                    <p className="text-gray-900 mt-0.5 truncate">
                      {c.collectedBy?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Date</p>
                    <p className="text-gray-900 mt-0.5">
                      {new Date(c.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Month/Year</p>
                    <p className="text-gray-900 mt-0.5">
                      {c.month}/{c.year}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Note</p>
                    <p className="text-gray-900 mt-0.5 truncate">
                      {c.note || '-'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Collections;
