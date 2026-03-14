import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaCheckCircle, FaHome, FaPrint, FaDownload, FaShare } from 'react-icons/fa';
import { getOrderById } from '../services/api';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(10);

    // Fetch order details
    useEffect(() => {
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
        fetchOrder();
    }, [orderId]);

    // Auto redirect to home after 10 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const redirect = setTimeout(() => {
            navigate('/');
        }, 10000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [navigate]);

    // Handle print receipt
    const handlePrint = () => {
        window.print();
    };

    // Handle download receipt (as JSON)
    const handleDownload = () => {
        if (!order) return;
        
        const orderData = {
            orderId: order._id,
            date: new Date(order.createdAt).toLocaleString(),
            customer: order.shippingAddress.fullName,
            items: order.orderItems,
            total: order.totalPrice,
            paymentMethod: order.paymentMethod,
            paymentId: order.paymentResult?.id
        };

        const blob = new Blob([JSON.stringify(orderData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `order-${order._id.slice(-8)}.json`;
        a.click();
    };

    // Handle share via WhatsApp
    const handleShare = () => {
        const message = `I just placed an order on FlavorFix! Order ID: ${orderId.slice(-8)}. Total: ₹${order?.totalPrice || 0}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                
                {/* Success Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    
                    {/* Header - Success Banner */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center">
                        <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-4">
                            <FaCheckCircle className="text-4xl text-green-500" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            Payment Successful!
                        </h1>
                        <p className="text-green-100">
                            Thank you for your order. Your payment has been processed successfully.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8">
                        
                        {/* Auto Redirect Countdown */}
                        <div className="text-center mb-6">
                            <p className="text-sm text-gray-500">
                                Redirecting to home in <span className="font-bold text-red-500">{countdown}</span> seconds
                            </p>
                        </div>

                        {/* Order Details Card */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
                                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                                    {order?.orderStatus || 'Confirmed'}
                                </span>
                            </div>

                            {/* Order ID */}
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-1">Order ID</p>
                                <p className="text-sm font-mono font-semibold text-gray-800 break-all">
                                    {orderId}
                                </p>
                            </div>

                            {/* Order Items */}
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-2">Items Ordered</p>
                                <div className="space-y-2">
                                    {order?.orderItems?.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{item.name}</span>
                                                <span className="text-gray-500">x{item.quantity}</span>
                                            </div>
                                            <span className="font-medium">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{order?.itemsPrice || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Delivery</span>
                                    <span className="font-medium">
                                        {order?.deliveryPrice === 0 ? 'FREE' : `₹${order?.deliveryPrice || 40}`}
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total Paid</span>
                                    <span className="text-red-500">₹{order?.totalPrice || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info Card */}
                        <div className="bg-blue-50 rounded-xl p-6 mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Payment Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span className="font-medium">{order?.paymentMethod || 'Razorpay'}</span>
                                </div>
                                {order?.paymentResult?.id && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment ID</span>
                                        <span className="font-mono text-xs">{order.paymentResult.id}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Time</span>
                                    <span className="font-medium">
                                        {order?.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        {order?.shippingAddress && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-800 mb-2">Delivery Address</h3>
                                <p className="text-sm text-gray-600">
                                    {order.shippingAddress.fullName}<br />
                                    {order.shippingAddress.address}<br />
                                    {order.shippingAddress.landmark && `${order.shippingAddress.landmark}, `}
                                    {order.shippingAddress.city} - {order.shippingAddress.pincode}<br />
                                    Phone: {order.shippingAddress.phone}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <button
                                onClick={() => navigate('/')}
                                className="flex flex-col items-center gap-2 p-3 bg-gray-100 hover:bg-red-500 hover:text-white rounded-lg transition group"
                            >
                                <FaHome className="text-xl text-gray-600 group-hover:text-white" />
                                <span className="text-xs">Home</span>
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex flex-col items-center gap-2 p-3 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-lg transition group"
                            >
                                <FaPrint className="text-xl text-gray-600 group-hover:text-white" />
                                <span className="text-xs">Print</span>
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex flex-col items-center gap-2 p-3 bg-gray-100 hover:bg-green-500 hover:text-white rounded-lg transition group"
                            >
                                <FaDownload className="text-xl text-gray-600 group-hover:text-white" />
                                <span className="text-xs">Download</span>
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex flex-col items-center gap-2 p-3 bg-gray-100 hover:bg-purple-500 hover:text-white rounded-lg transition group"
                            >
                                <FaShare className="text-xl text-gray-600 group-hover:text-white" />
                                <span className="text-xs">Share</span>
                            </button>
                        </div>

                        {/* Footer Note */}
                        <p className="text-xs text-center text-gray-400 mt-6">
                            A confirmation email has been sent to your registered email address.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;