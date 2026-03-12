// import React, { useState } from 'react';
// import { 
//   FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, 
//   FaClock, FaUser, FaComment, FaPaperPlane 
// } from 'react-icons/fa';
// import { MdEmail, MdLocationOn } from 'react-icons/md';

// const ContactPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     orderId: '',
//     message: ''
//   });
//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission - integrate with your backend
//     console.log('Form submitted:', formData);
//     setSubmitted(true);
//     setTimeout(() => setSubmitted(false), 5000);
//   };

//   const contactMethods = [
//     {
//       icon: <FaPhone className="text-2xl" />,
//       title: 'Call Us',
//       info: '+91 9304637399',
//       sub: 'Mon-Sat, 10am - 8pm',
//       action: 'tel:+919304637399',
//       bgColor: 'bg-blue-50',
//       iconColor: 'text-blue-500'
//     },
//     {
//       icon: <FaWhatsapp className="text-2xl" />,
//       title: 'WhatsApp',
//       info: '+91 9304637399',
//       sub: '24/7 Support',
//       action: 'https://wa.me/919304637399',
//       bgColor: 'bg-green-50',
//       iconColor: 'text-green-500'
//     },
//     {
//       icon: <FaEnvelope className="text-2xl" />,
//       title: 'Email',
//       info: 'support@flavorfix.com',
//       sub: 'orders@flavorfix.com',
//       action: 'mailto:support@flavorfix.com',
//       bgColor: 'bg-purple-50',
//       iconColor: 'text-purple-500'
//     },
//     {
//       icon: <FaMapMarkerAlt className="text-2xl" />,
//       title: 'Visit Us',
//       info: 'Jayanagar, Bangalore',
//       sub: 'Karnataka - 560041',
//       action: 'https://maps.google.com/?q=Jayanagar+Bangalore',
//       bgColor: 'bg-orange-50',
//       iconColor: 'text-orange-500'
//     }
//   ];

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      
//       {/* Contact Methods Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
//         {contactMethods.map((method, idx) => (
//           <a
//             key={idx}
//             href={method.action}
//             target={method.action.startsWith('http') ? '_blank' : '_self'}
//             rel="noopener noreferrer"
//             className={`${method.bgColor} rounded-lg p-4 hover:shadow-md transition transform hover:-translate-y-1`}
//           >
//             <div className={`${method.iconColor} mb-2`}>{method.icon}</div>
//             <h3 className="font-semibold text-gray-800">{method.title}</h3>
//             <p className="text-sm text-gray-600">{method.info}</p>
//             <p className="text-xs text-gray-500 mt-1">{method.sub}</p>
//           </a>
//         ))}
//       </div>

//       {/* Contact Form + Map */}
//       <div className="flex flex-col lg:flex-row">
        
//         {/* Form Section */}
//         <div className="lg:w-2/3 p-6 sm:p-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Send us a Message</h2>
//           <p className="text-gray-500 mb-6">We'll get back to you within 24 hours</p>

//           {submitted && (
//             <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
//               ✅ Thank you for contacting us! We'll respond shortly.
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                   placeholder="John Doe"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
//                   placeholder="john@example.com"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
//                   placeholder="9876543210"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Order ID (optional)</label>
//                 <input
//                   type="text"
//                   name="orderId"
//                   value={formData.orderId}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
//                   placeholder="FLX123456"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
//               <textarea
//                 name="message"
//                 value={formData.message}
//                 onChange={handleChange}
//                 required
//                 rows="5"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
//                 placeholder="How can we help you?"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
//             >
//               <FaPaperPlane /> Send Message
//             </button>
//           </form>
//         </div>

//         {/* Map & Hours Section */}
//         <div className="lg:w-1/3 bg-gray-50 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-gray-200">
          
//           {/* Business Hours */}
//           <div className="mb-6">
//             <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//               <FaClock className="text-red-500" /> Business Hours
//             </h3>
//             <ul className="space-y-2 text-sm">
//               {[
//                 { day: 'Monday - Friday', hours: '10:00 AM - 8:00 PM' },
//                 { day: 'Saturday', hours: '10:00 AM - 6:00 PM' },
//                 { day: 'Sunday', hours: 'Closed' },
//                 { day: 'Support', hours: '24/7 via WhatsApp' }
//               ].map((item, idx) => (
//                 <li key={idx} className="flex justify-between text-gray-600">
//                   <span>{item.day}</span>
//                   <span className="font-medium">{item.hours}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Map */}
//           <div>
//             <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//               <MdLocationOn className="text-red-500" /> Our Location
//             </h3>
//             <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
//               <iframe
//                 title="FlavorFix Location"
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.951471194492!2d77.5896!3d12.9299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15b1d0e5b5b5%3A0x5b5b5b5b5b5b5b5b!2sJayanagar%2C%20Bangalore!5e0!3m2!1sen!2sin!4v1620000000000"
//                 width="100%"
//                 height="100%"
//                 style={{ border: 0 }}
//                 allowFullScreen=""
//                 loading="lazy"
//                 className="w-full h-full"
//               />
//             </div>
//             <p className="text-xs text-gray-500 mt-2">
//               Jayanagar, Bangalore - 560041
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactPage;