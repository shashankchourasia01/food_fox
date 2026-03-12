import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import { MdFormatQuote } from 'react-icons/md';

// 📸 Reviews Data
const reviewsData = [
  {
    id: 1,
    name: 'Swathi Rao',
    role: 'Startup Founder (HSR Layout)',
    image: '/images/reviews/demo.avif',
    rating: 5,
    review: 'Working in a startup means no time for cooking. Wealawa meals give me exactly what I need — simple, balanced, and tasty food.',
    bgImage: '/images/reviews/demo.avif' 
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    role: 'Software Engineer (Whitefield)',
    image: '/images/reviews/demo.avif',
    rating: 5,
    review: 'The food quality is amazing! Tastes just like home-cooked food. Delivery is always on time and packaging is great.',
    bgImage: '/images/reviews/review-bg.jpg'
  },
  {
    id: 3,
    name: 'Priya Kumar',
    role: 'Doctor (Jayanagar)',
    image: '/images/reviews/demo.avif',
    rating: 4,
    review: 'As a doctor, I have irregular hours. Wealawa has been a lifesaver! Healthy options, fresh food even late at night.',
    bgImage: '/images/reviews/review-bg.jpg'
  },
  {
    id: 4,
    name: 'Arjun Reddy',
    role: 'Student (Indiranagar)',
    image: '/images/reviews/demo.avif',
    rating: 5,
    review: 'Best food delivery for students! Affordable prices, good portions, and the food is actually healthy.',
    bgImage: '/images/reviews/review-bg.jpg'
  },
  {
    id: 5,
    name: 'Kavita Iyer',
    role: 'Homemaker (Koramangala)',
    image: '/images/reviews/demo.avif',
    rating: 5,
    review: 'Finally a service that understands what "home food" means! My family loves it. Great job team!',
    bgImage: '/images/reviews/review-bg.jpg'
  }
];

