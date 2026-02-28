import React from 'react';
import { FaTimes, FaMapMarkerAlt, FaCreditCard, FaTruck } from 'react-icons/fa';

const OrderDetailsModal = ({ order, onClose, formatDate, getStatusColor, getStatusIcon }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4">
          
          {/* Order Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Order Status</span>
              <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${getStatusColor(order.orderStatus)}`}>
                {getStatusIcon(order.orderStatus)}
                {order.orderStatus}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono font-semibold">{order._id}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-500">Order Date</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-2">Items</h3>
            <div className="bg-gray-50 rounded-lg divide-y">
              {order.orderItems.map((item, index) => (
                <div key={index} className="p-3 flex gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                    {item.pieces && (
                      <p className="text-xs text-gray-400">{item.pieces}</p>
                    )}
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              Delivery Address
            </h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm">{order.shippingAddress.address}</p>
              {order.shippingAddress.landmark && (
                <p className="text-sm text-gray-600">Landmark: {order.shippingAddress.landmark}</p>
              )}
              <p className="text-sm text-gray-600">
                {order.shippingAddress.city} - {order.shippingAddress.pincode}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FaCreditCard className="text-blue-500" />
              Payment Details
            </h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Items Total</span>
                <span>₹{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Delivery Charge</span>
                <span>{order.deliveryPrice === 0 ? 'FREE' : `₹${order.deliveryPrice}`}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Paid</span>
                  <span className="text-red-500">₹{order.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Timeline (if available) */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <FaTruck className="text-green-500" />
                Timeline
              </h3>
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                {order.statusHistory.map((status, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <span className={`w-2 h-2 mt-1.5 rounded-full ${getStatusColor(status.status).split(' ')[0]}`} />
                    <div className="flex-1">
                      <p className="font-medium capitalize">{status.status}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(status.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;