import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store';
import Navbar from './components/Navbar';
import AccountSidebar from './components/AccountSidebar';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import CartPage from './pages/CartPage';
import LocationPage from './pages/LocationPage';
import FeedbackPage from './pages/FeedbackPage';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

// Admin imports
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import Sidebar from './components/admin/Sidebar';
import Header from './components/admin/Header';
import MyOrdersPage from './pages/MyOrdersPage';

import { LOGIN_SUCCESS } from './redux/constants/authConstants';

// Admin Layout Component (defined outside App)
const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setIsOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

// Main App Component
const AppContent = () => {
  const dispatch = useDispatch();

  // Sync localStorage to Redux on app load
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token) {
      console.log('🔥 Syncing localStorage to Redux');
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          user: JSON.parse(user),
          token: token
        }
      });
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Navbar />
      <AccountSidebar />
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          } />
          <Route path="/admin/products" element={
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          } />
          <Route path="/admin/orders" element={
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          } />
          <Route path="/admin/users" element={
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// Root App Component with Provider
function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;