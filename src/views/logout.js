import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the token from localStorage on logout
    localStorage.removeItem('token');

    // Redirect the user to the login page after logging out
    navigate('/login');
  }, [navigate]);

  return null;  // No UI needed, just a redirect after logout
};

export default Logout;
