
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin-app/AdminLayout';
import AdminOverview from '@/components/admin-app/pages/AdminOverview';
import AdminUsers from '@/components/admin-app/pages/AdminUsers';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard/overview" replace />} />
        <Route path="/overview" element={<AdminOverview />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/sellers" element={<div className="p-4">Sellers management coming soon</div>} />
        <Route path="/products" element={<div className="p-4">Products management coming soon</div>} />
        <Route path="/orders" element={<div className="p-4">Orders management coming soon</div>} />
        <Route path="/reports" element={<div className="p-4">Reports coming soon</div>} />
        <Route path="/content" element={<div className="p-4">Content management coming soon</div>} />
        <Route path="/analytics" element={<div className="p-4">Analytics coming soon</div>} />
        <Route path="/payments" element={<div className="p-4">Payments management coming soon</div>} />
        <Route path="/categories" element={<div className="p-4">Categories management coming soon</div>} />
        <Route path="/security" element={<div className="p-4">Security center coming soon</div>} />
        <Route path="/communications" element={<div className="p-4">Communications coming soon</div>} />
        <Route path="/logs" element={<div className="p-4">System logs coming soon</div>} />
        <Route path="/support" element={<div className="p-4">Support management coming soon</div>} />
        <Route path="/settings" element={<div className="p-4">Settings coming soon</div>} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
