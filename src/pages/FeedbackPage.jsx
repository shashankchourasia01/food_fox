import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaRegStar, FaWhatsapp } from 'react-icons/fa';
import { MdFeedback, MdSend } from 'react-icons/md';


const WHATSAPP_NUMBER = '919229264244'; 

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    category: 'general',
    message: '',
    orderId: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle rating click
  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  // Submit to WhatsApp
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.name || !formData.message || formData.rating === 0) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill all required fields and add rating'
      });
      setIsSubmitting(false);
      return;
    }

    // Create WhatsApp message
    const message = `*New Feedback Received*%0A%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Email:* ${formData.email || 'Not provided'}%0A` +
      `*Rating:* ${'⭐'.repeat(formData.rating)} (${formData.rating}/5)%0A` +
      `*Category:* ${formData.category}%0A` +
      `*Order ID:* ${formData.orderId || 'N/A'}%0A` +
      `*Message:* ${formData.message}%0A%0A` +
      `*Submitted on:* ${new Date().toLocaleString()}`;

    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');

    // Show success message
    setSubmitStatus({
      type: 'success',
      message: 'Thank you for your feedback! WhatsApp will open to send.'
    });

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        rating: 0,
        category: 'general',
        message: '',
        orderId: ''
      });
      setSubmitStatus(null);
      setIsSubmitting(false);
    }, 3000);
  };

  // Render stars
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingClick(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none"
        >
          {i <= (hoverRating || formData.rating) ? (
            <FaStar className="text-yellow-400 text-2xl sm:text-3xl mx-1 transition hover:scale-110" />
          ) : (
            <FaRegStar className="text-gray-300 text-2xl sm:text-3xl mx-1 transition hover:scale-110" />
          )}
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <MdFeedback className="text-red-500" />
            Share Your Feedback
          </h1>
        </div>

        {/* Main Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            
            {/* Header Gradient */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <h2 className="text-xl font-semibold mb-2">We Value Your Opinion!</h2>
              <p className="text-sm opacity-90">
                Your feedback helps us serve you better. All responses are reviewed by our team.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Rating Stars */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-center sm:justify-start">
                  {renderStars()}
                </div>
                {formData.rating > 0 && (
                  <p className="text-center sm:text-left text-sm text-gray-500 mt-2">
                    You rated: {formData.rating}/5
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Feedback Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="general">General Feedback</option>
                  <option value="food">Food Quality</option>
                  <option value="delivery">Delivery Experience</option>
                  <option value="app">App Experience</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="complaint">Complaint</option>
                </select>
              </div>

              {/* Order ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order ID <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleChange}
                  placeholder="If related to specific order"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Please share your experience, suggestions, or concerns..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                ></textarea>
              </div>

              {/* Submit Status */}
              {submitStatus && (
                <div className={`p-4 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold text-lg
                  flex items-center justify-center gap-3 transition transform hover:scale-[1.02] active:scale-[0.98]
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-600 hover:to-green-700'}`}
              >
                <FaWhatsapp className="text-2xl" />
                <span>{isSubmitting ? 'Processing...' : 'Submit via WhatsApp'}</span>
                <MdSend className="text-xl" />
              </button>

              {/* Privacy Note */}
              <p className="text-xs text-center text-gray-400 mt-4">
                By submitting, you agree to share this feedback with our team via WhatsApp.
                We'll never share your personal information.
              </p>
            </form>
          </div>

          {/* Quick Feedback Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {['😊 Great', '👍 Good', '🤔 Average', '😞 Poor'].map((item, index) => (
              <button
                key={index}
                onClick={() => setFormData(prev => ({ ...prev, message: item }))}
                className="bg-white border border-gray-200 rounded-lg p-2 text-sm hover:border-red-300 hover:text-red-500 transition"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;