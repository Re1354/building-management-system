import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const AddCollection = () => {
  // Dynamic monthly collection state
  const [monthlyCollected, setMonthlyCollected] = useState(() => {
    // Try to get value from localStorage set by Dashboard
    const stored = window.localStorage.getItem('monthlyCollected');
    return stored ? Number(stored) : 0;
  });
  const [monthlyTarget, setMonthlyTarget] = useState(50000); // Example target, adjust as needed
  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTenants();
    fetchMonthlyCollection();
    // Also update from localStorage if available
    const stored = window.localStorage.getItem('monthlyCollected');
    if (stored) setMonthlyCollected(Number(stored));
  }, []);

  // Fetch monthly collection data
  const fetchMonthlyCollection = async () => {
    try {
      // Example API endpoint, adjust as needed
      const res = await api.get('/collections/monthly-summary');
      setMonthlyCollected(res.data.collected || 0);
      if (res.data.target) setMonthlyTarget(res.data.target);
    } catch (err) {
      // fallback: keep default values
    }
  };

  const fetchTenants = async () => {
    try {
      const res = await api.get('/tenants');
      setTenants(res.data);
    } catch (err) {
      setError('Failed to fetch tenants');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/collections', { tenantId, amount, date, note });
      setSuccess('Collection added successfully!');
      setTimeout(() => {
        navigate('/collections');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side: Add Collection Form (2/3 width) */}
        <div className="md:w-2/3 w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6 md:mb-0">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Add Collection
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Record a new rent payment transaction
            </p>
          </div>
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-red-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tenant Select */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Tenant
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={tenantId}
                  onChange={e => setTenantId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Choose a tenant --</option>
                  {tenants.map(t => (
                    <option key={t._id} value={t._id}>
                      {t.tenantName} (Floor {t.floor}, Flat {t.flat})
                    </option>
                  ))}
                </select>
                {tenants.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    No tenants found.{' '}
                    <Link
                      to="/tenants"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Add a tenant first
                    </Link>
                  </p>
                )}
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Amount
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ৳
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Date
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Note Textarea */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Note (Optional)
                </label>
                <textarea
                  placeholder="Add any additional notes..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="sm:w-40 w-full bg-gray-900 text-white py-2.5 px-6 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Add Collection'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/collections')}
                className="sm:w-40 w-full px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        {/* Right Side: Total Tenants Card (1/3 width) */}
        <div className="md:w-1/3 w-full flex-shrink-0 flex flex-col gap-6">
          {/* Monthly Bill Collection Card - Subtle, Compact, Consistent */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-5 flex flex-col gap-2 items-start justify-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-blue-100 rounded-lg p-2 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12a9 9 0 0118 0c0 4.97-4.03 9-9 9s-9-4.03-9-9z"
                  />
                </svg>
              </div>
              <span className="text-base font-semibold text-blue-800">
                Monthly Bill Collection
              </span>
            </div>
            <div className="text-sm text-blue-700">This Month</div>
            <div className="text-2xl font-bold text-blue-600">
              ৳ {monthlyCollected.toLocaleString()}
            </div>
            <div className="w-full mt-2">
              <div className="flex justify-between text-xs text-blue-600 mb-1">
                <span>Total Collection</span>
                <span>Target</span>
              </div>
              <div className="w-full bg-blue-50 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      monthlyTarget
                        ? Math.min(
                            100,
                            Math.round((monthlyCollected / monthlyTarget) * 100)
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-blue-700 mt-1">
                <span><strong>Total Collection:</strong> ৳ {monthlyCollected.toLocaleString()}</span>
                <span><strong>Target:</strong> ৳ {monthlyTarget.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-xs text-blue-400 mt-2">
              Track monthly rent collection progress.
            </p>
          </div>
          {/* Total Tenants Card - Subtle, Compact, Consistent */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2 items-start justify-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-blue-50 rounded-lg p-2">
                {/* Only users group icon */}
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 20h10v-2a4 4 0 00-4-4H11a4 4 0 00-4 4v2zm6-10a4 4 0 11-8 0 4 4 0 018 0zm5 4a2 2 0 11-4 0 2 2 0 014 0zm-2 6v-2a2 2 0 012-2h2a2 2 0 012 2v2"
                  />
                </svg>
              </div>
              <span className="text-base font-semibold text-blue-800">
                Total Tenants
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {Array.isArray(tenants) ? tenants.length : 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Currently registered tenants in the system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCollection;
