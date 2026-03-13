import api from './api';

const paymentService = {
    // Create Razorpay order
    createOrder: (amount) => api.post('/payment/create-order', { amount }),
    
    // Verify payment and create order
    verifyPayment: (data) => api.post('/payment/verify', data)
};

export default paymentService;