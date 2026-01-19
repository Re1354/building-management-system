import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [formData, setFormData] = useState({
    floor: '',
    flat: '',
    tenantName: '',
    phone: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await api.get('/tenants');
      setTenants(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tenants');
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingTenant) {
        await api.put(`/tenants/${editingTenant._id}`, formData);
      } else {
        await api.post('/tenants', formData);
      }
      setShowModal(false);
      setEditingTenant(null);
      setFormData({ floor: '', flat: '', tenantName: '', phone: '' });
      fetchTenants();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = tenant => {
    setEditingTenant(tenant);
    setFormData({
      floor: tenant.floor,
      flat: tenant.flat,
      tenantName: tenant.tenantName,
      phone: tenant.phone || '',
    });
    setShowModal(true);
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      try {
        await api.delete(`/tenants/${id}`);
        fetchTenants();
      } catch (err) {
        setError('Failed to delete tenant');
      }
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
            Tenants
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your building tenants
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTenant(null);
            setFormData({ floor: '', flat: '', tenantName: '', phone: '' });
            setShowModal(true);
          }}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition font-medium flex items-center justify-center w-full sm:w-auto"
        >
          <span className="mr-2">+</span>
          Add Tenant
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {tenants.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">
            No tenants found. Add your first tenant!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">
                    Floor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">
                    Flat
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">
                    Tenant Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-blue-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant, index) => (
                  <tr
                    key={tenant._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {tenant.floor}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {tenant.flat}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {tenant.tenantName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {tenant.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => handleEdit(tenant)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors mr-2"
                        title="Edit"
                      >
                        <svg
                          className="w-4 h-4 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(tenant._id)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                        title="Delete"
                      >
                        <svg
                          className="w-4 h-4 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-blue-700 mb-1.5">
                  Floor <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-blue-700 mb-1.5">
                  Flat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="flat"
                  value={formData.flat}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., A, B, 101"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-blue-700 mb-1.5">
                  Tenant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tenantName"
                  value={formData.tenantName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-blue-700 mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  {editingTenant ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTenant(null);
                  }}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenants;
