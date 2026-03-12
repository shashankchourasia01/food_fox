import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FaShoppingBag, 
  FaClock, 
  FaCheckCircle, 
  FaTruck,
  FaSpinner,
  FaEye,
  FaArrowLeft,
  FaFilter
} from 'react-icons/fa';
import { getMyOrders } from '../services/api';
import OrderDetailsModal from '../components/orders/OrderDetailsModal';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  useEffect(() => {
    // Filter orders based on status
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.orderStatus === statusFilter));
    }
  }, [statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getMyOrders();
      setOrders(response.data.data);
      setFilteredOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'confirmed': return <FaCheckCircle className="text-blue-500" />;
      case 'preparing': return <FaSpinner className="text-purple-500" />;
      case 'out-for-delivery': return <FaTruck className="text-orange-500" />;
      case 'delivered': return <FaCheckCircle className="text-green-500" />;
      case 'cancelled': return <FaCheckCircle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'preparing': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'out-for-delivery': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-full transition"
          >
            <FaArrowLeft className="text-gray-600 text-lg" />
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaShoppingBag className="text-red-500" />
            My Orders
          </h1>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <FaFilter className="text-gray-400 shrink-0" />
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition
                  ${statusFilter === option.value
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaShoppingBag className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Orders Found</h3>
            <p className="text-sm text-gray-500 mb-6">
              {statusFilter === 'all' 
                ? "You haven't placed any orders yet."
                : `No ${statusFilter} orders found.`}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            {/* Mobile View - Cards (visible on mobile) */}
            <div className="block sm:hidden space-y-3">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
                  className="bg-white rounded-lg shadow p-4 active:bg-gray-50 transition cursor-pointer"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="text-sm font-mono font-semibold">
                        #{order._id.slice(-8)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Order Info */}
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-lg font-bold text-red-500">₹{order.totalPrice}</p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                    {order.orderItems.slice(0, 3).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                    ))}
                    {order.orderItems.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{order.orderItems.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View - Table (visible on sm and above) */}
            <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Items</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono">
                          #{order._id.slice(-8)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {order.orderItems.length} item(s)
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold">
                          ₹{order.totalPrice}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${getStatusColor(order.orderStatus)}`}>
                            {getStatusIcon(order.orderStatus)}
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowModal(true);
                            }}
                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition"
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowModal(false)}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
        />
      )}
    </div>
  );
};

export default MyOrdersPage;