import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from 'components/PrivateRoute'; // Protect routes
import AdminLayout from 'layouts/Admin/Admin'; // Your Admin Layout
import Login from './views/Login';
import Logout from 'views/logout';
import { UserProvider } from 'contexts/UserContext'; // User context provider

import 'assets/scss/black-dashboard-react.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <UserProvider> {/* Wrap the entire app with UserProvider */}
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protect Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        />

        {/* Logout Route */}
        <Route path="/logout" element={<Logout />} />

        {/* Redirect any unmatched paths to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </UserProvider>
);
