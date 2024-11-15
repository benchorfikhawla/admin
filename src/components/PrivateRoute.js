// In a file like `PrivateRoute.js`
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from 'contexts/UserContext';

const PrivateRoute = ({ children }) => {
  const { userEmail } = useUser(); // Get userEmail from context
   
  if (!userEmail) {
    // If userEmail is not set, redirect to the login page
    return <Navigate to="/login" replace />;
  }
   

  return children; // If authenticated, render the children (AdminLayout)
};
/* const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check for token in local storage

  return token ? children : <Navigate to="/login" />; // Redirect to login if not authenticated
}; */


export default PrivateRoute;
