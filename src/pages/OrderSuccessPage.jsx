import React, { useEffect, useState, useRef } from 'react'; // useRef भी import करना है
import { Link, useParams } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaHome, 
  FaPrint, 
  FaWhatsapp 
} from 'react-icons/fa';
import { getOrderById } from '../services/api';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const whatsappButtonRef = useRef(null); // ✅ Ref for the button

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await getOrderById(orderId);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsAppNotification = () => {
    const adminNumber = '919229264244'; 
    const message = `🛑 *NEW ORDER RECEIVED!*\n\n` +
      `*Order ID:* #${orderId.slice(-8)}\n` +
      `*Customer:* ${order?.user?.name || 'N/A'}\n` +
      `*Phone:* ${order?.shippingAddress?.phone || 'N/A'}\n` +
      `*Total:* ₹${order?.totalPrice || 0}\n` +
      `*Payment:* ${order?.paymentMethod || 'COD'}\n` +
      `*Items:* ${order?.orderItems?.length || 0} items\n\n` +
      `*Address:* ${order?.shippingAddress?.address || 'N/A'}\n` +
      `${order?.shippingAddress?.city || ''} - ${order?.shippingAddress?.pincode || ''}\n\n` +
      `🔗 *View Order:* ${window.location.origin}/admin/orders/${orderId}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${adminNumber}?text=${encodedMessage}`, '_blank');
  };

  // ✅ यह useEffect ब्राउज़र पॉलिसी को बायपास करने के लिए है
  useEffect(() => {
    if (!loading && order && whatsappButtonRef.current) {
      // एक छोटा सा टाइमर देकर बटन पर क्लिक करवाते हैं
      const timer = setTimeout(() => {
        whatsappButtonRef.current.click(); // प्रोग्रामेटिकली क्लिक
      }, 1500); // 1.5 सेकंड बाद क्लिक होगा
      return () => clearTimeout(timer);
    }
  }, [loading, order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
          
          {/* Success Icon */}
          <div className="mb-4 sm:mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-4xl sm:text-5xl text-green-500" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Thank you for your order. We'll notify you once it's confirmed.
          </p>

          {/* ✅ WhatsApp Button with ref */}
          <button
            ref={whatsappButtonRef}
            onClick={sendWhatsAppNotification}
            className="w-full mb-4 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 transform hover:scale-[1.02]"
          >
            <FaWhatsapp className="text-xl" />
            Notify Admin on WhatsApp
          </button>

          {/* Order ID */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Order ID</p>
            <p className="text-sm sm:text-base font-mono font-semibold text-gray-800 break-all">
              {orderId}
            </p>
          </div>

          {/* Order Details - बाकी सब कुछ वैसा ही रहेगा */}
          {order && (
            <div className="text-left mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
              <div className="space-y-3 mb-4">
                {order.orderItems.map((item) => (
                  <div key={item.product} className="flex gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span className="text-red-500">₹{order.totalPrice}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                <p className="text-sm text-gray-800">
                  {order.shippingAddress.address}
                </p>
                <p className="text-xs text-gray-600">
                  {order.shippingAddress.city} - {order.shippingAddress.pincode}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              <FaHome /> Continue Shopping
            </Link>
            <button
              onClick={() => window.print()}
              className="flex-1 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              <FaPrint /> Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;







// import React, { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { FaCheckCircle, FaHome, FaPrint, FaShare } from 'react-icons/fa';
// import { getOrderById } from '../services/api';

// const OrderSuccessPage = () => {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchOrder();
//   }, [orderId]);

//   const fetchOrder = async () => {
//     try {
//       const response = await getOrderById(orderId);
//       setOrder(response.data.data);
//     } catch (error) {
//       console.error('Error fetching order:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="container mx-auto px-4 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
//       <div className="container mx-auto px-4 max-w-2xl">
        
//         {/* Success Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
          
//           {/* Success Icon */}
//           <div className="mb-4 sm:mb-6">
//             <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
//               <FaCheckCircle className="text-4xl sm:text-5xl text-green-500" />
//             </div>
//           </div>

//           {/* Success Message */}
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
//             Order Placed Successfully!
//           </h1>
//           <p className="text-sm sm:text-base text-gray-600 mb-4">
//             Thank you for your order. We'll notify you once it's confirmed.
//           </p>

//           {/* Order ID */}
//           <div className="bg-gray-50 rounded-xl p-4 mb-6">
//             <p className="text-xs text-gray-500 mb-1">Order ID</p>
//             <p className="text-sm sm:text-base font-mono font-semibold text-gray-800 break-all">
//               {orderId}
//             </p>
//           </div>

//           {/* Order Details */}
//           {order && (
//             <div className="text-left mb-6">
//               <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
              
//               {/* Items */}
//               <div className="space-y-3 mb-4">
//                 {order.orderItems.map((item) => (
//                   <div key={item.product} className="flex gap-3">
//                     <img 
//                       src={item.image} 
//                       alt={item.name}
//                       className="w-12 h-12 object-cover rounded-lg"
//                     />
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-800">{item.name}</p>
//                       <p className="text-xs text-gray-500">
//                         Qty: {item.quantity} × ₹{item.price}
//                       </p>
//                     </div>
//                     <span className="text-sm font-semibold">
//                       ₹{item.price * item.quantity}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* Total */}
//               <div className="border-t pt-3">
//                 <div className="flex justify-between font-bold">
//                   <span>Total Amount</span>
//                   <span className="text-red-500">₹{order.totalPrice}</span>
//                 </div>
//               </div>

//               {/* Delivery Address */}
//               <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//                 <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
//                 <p className="text-sm text-gray-800">
//                   {order.shippingAddress.address}
//                 </p>
//                 <p className="text-xs text-gray-600">
//                   {order.shippingAddress.city} - {order.shippingAddress.pincode}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3">
//             <Link
//               to="/"
//               className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
//             >
//               <FaHome /> Continue Shopping
//             </Link>
//             <button
//               onClick={() => window.print()}
//               className="flex-1 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
//             >
//               <FaPrint /> Print Receipt
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderSuccessPage;