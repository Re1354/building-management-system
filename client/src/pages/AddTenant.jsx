// This component is deprecated - tenant management is now handled in Tenants.jsx
// Keeping for backward compatibility only
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddTenant = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/tenants');
  }, [navigate]);

  return null;
};

export default AddTenant;
