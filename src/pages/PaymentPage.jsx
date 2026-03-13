import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaRupeeSign } from 'react-icons/fa';
import paymentService from '../services/paymentService';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [scriptLoaded, setScriptLoaded] = useState(false);

    // Get order data from sessionStorage
    const checkoutAddress = JSON.parse(sessionStorage.getItem('checkoutAddress') || '{}');
    const checkoutOrderData = JSON.parse(sessionStorage.getItem('checkoutOrderData') || '{}');
    const { totalPrice } = useSelector((state) => state.cart);

    // Amount to pay (use sessionStorage total or cart total)
    const amountToPay = checkoutOrderData.totalPrice || totalPrice || 0;

    // ✅ Load Razorpay script on component mount
    useEffect(() => {
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                // Check if script already loaded
                if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
                    console.log('✅ Razorpay script already loaded');
                    setScriptLoaded(true);
                    resolve(true);
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => {
                    console.log('✅ Razorpay script loaded successfully');
                    setScriptLoaded(true);
                    resolve(true);
                };
                script.onerror = () => {
                    console.error('❌ Failed to load Razorpay script');
                    setError('Failed to load payment gateway. Please try again.');
                    setScriptLoaded(false);
                    resolve(false);
                };
                document.body.appendChild(script);
            });
        };

        loadRazorpayScript();
    }, []);

    // ✅ Handle payment
    const handlePayment = async () => {
        if (amountToPay < 1) {
            setError('Invalid amount. Please refresh and try again.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Check if script loaded
            if (!scriptLoaded || typeof window.Razorpay === 'undefined') {
                setError('Payment gateway not initialized. Please refresh the page.');
                setLoading(false);
                return;
            }

            // Create order on backend
            console.log('💰 Creating Razorpay order for amount:', amountToPay);
            const orderResponse = await paymentService.createOrder(amountToPay);
            console.log('✅ Order response:', orderResponse.data);

            const { data: order, keyId } = orderResponse.data;

            // ✅ FIX: Amount should be in paise (already done in backend)
            console.log('💰 Order amount in paise:', order.amount);

            // Prepare Razorpay options
            const options = {
                key: keyId,
                amount: order.amount,  // Already in paise from backend
                currency: order.currency || 'INR',
                name: 'FlavorFix',
                description: 'Food Order Payment',
                image: '/logo.png',
                order_id: order.id,
                handler: async (response) => {
                    console.log('✅ Payment success:', response);
                    
                    try {
                        // Get order data from session
                        const orderData = {
                            items: [], // You need to pass cart items here
                            itemsPrice: amountToPay - (amountToPay > 500 ? 0 : 40),
                            deliveryPrice: amountToPay > 500 ? 0 : 40,
                            totalPrice: amountToPay,
                            shippingAddress: checkoutAddress
                        };

                        // Verify payment and create order
                        const verifyResponse = await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderData
                        });

                        // Clear session storage
                        sessionStorage.removeItem('checkoutAddress');
                        sessionStorage.removeItem('checkoutOrderData');

                        // Redirect to success page
                        navigate(`/order-success/${verifyResponse.data.orderId}`);
                        
                    } catch (error) {
                        console.error('❌ Order creation error:', error);
                        setError('Payment successful but order creation failed. Contact support.');
                    }
                },
                modal: {
                    ondismiss: () => {
                        console.log('⚠️ Payment modal dismissed');
                        setLoading(false);
                    },
                    confirm_close: true,  // Ask confirmation before closing
                    animation: true
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                    contact: user?.phone || ''
                },
                theme: {
                    color: '#ef4444'  // Red color
                },
                // ✅ Add these for better error handling
                retry: {
                    enabled: true,
                    max_count: 3
                },
                send_sms_hash: true,
                remember_customer: true
            };

            // Open Razorpay checkout
            const razorpay = new window.Razorpay(options);
            
            // Add error handler
            razorpay.on('payment.failed', (response) => {
                console.error('❌ Payment failed:', response.error);
                setError(`Payment failed: ${response.error.description || 'Unknown error'}`);
                setLoading(false);
            });

            razorpay.open();

        } catch (error) {
            console.error('❌ Payment error:', error);
            
            // Check for specific error codes [citation:2]
            if (error.response?.data?.message?.includes('amount')) {
                setError('Invalid amount. Please check your order total.');
            } else if (error.response?.status === 401) {
                setError('Payment authentication failed. Please refresh and try again.');
            } else {
                setError(error.response?.data?.message || 'Payment failed. Please try again.');
            }
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
                                <span className="font-medium">₹{amountToPay - (amountToPay > 500 ? 0 : 40)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery</span>
                                <span className="font-medium">
                                    {amountToPay > 500 ? 'FREE' : '₹40'}
                                </span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span className="text-red-500">₹{amountToPay}</span>
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

                    {/* Script Loading Indicator */}
                    {!scriptLoaded && !error && (
                        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-500 border-t-transparent"></div>
                            Loading payment gateway...
                        </div>
                    )}

                    {/* Pay Button */}
                    <button
                        onClick={handlePayment}
                        disabled={loading || !scriptLoaded || amountToPay < 1}
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
                                <span>Pay ₹{amountToPay}</span>
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