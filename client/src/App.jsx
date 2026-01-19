import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddTenant from './pages/AddTenant';
import AddCollection from './pages/AddCollection';
import Collections from './pages/Collections';
import Tenants from './pages/Tenants';
import Layout from './components/Layout';
import { AuthContext } from './context/authContext.jsx';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" />}
      />

      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tenants" element={<Tenants />} />
        <Route path="add-tenant" element={<AddTenant />} />
        <Route path="collections" element={<Collections />} />
        <Route path="add-collection" element={<AddCollection />} />
      </Route>
    </Routes>
  );
};

export default App;
