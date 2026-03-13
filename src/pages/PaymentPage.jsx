import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaRupeeSign } from 'react-icons/fa';
import paymentService from '../services/paymentService';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { cartItems, totalPrice } = useSelector((state) => state.cart);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load Razorpay script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Handle payment
    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            // Load Razorpay script [citation:4]
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setError('Failed to load payment gateway. Please try again.');
                setLoading(false);
                return;
            }

            // Create order on backend [citation:8]
            const orderResponse = await paymentService.createOrder(totalPrice);
            const { data: order, keyId } = orderResponse.data;

            // Prepare Razorpay options [citation:4]
            const options = {
                key: keyId,
                amount: order.amount,
                currency: order.currency,
                name: 'FlavorFix',
                description: 'Food Order Payment',
                image: '/logo.png',
                order_id: order.id,
                handler: async (response) => {
                    // Payment successful [citation:4]
                    console.log('Payment success:', response);
                    
                    try {
                        // Get order data from checkout (you can pass via state)
                        const orderData = {
                            items: cartItems,
                            itemsPrice: totalPrice,
                            deliveryPrice: totalPrice > 500 ? 0 : 40,
                            totalPrice: totalPrice + (totalPrice > 500 ? 0 : 40),
                            shippingAddress: JSON.parse(sessionStorage.getItem('checkoutAddress'))
                        };

                        // Verify payment and create order [citation:3]
                        const verifyResponse = await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderData
                        });

                        // Redirect to success page
                        navigate(`/order-success/${verifyResponse.data.orderId}`);
                        
                    } catch (error) {
                        console.error('Order creation error:', error);
                        setError('Payment successful but order creation failed. Contact support.');
                    }
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        console.log('Payment modal closed');
                    }
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                    contact: user?.phone || ''
                },
                theme: {
                    color: '#ef4444' // Red color
                }
            };

            // Open Razorpay checkout [citation:4]
            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error('Payment error:', error);
            setError(error.response?.data?.message || 'Payment failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaCreditCard className="text-red-500" />
                        Payment
                    </h1>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Items Total</span>
                                <span className="font-medium">₹{totalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery</span>
                                <span className="font-medium">
                                    {totalPrice > 500 ? 'FREE' : '₹40'}
                                </span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span className="text-red-500">
                                        ₹{totalPrice + (totalPrice > 500 ? 0 : 40)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 text-blue-700 mb-2">
                            <FaLock className="text-sm" />
                            <h4 className="font-semibold">Secure Payment</h4>
                        </div>
                        <p className="text-xs text-blue-600">
                            Your payment is encrypted and secure. We support all major UPI apps, cards, and netbanking.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            ❌ {error}
                        </div>
                    )}

                    {/* Pay Button */}
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <FaRupeeSign />
                                <span>Pay ₹{totalPrice + (totalPrice > 500 ? 0 : 40)}</span>
                            </>
                        )}
                    </button>

                    {/* Payment Methods */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400">
                            We accept: UPI (GPay, PhonePe, Paytm), Cards, Netbanking, Wallet
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;