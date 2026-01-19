import { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext.jsx';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = path => location.pathname === path;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-700 text-white flex items-center justify-between px-4 z-30">
        <h1 className="text-xl font-bold">Building Manager</h1>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 h-screen w-60 flex flex-col overflow-hidden rounded-r-2xl bg-gray-700 text-white z-30 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo/Brand - Hidden on mobile, shown on desktop */}
        <h1 className="mt-10 ml-10 text-3xl font-bold hidden lg:block">
          Building Manager
        </h1>

        {/* Mobile close button */}
        <button
          onClick={closeSidebar}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
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

        {/* Navigation */}
        <nav className="mt-16 lg:mt-20 space-y-3">
          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className={`relative flex cursor-pointer items-center space-x-2 rounded-md py-4 px-10 transition-all ${
              isActive('/dashboard')
                ? 'font-semibold text-white bg-slate-600'
                : 'text-gray-300 hover:bg-slate-600'
            }`}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </span>
            <span>Dashboard</span>
            {isActive('/dashboard') && (
              <svg
                className="absolute -top-1/2 -right-1 h-32 w-8 text-gray-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="399.349 57.696 100.163 402.081"
                width="1em"
                height="4em"
              >
                <path
                  fill="currentColor"
                  d="M 499.289 57.696 C 499.289 171.989 399.349 196.304 399.349 257.333 C 399.349 322.485 499.512 354.485 499.512 458.767 C 499.512 483.155 499.289 57.696 499.289 57.696 Z"
                />
              </svg>
            )}
          </Link>

          <Link
            to="/tenants"
            onClick={closeSidebar}
            className={`relative flex cursor-pointer items-center space-x-2 rounded-md py-4 px-10 transition-all ${
              isActive('/tenants')
                ? 'font-semibold text-white bg-slate-600'
                : 'text-gray-300 hover:bg-slate-600'
            }`}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </span>
            <span>Tenants</span>
            {isActive('/tenants') && (
              <svg
                className="absolute -top-1/2 -right-1 h-32 w-8 text-gray-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="399.349 57.696 100.163 402.081"
                width="1em"
                height="4em"
              >
                <path
                  fill="currentColor"
                  d="M 499.289 57.696 C 499.289 171.989 399.349 196.304 399.349 257.333 C 399.349 322.485 499.512 354.485 499.512 458.767 C 499.512 483.155 499.289 57.696 499.289 57.696 Z"
                />
              </svg>
            )}
          </Link>

          <Link
            to="/collections"
            onClick={closeSidebar}
            className={`relative flex cursor-pointer items-center space-x-2 rounded-md py-4 px-10 transition-all ${
              isActive('/collections')
                ? 'font-semibold text-white bg-slate-600'
                : 'text-gray-300 hover:bg-slate-600'
            }`}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </span>
            <span>Collections</span>
            {isActive('/collections') && (
              <svg
                className="absolute -top-1/2 -right-1 h-32 w-8 text-gray-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="399.349 57.696 100.163 402.081"
                width="1em"
                height="4em"
              >
                <path
                  fill="currentColor"
                  d="M 499.289 57.696 C 499.289 171.989 399.349 196.304 399.349 257.333 C 399.349 322.485 499.512 354.485 499.512 458.767 C 499.512 483.155 499.289 57.696 499.289 57.696 Z"
                />
              </svg>
            )}
          </Link>

          <Link
            to="/add-collection"
            onClick={closeSidebar}
            className={`relative flex cursor-pointer items-center space-x-2 rounded-md py-4 px-10 transition-all ${
              isActive('/add-collection')
                ? 'font-semibold text-white bg-slate-600'
                : 'text-gray-300 hover:bg-slate-600'
            }`}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </span>
            <span>Add Collection</span>
            {isActive('/add-collection') && (
              <svg
                className="absolute -top-1/2 -right-1 h-32 w-8 text-gray-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="399.349 57.696 100.163 402.081"
                width="1em"
                height="4em"
              >
                <path
                  fill="currentColor"
                  d="M 499.289 57.696 C 499.289 171.989 399.349 196.304 399.349 257.333 C 399.349 322.485 499.512 354.485 499.512 458.767 C 499.512 483.155 499.289 57.696 499.289 57.696 Z"
                />
              </svg>
            )}
          </Link>
        </nav>

        {/* User Profile at Bottom */}
        <div className="my-6 mt-auto mx-4 p-3 bg-slate-600 rounded-xl flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name || 'Admin'}
            </p>
            <p className="text-xs text-gray-300 truncate">
              {user?.email || 'admin@example.com'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors group"
            title="Logout"
          >
            <svg
              className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-60 min-h-screen bg-gray-50 pt-16 lg:pt-0">
        <div className="px-4 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
