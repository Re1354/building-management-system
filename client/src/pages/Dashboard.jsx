import React, { useEffect, useState, useContext } from 'react';
import { FiUser } from 'react-icons/fi';
import api from '../utils/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext.jsx';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [summary, setSummary] = useState({
    overall: { total: 0 },
    byAdmin: [],
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [adminCollectionsRes, chartRes] = await Promise.all([
        api.get('/collections/admin-summary'),
        api.get('/collections/chart'),
      ]);

      const admins = adminCollectionsRes.data || [];
      const overallTotal = admins.reduce(
        (sum, admin) => sum + (admin.total || 0),
        0
      );

      setSummary({
        overall: { total: overallTotal },
        byAdmin: admins,
      });

      setChartData(chartRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // ✅ Find logged-in admin's collection
  const myAdmin = summary.byAdmin.find(
    a => String(a._id) === String(user?._id || user?.id)
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || 'Admin'}!
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Here's what's happening with your building today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Total Collection */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Collection
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summary.overall.total || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">BDT</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-indigo-600"
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

        {/* ✅ My Collection (ONLY if user has data) */}
        {myAdmin && myAdmin.total > 0 && (
          <div className="bg-white border border-green-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  My Collection
                </p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  ৳ {myAdmin.total || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {myAdmin.count || 0} transactions
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
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
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
          Monthly Collection Trend
        </h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height={250}
            className="sm:h-[300px]"
          >
            <BarChart data={chartData}>
              <XAxis
                dataKey="month"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
              />
              <Bar dataKey="total" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-500 text-center py-12">
            No collection data available
          </p>
        )}
      </div>

      {/* Admin Collections */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
          Admin Collections
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {summary.byAdmin && summary.byAdmin.length > 0 ? (
            summary.byAdmin.map(admin => {
              const isMe =
                user && String(admin._id) === String(user._id || user.id);

              return (
                <div
                  key={admin._id}
                  className={`bg-white transition-all duration-300 rounded-xl p-5 border cursor-pointer hover:-translate-y-1 relative ${
                    isMe
                      ? 'border-green-300 ring-2 ring-green-200'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <FiUser className="text-gray-700 text-xl" />
                    </div>
                    <h2
                      className={`text-lg font-semibold ${
                        isMe ? 'text-green-700' : 'text-gray-800'
                      }`}
                    >
                      {admin.name}
                    </h2>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mt-4">
                    ৳ {admin.total || 0}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{admin.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {admin.count || 0} collections
                  </p>

                  {isMe && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300 shadow">
                      You
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500">
                No admin collections found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