const Reviews = () => {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`${index < rating ? 'text-yellow-400' : 'text-gray-300'} text-xs sm:text-sm`}
      />
    ));
  };

  return (
    <section className="relative overflow-hidden min-h-125 sm:min-h-137.5 md:min-h-150 py-10 sm:py-12 md:py-16 bg-gray-50">
  {/* Background Image */}
  <div 
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `url('/images/reviews/livebangalore.webp')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      opacity: '0.15'
    }}
  />
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 inline-block relative">
            REVIEWS
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-red-500 rounded-full"></span>
          </h2>
        </div>

        {/* Navigation Arrows */}
        <div className="hidden md:flex justify-end mb-4 space-x-2">
          <button 
            onClick={scrollLeft}
            className="p-2 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white transition"
          >
            <FaChevronLeft className="text-gray-600" />
          </button>
          <button 
            onClick={scrollRight}
            className="p-2 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white transition"
          >
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>

        {/* Reviews Cards - Smaller & Responsive */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {reviewsData.map((review) => (
            <div 
              key={review.id}
              className="flex-none w-64 sm:w-72 md:w-80 bg-white rounded-xl shadow-lg hover:shadow-xl transition p-4 sm:p-5"
            >
              {/* Quote Icon */}
              <div className="text-red-500 mb-2">
                <MdFormatQuote className="text-2xl opacity-50" />
              </div>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-3 border-red-100">
                    <img 
                      src={review.image}
                      alt={review.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-user.jpg';
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
                    <MdFormatQuote className="text-white text-[8px]" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-800">
                    {review.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {review.role}
                  </p>
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-3">
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                  "{review.review}"
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
                <span className="text-xs text-gray-400">
                  {review.rating}.0
                </span>
              </div>

              {/* Verified Badge */}
              <div className="mt-3 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">✓ Verified</span>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {reviewsData.map((_, index) => (
            <button
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300 hover:bg-red-500 transition"
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({
                    left: index * 300,
                    behavior: 'smooth'
                  });
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Scrollbar Hide CSS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Reviews;




// import React, { useRef } from 'react';
// import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
// import { MdFormatQuote } from 'react-icons/md';

// // 📸 Reviews Data - Images public/images/reviews/ folder mein dalo
// const reviewsData = [
//   {
//     id: 1,
//     name: 'Swathi Rao',
//     role: 'Startup Founder (HSR Layout)',
//     image: '/images/reviews/demo.avif',
//     rating: 5,
//     review: 'Working in a startup means no time for cooking. Wealawa meals give me exactly what I need — simple, balanced, and tasty food that doesn\'t feel like restaurant junk.',
//     bgImage: '/images/reviews/demo.avif' 
//   },
//   {
//     id: 2,
//     name: 'Rahul Sharma',
//     role: 'Software Engineer (Whitefield)',
//     image: '/images/reviews/demo.avif',
//     rating: 5,
//     review: 'The food quality is amazing! Tastes just like home-cooked food. Delivery is always on time and packaging is great. Highly recommended for working professionals.',
//     bgImage: '/images/reviews/review-bg.jpg'
//   },
//   {
//     id: 3,
//     name: 'Priya Kumar',
//     role: 'Doctor (Jayanagar)',
//     image: '/images/reviews/demo.avif',
//     rating: 4,
//     review: 'As a doctor, I have irregular hours. Wealawa has been a lifesaver! Healthy options, fresh food, and they deliver even late at night. Love the Jain thali option!',
//     bgImage: '/images/reviews/review-bg.jpg'
//   },
//   {
//     id: 4,
//     name: 'Arjun Reddy',
//     role: 'Student (Indiranagar)',
//     image: '/images/reviews/demo.avif',
//     rating: 5,
//     review: 'Best food delivery for students! Affordable prices, good portions, and the food is actually healthy. The meal subscription is perfect for hostel life.',
//     bgImage: '/images/reviews/review-bg.jpg'
//   },
//   {
//     id: 5,
//     name: 'Kavita Iyer',
//     role: 'Homemaker (Koramangala)',
//     image: '/images/reviews/demo.avif',
//     rating: 5,
//     review: 'Finally a service that understands what "home food" means! My family loves it. Even my kids who are picky eaters enjoy the meals. Great job team!',
//     bgImage: '/images/reviews/review-bg.jpg'
//   }
// ];

// const Reviews = () => {
//   const scrollContainerRef = useRef(null);

//   // Scroll functions
//   const scrollLeft = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({
//         left: -400,
//         behavior: 'smooth'
//       });
//     }
//   };

//   const scrollRight = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({
//         left: 400,
//         behavior: 'smooth'
//       });
//     }
//   };

//   // Render stars based on rating
//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, index) => (
//       <FaStar
//         key={index}
//         className={`${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
//       />
//     ));
//   };

//   return (
//     <section className="relative overflow-hidden min-h-130 sm:min-h-145 md:min-h-160 flex items-center">
//       {/* Background Image with Overlay */}
//       <div 
//         className="absolute inset-0 z-0"
//         style={{
//           backgroundImage: `url('/images/reviews/livebangalore.webp')`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat',
//           opacity: '0.55', // Light overlay effect
//           minHeight: '100%',
//           width: '100%'
//         }}
//       />
      
//       {/* Dark overlay for better readability (optional) */}
//       {/* <div className="absolute inset-0 bg-black bg-opacity-5 z-0" /> */}

//       <div className="container mx-auto px-4 relative z-10">
        
//         {/* Heading - REVIEWS */}
//         <div className="text-center mb-2 sm:mb-4">
//           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 inline-block relative">
//             REVIEWS
//             {/* Underline effect */}
//             <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-500 rounded-full"></span>
//           </h2>
//         </div>

//         {/* Navigation Arrows - Hidden on mobile, visible on desktop */}
//         <div className="hidden md:flex justify-end mb-4 space-x-2">
//           <button 
//             onClick={scrollLeft}
//             className="p-3 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition group"
//             aria-label="Scroll left"
//           >
//             <FaChevronLeft className="text-gray-600 group-hover:text-white" />
//           </button>
//           <button 
//             onClick={scrollRight}
//             className="p-3 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition group"
//             aria-label="Scroll right"
//           >
//             <FaChevronRight className="text-gray-600 group-hover:text-white" />
//           </button>
//         </div>

//         {/* Horizontal Scrollable Reviews */}
//         <div 
//           ref={scrollContainerRef}
//           className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar"
//           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//         >
//           {reviewsData.map((review) => (
//             <div 
//               key={review.id}
//               className="flex-none w-75 sm:w-87.5 md:w-100 lg:w-112.5 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition p-6 sm:p-8"
//             >
//               {/* Quote Icon */}
//               <div className="text-red-500 mb-4">
//                 <MdFormatQuote className="text-4xl opacity-50" />
//               </div>

//               {/* Reviewer Info with Circular Image */}
//               <div className="flex items-center gap-4 mb-4">
//                 {/* Circular Image */}
//                 <div className="relative">
//                   <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-red-100">
//                     <img 
//                       src={review.image}
//                       alt={review.name}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.src = '/images/placeholder-user.jpg';
//                       }}
//                     />
//                   </div>
//                   {/* Small Quote Badge */}
//                   <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1.5">
//                     <MdFormatQuote className="text-white text-xs" />
//                   </div>
//                 </div>

//                 {/* Name and Role */}
//                 <div>
//                   <h3 className="text-lg sm:text-xl font-bold text-gray-800">
//                     {review.name}
//                   </h3>
//                   <p className="text-xs sm:text-sm text-gray-500">
//                     {review.role}
//                   </p>
//                 </div>
//               </div>

//               {/* Review Text */}
//               <div className="mb-4">
//                 <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
//                   "{review.review}"
//                 </p>
//               </div>

//               {/* Rating Stars */}
//               <div className="flex items-center gap-1">
//                 {renderStars(review.rating)}
//                 <span className="ml-2 text-sm text-gray-500">
//                   ({review.rating}.0)
//                 </span>
//               </div>

//               {/* Decorative Line */}
//               <div className="mt-4 pt-4 border-t border-gray-100">
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-gray-400">Verified Customer</span>
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Dots Indicator (optional) */}
//         <div className="flex justify-center mt-6 space-x-2">
//           {reviewsData.map((_, index) => (
//             <button
//               key={index}
//               className="w-2 h-2 rounded-full bg-gray-300 hover:bg-red-500 transition"
//               onClick={() => {
//                 if (scrollContainerRef.current) {
//                   scrollContainerRef.current.scrollTo({
//                     left: index * 400,
//                     behavior: 'smooth'
//                   });
//                 }
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Hide Scrollbar CSS */}
//       <style>{`
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .hide-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default Reviews;