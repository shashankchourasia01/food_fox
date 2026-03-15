//for new location code 
import React from 'react';
import { FaTimes, FaMapMarkerAlt, FaCreditCard, FaTruck } from 'react-icons/fa';

const OrderDetailsModal = ({ order, onClose, formatDate, getStatusColor, getStatusIcon }) => {
  
  // ✅ Google Maps link generate karne ka function
  const getMapsLink = () => {
    console.log('📍 Order shippingAddress:', order?.shippingAddress);
    console.log('📍 Lat exists:', !!order?.shippingAddress?.lat);
    console.log('📍 Lng exists:', !!order?.shippingAddress?.lng);
    
    if (order?.shippingAddress?.lat && order?.shippingAddress?.lng) {
      const link = `https://www.google.com/maps/dir/?api=1&destination=${order.shippingAddress.lat},${order.shippingAddress.lng}`;
      console.log('✅ Maps link generated:', link);
      return link;
    }
    console.log('❌ No lat/lng found');
    return null;
  };

  // ✅ Static Map Image (Optional - Google Maps Static API)
  const getStaticMapUrl = () => {
    if (order?.shippingAddress?.lat && order?.shippingAddress?.lng) {
      // Yeh Google Maps Static API use karta hai - iske liye API key chahiye
      // const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
      // return `https://maps.googleapis.com/maps/api/staticmap?center=${order.shippingAddress.lat},${order.shippingAddress.lng}&zoom=15&size=600x200&maptype=roadmap&markers=color:red%7C${order.shippingAddress.lat},${order.shippingAddress.lng}&key=${apiKey}`;
      
      // Simple alternative - OpenStreetMap static image (free, no API key needed)
      return `https://staticmap.openstreetmap.de/staticmap.php?center=${order.shippingAddress.lat},${order.shippingAddress.lng}&zoom=15&size=600x200&maptype=roadmap&markers=${order.shippingAddress.lat},${order.shippingAddress.lng},red`;
    }
    return null;
  };

  const mapsLink = getMapsLink();
  const staticMapUrl = getStaticMapUrl();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
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
              <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${getStatusColor(order?.orderStatus)}`}>
                {getStatusIcon(order?.orderStatus)}
                {order?.orderStatus}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono font-semibold">{order?._id}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-500">Order Date</span>
              <span>{formatDate(order?.createdAt)}</span>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-2">Items</h3>
            <div className="bg-gray-50 rounded-lg divide-y">
              {order?.orderItems?.map((item, index) => (
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
              <p className="text-sm font-medium">{order?.shippingAddress?.fullName}</p>
              <p className="text-sm">{order?.shippingAddress?.address}</p>
              {order?.shippingAddress?.landmark && (
                <p className="text-sm text-gray-600">Landmark: {order.shippingAddress.landmark}</p>
              )}
              <p className="text-sm text-gray-600">
                {order?.shippingAddress?.city} - {order?.shippingAddress?.pincode}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Phone: {order?.shippingAddress?.phone}
              </p>
              
              {/* 👇 YEH CHANGES KIYE HAIN - Map Section */}
              
              {/* Option 1: Static Map Image (Free) */}
              {staticMapUrl && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">📍 Delivery Location</p>
                  <img 
                    src={staticMapUrl}
                    alt="Delivery location map"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      e.target.style.display = 'none'; // Image load na ho to hide kar do
                    }}
                  />
                </div>
              )}
              
              {/* Option 2: Google Maps Link Button */}
              {mapsLink && (
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    <FaMapMarkerAlt />
                    Navigate via Google Maps
                  </a>
                  
                  {/* Alternative: Open in Maps app */}
                  {order?.shippingAddress?.lat && order?.shippingAddress?.lng && (
                    <a
                      href={`geo:${order.shippingAddress.lat},${order.shippingAddress.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                      <FaMapMarkerAlt />
                      Open in Maps App
                    </a>
                  )}
                </div>
              )}
              
              {/* No location message */}
              {!mapsLink && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700 flex items-center gap-1">
                    <span>⚠️</span>
                    Location coordinates not available for this order
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Address: {order?.shippingAddress?.address}, {order?.shippingAddress?.city}
                  </p>
                </div>
              )}
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
                <span className="font-medium">{order?.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Items Total</span>
                <span>₹{order?.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Delivery Charge</span>
                <span>{order?.deliveryPrice === 0 ? 'FREE' : `₹${order?.deliveryPrice}`}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Paid</span>
                  <span className="text-red-500">₹{order?.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Timeline */}
          {order?.statusHistory && order.statusHistory.length > 0 && (
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












// //for new location code m
// import React from 'react';
// import { FaTimes, FaMapMarkerAlt, FaCreditCard, FaTruck } from 'react-icons/fa';

// const OrderDetailsModal = ({ order, onClose, formatDate, getStatusColor, getStatusIcon }) => {
  
//   // ✅ Google Maps link generate karne ka function
//   // const getMapsLink = () => {
//   //   if (order.shippingAddress?.lat && order.shippingAddress?.lng) {
//   //     return `https://www.google.com/maps/dir/?api=1&destination=${order.shippingAddress.lat},${order.shippingAddress.lng}`;
//   //   }
//   //   return null;
//   // };

//   // getMapsLink function में
// const getMapsLink = () => {
//   console.log('📍 Order shippingAddress:', order.shippingAddress);
//   console.log('📍 Lat exists:', !!order.shippingAddress?.lat);
//   console.log('📍 Lng exists:', !!order.shippingAddress?.lng);
  
//   if (order.shippingAddress?.lat && order.shippingAddress?.lng) {
//     const link = `https://www.google.com/maps/dir/?api=1&destination=${order.shippingAddress.lat},${order.shippingAddress.lng}`;
//     console.log('✅ Maps link generated:', link);
//     return link;
//   }
//   console.log('❌ No lat/lng found');
//   return null;
// };

//   const mapsLink = getMapsLink();

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
//         {/* Modal Header */}
//         <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
//           <h2 className="text-lg font-semibold">Order Details</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full"
//           >
//             <FaTimes />
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="p-4 space-y-4">
          
//           {/* Order Status */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-sm text-gray-500">Order Status</span>
//               <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${getStatusColor(order.orderStatus)}`}>
//                 {getStatusIcon(order.orderStatus)}
//                 {order.orderStatus}
//               </span>
//             </div>
//             <div className="flex justify-between items-center text-sm">
//               <span className="text-gray-500">Order ID</span>
//               <span className="font-mono font-semibold">{order._id}</span>
//             </div>
//             <div className="flex justify-between items-center text-sm mt-1">
//               <span className="text-gray-500">Order Date</span>
//               <span>{formatDate(order.createdAt)}</span>
//             </div>
//           </div>

//           {/* Order Items */}
//           <div>
//             <h3 className="font-semibold mb-2">Items</h3>
//             <div className="bg-gray-50 rounded-lg divide-y">
//               {order.orderItems.map((item, index) => (
//                 <div key={index} className="p-3 flex gap-3">
//                   <img 
//                     src={item.image} 
//                     alt={item.name}
//                     className="w-16 h-16 object-cover rounded"
//                   />
//                   <div className="flex-1">
//                     <p className="font-medium">{item.name}</p>
//                     <p className="text-sm text-gray-500">
//                       Qty: {item.quantity} × ₹{item.price}
//                     </p>
//                     {item.pieces && (
//                       <p className="text-xs text-gray-400">{item.pieces}</p>
//                     )}
//                   </div>
//                   <p className="font-semibold">₹{item.price * item.quantity}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Delivery Address */}
//           <div>
//             <h3 className="font-semibold mb-2 flex items-center gap-2">
//               <FaMapMarkerAlt className="text-red-500" />
//               Delivery Address
//             </h3>
//             <div className="bg-gray-50 p-3 rounded-lg">
//               <p className="text-sm">{order.shippingAddress.address}</p>
//               {order.shippingAddress.landmark && (
//                 <p className="text-sm text-gray-600">Landmark: {order.shippingAddress.landmark}</p>
//               )}
//               <p className="text-sm text-gray-600">
//                 {order.shippingAddress.city} - {order.shippingAddress.pincode}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 Phone: {order.shippingAddress.phone}
//               </p>
              
//               {/* ✅ GOOGLE MAPS BUTTON - यहाँ add किया */}
//               {mapsLink && (
//                 <div className="mt-3 pt-3 border-t border-gray-200">
//                   <a
//                     href={mapsLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
//                   >
//                     <FaMapMarkerAlt />
//                     Navigate to Customer
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Payment Info */}
//           <div>
//             <h3 className="font-semibold mb-2 flex items-center gap-2">
//               <FaCreditCard className="text-blue-500" />
//               Payment Details
//             </h3>
//             <div className="bg-gray-50 p-3 rounded-lg">
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600">Payment Method</span>
//                 <span className="font-medium">{order.paymentMethod}</span>
//               </div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600">Items Total</span>
//                 <span>₹{order.itemsPrice}</span>
//               </div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600">Delivery Charge</span>
//                 <span>{order.deliveryPrice === 0 ? 'FREE' : `₹${order.deliveryPrice}`}</span>
//               </div>
//               <div className="border-t pt-2 mt-2">
//                 <div className="flex justify-between font-bold">
//                   <span>Total Paid</span>
//                   <span className="text-red-500">₹{order.totalPrice}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Delivery Timeline */}
//           {order.statusHistory && order.statusHistory.length > 0 && (
//             <div>
//               <h3 className="font-semibold mb-2 flex items-center gap-2">
//                 <FaTruck className="text-green-500" />
//                 Timeline
//               </h3>
//               <div className="bg-gray-50 p-3 rounded-lg space-y-2">
//                 {order.statusHistory.map((status, index) => (
//                   <div key={index} className="flex items-start gap-2 text-sm">
//                     <span className={`w-2 h-2 mt-1.5 rounded-full ${getStatusColor(status.status).split(' ')[0]}`} />
//                     <div className="flex-1">
//                       <p className="font-medium capitalize">{status.status}</p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(status.timestamp).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetailsModal;