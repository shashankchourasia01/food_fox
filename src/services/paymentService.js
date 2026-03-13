import api from './api';

const paymentService = {
    // Create Razorpay order - amount in rupees
    createOrder: (amount) => {
        if (!amount || amount < 1) {
            throw new Error('Invalid amount');
        }
        return api.post('/payment/create-order', { amount });
    },
    
    // Verify payment and create order
    verifyPayment: (data) => api.post('/payment/verify', data)
};

export default paymentService;