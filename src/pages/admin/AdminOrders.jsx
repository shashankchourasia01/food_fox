import React, { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaTruck, FaTimes } from 'react-icons/fa';
import adminService from '../../services/adminService';
import OrderDetailsModal from '../../components/orders/OrderDetailsModal'; // 👈 Import modal

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminService.getAllOrders();
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'confirmed': return 'bg-blue-100 text-blue-600';
      case 'preparing': return 'bg-purple-100 text-purple-600';
      case 'out-for-delivery': return 'bg-orange-100 text-orange-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Items</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">
                    {order._id.slice(-8)}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{order.user?.name}</p>
                      <p className="text-xs text-gray-500">{order.user?.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {order.orderItems?.length} items
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold">
                    ₹{order.totalPrice}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`px-2 py-1 text-xs rounded-full border-0 ${getStatusColor(order.orderStatus)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetails(true);
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

      {/* ✅ Use OrderDetailsModal component */}
      {showDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowDetails(false)}
          formatDate={(date) => new Date(date).toLocaleString()}
          getStatusColor={getStatusColor}
          getStatusIcon={(status) => {
            switch(status) {
              case 'delivered': return <FaCheck className="text-green-500" />;
              case 'pending': return <FaTruck className="text-yellow-500" />;
              case 'confirmed': return <FaCheck className="text-blue-500" />;
              case 'out-for-delivery': return <FaTruck className="text-orange-500" />;
              case 'cancelled': return <FaTimes className="text-red-500" />;
              default: return <FaTruck className="text-gray-500" />;
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminOrders;










// import React, { useState, useEffect } from 'react';
// import { FaEye, FaCheck, FaTruck, FaTimes } from 'react-icons/fa';
// import adminService from '../../services/adminService';

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const response = await adminService.getAllOrders();
//       setOrders(response.data.data);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (orderId, newStatus) => {
//     try {
//       await adminService.updateOrderStatus(orderId, newStatus);
//       fetchOrders();
//       if (selectedOrder?._id === orderId) {
//         setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'delivered': return 'bg-green-100 text-green-600';
//       case 'pending': return 'bg-yellow-100 text-yellow-600';
//       case 'confirmed': return 'bg-blue-100 text-blue-600';
//       case 'preparing': return 'bg-purple-100 text-purple-600';
//       case 'out-for-delivery': return 'bg-orange-100 text-orange-600';
//       case 'cancelled': return 'bg-red-100 text-red-600';
//       default: return 'bg-gray-100 text-gray-600';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 sm:p-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

//       {/* Orders Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Items</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order._id} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-3 text-sm font-mono">
//                     {order._id.slice(-8)}
//                   </td>
//                   <td className="px-4 py-3">
//                     <div>
//                       <p className="text-sm font-medium">{order.user?.name}</p>
//                       <p className="text-xs text-gray-500">{order.user?.phone}</p>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-sm">
//                     {order.orderItems?.length} items
//                   </td>
//                   <td className="px-4 py-3 text-sm font-semibold">
//                     ₹{order.totalPrice}
//                   </td>
//                   <td className="px-4 py-3">
//                     <select
//                       value={order.orderStatus}
//                       onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
//                       className={`px-2 py-1 text-xs rounded-full border-0 ${getStatusColor(order.orderStatus)}`}
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="confirmed">Confirmed</option>
//                       <option value="preparing">Preparing</option>
//                       <option value="out-for-delivery">Out for Delivery</option>
//                       <option value="delivered">Delivered</option>
//                       <option value="cancelled">Cancelled</option>
//                     </select>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-600">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-3">
//                     <button
//                       onClick={() => {
//                         setSelectedOrder(order);
//                         setShowDetails(true);
//                       }}
//                       className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition"
//                     >
//                       <FaEye />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Order Details Modal */}
//       {showDetails && selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
//               <h2 className="text-lg font-semibold">Order Details</h2>
//               <button
//                 onClick={() => setShowDetails(false)}
//                 className="p-2 hover:bg-gray-100 rounded-full"
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-4">
//               {/* Order Info */}
//               <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <p className="text-gray-500">Order ID</p>
//                     <p className="font-semibold">{selectedOrder._id}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">Date</p>
//                     <p className="font-semibold">
//                       {new Date(selectedOrder.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">Status</p>
//                     <span className={`px-2 py-1 text-xs rounded-full inline-block ${getStatusColor(selectedOrder.orderStatus)}`}>
//                       {selectedOrder.orderStatus}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">Payment</p>
//                     <p className="font-semibold">{selectedOrder.paymentMethod}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Customer Info */}
//               <div className="mb-4">
//                 <h3 className="font-semibold mb-2">Customer Details</h3>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p><span className="text-gray-500">Name:</span> {selectedOrder.user?.name}</p>
//                   <p><span className="text-gray-500">Phone:</span> {selectedOrder.user?.phone}</p>
//                   <p><span className="text-gray-500">Email:</span> {selectedOrder.user?.email || 'N/A'}</p>
//                 </div>
//               </div>

//               {/* Shipping Address */}
//               <div className="mb-4">
//                 <h3 className="font-semibold mb-2">Delivery Address</h3>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p>{selectedOrder.shippingAddress.address}</p>
//                   {selectedOrder.shippingAddress.landmark && (
//                     <p className="text-sm text-gray-600">Landmark: {selectedOrder.shippingAddress.landmark}</p>
//                   )}
//                   <p className="text-sm text-gray-600">
//                     {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.pincode}
//                   </p>
//                 </div>
//               </div>

//               {/* Order Items */}
//               <div className="mb-4">
//                 <h3 className="font-semibold mb-2">Order Items</h3>
//                 <div className="bg-gray-50 rounded-lg divide-y">
//                   {selectedOrder.orderItems.map((item, index) => (
//                     <div key={index} className="p-3 flex gap-3">
//                       <img 
//                         src={item.image} 
//                         alt={item.name}
//                         className="w-12 h-12 object-cover rounded"
//                       />
//                       <div className="flex-1">
//                         <p className="font-medium">{item.name}</p>
//                         <p className="text-sm text-gray-500">
//                           Qty: {item.quantity} × ₹{item.price}
//                         </p>
//                       </div>
//                       <p className="font-semibold">₹{item.price * item.quantity}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Order Summary */}
//               <div className="border-t pt-4">
//                 <div className="flex justify-between mb-2">
//                   <span>Subtotal</span>
//                   <span>₹{selectedOrder.itemsPrice}</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span>Delivery</span>
//                   <span>{selectedOrder.deliveryPrice === 0 ? 'FREE' : `₹${selectedOrder.deliveryPrice}`}</span>
//                 </div>
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>Total</span>
//                   <span>₹{selectedOrder.totalPrice}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminOrders;