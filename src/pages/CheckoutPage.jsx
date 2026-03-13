// code for razorpay
// updated code for location
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaCreditCard,
    FaMoneyBill,
    FaWallet,
    FaCheck,
    FaPlus,
    FaEdit,
    FaTrash
} from 'react-icons/fa';
import { createOrder } from '../redux/actions/orderActions';
import { loadCart } from '../redux/actions/cartActions';
import addressService from '../services/addressService';
import useDeliveryCheck from '../hooks/useDeliveryCheck'; // ✅ Import hook
import useGeolocation from '../hooks/useGeolocation';

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { cartItems, totalPrice, loading: cartLoading } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    // ✅ Get delivery status from hook
    // const { deliveryStatus } = useDeliveryCheck();
    const { location } = useGeolocation();
    const { deliveryStatus, checkDelivery } = useDeliveryCheck();

    // States
    const [step, setStep] = useState(1);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    // New address form
    const [newAddress, setNewAddress] = useState({
        type: 'home',
        address: '',
        landmark: '',
        city: '',
        pincode: '',
        isDefault: false
    });

    // Calculate totals
    const calculateTotals = () => {
        const items = cartItems || [];
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryCharge = subtotal > 500 ? 0 : 40;
        const total = subtotal + deliveryCharge;
        
        return { subtotal, deliveryCharge, total };
    };

    const { subtotal, deliveryCharge, total } = calculateTotals();

    // Load addresses on mount
    useEffect(() => {
        fetchAddresses();
    }, []);

    useEffect(() => {
        console.log('Selected address changed:', selectedAddress);
    }, [selectedAddress]);

    useEffect(() => {
    console.log('📍 Current deliveryStatus:', deliveryStatus);
    console.log('📍 isDeliverable:', deliveryStatus.isDeliverable);
    console.log('📍 Coordinates from user:', location.coordinates);
}, [deliveryStatus]);


    // Call checkDelivery when coordinates change
useEffect(() => {
    if (location.coordinates) {
        checkDelivery(location.coordinates.latitude, location.coordinates.longitude);
    }
}, [location.coordinates, checkDelivery]);

    const fetchAddresses = async () => {
        try {
            const response = await addressService.getAddresses();
            console.log('Fetched addresses:', response.data.data);
            
            response.data.data.forEach((addr, index) => {
                console.log(`Address ${index}:`, {
                    id: addr._id,
                    type: addr.type,
                    address: addr.address,
                    city: addr.city,
                    pincode: addr.pincode,
                    landmark: addr.landmark,
                    isDefault: addr.isDefault
                });
            });
            
            setAddresses(response.data.data);
            setSelectedAddress(null);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    // Handle address selection
    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
    };

    // Handle edit address
    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setNewAddress({
            type: address.type,
            address: address.address,
            landmark: address.landmark || '',
            city: address.city,
            pincode: address.pincode,
            isDefault: address.isDefault || false
        });
        setShowAddressForm(true);
    };

    // Handle delete address
    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm('Are you sure you want to delete this address?')) {
            return;
        }

        try {
            setLoading(true);
            await addressService.deleteAddress(addressId);
            
            const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
            setAddresses(updatedAddresses);
            
            if (selectedAddress?._id === addressId) {
                setSelectedAddress(null);
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            alert('Failed to delete address. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle address form input
    const handleAddressInput = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAddress(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Validate address form
    const validateAddressForm = () => {
        const errors = {};

        if (!newAddress.address.trim()) {
            errors.address = 'Address is required';
        }
        if (!newAddress.city.trim()) {
            errors.city = 'City is required';
        }
        if (!newAddress.pincode.trim()) {
            errors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(newAddress.pincode)) {
            errors.pincode = 'Pincode must be 6 digits';
        }

        return errors;
    };

    // Add or update address
    const handleSaveAddress = async (e) => {
        e.preventDefault();

        const errors = validateAddressForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            setLoading(true);
            
            let response;
            if (editingAddress) {
                console.log('Updating address:', editingAddress._id, newAddress);
                response = await addressService.updateAddress(editingAddress._id, newAddress);
            } else {
                console.log('Adding new address:', newAddress);
                response = await addressService.addAddress(newAddress);
            }

            console.log('Address save response:', response.data);

            await fetchAddresses();
            
            if (response.data && response.data.data) {
                setSelectedAddress(response.data.data);
            }
            
            resetAddressForm();
            
        } catch (error) {
            console.error('Error saving address:', error);
            console.error('Error response:', error.response?.data);
            alert(error.response?.data?.message || 'Failed to save address. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Reset address form
    const resetAddressForm = () => {
        setShowAddressForm(false);
        setEditingAddress(null);
        setNewAddress({
            type: 'home',
            address: '',
            landmark: '',
            city: '',
            pincode: '',
            isDefault: false
        });
        setFormErrors({});
    };

    // Cancel address form
    const handleCancelAddress = () => {
        resetAddressForm();
    };

    const validateSelectedAddress = () => {
        if (!selectedAddress) {
            alert('Please select a delivery address');
            return false;
        }

        console.log('Validating selected address:', selectedAddress);

        const requiredFields = {
            address: 'Address',
            city: 'City',
            pincode: 'Pincode'
        };

        for (const [field, label] of Object.entries(requiredFields)) {
            if (!selectedAddress[field] || selectedAddress[field].trim() === '') {
                alert(`Selected address is missing ${label}. Please choose another address or edit this one.`);
                return false;
            }
        }

        if (!/^\d{6}$/.test(selectedAddress.pincode)) {
            alert('Invalid pincode format in selected address. Please use a 6-digit pincode.');
            return false;
        }

        return true;
    };

    // ✅ STEP 7: Delivery check + ✅ STEP 9: Payment redirect
    const handlePlaceOrder = async () => {
    // Validate address
    if (!validateSelectedAddress()) {
        return;
    }

    // ✅ Check if delivery status is still loading
    if (deliveryStatus.loading) {
        alert('Please wait while we check delivery availability for your location.');
        return;
    }

    // ✅ Check if delivery check failed
    if (deliveryStatus.error) {
        alert('Unable to verify delivery availability. Please try again or contact support.');
        return;
    }

    // ✅ Check delivery availability
    if (deliveryStatus.isDeliverable === false) {
        const errorMsg = `Delivery not available in your area. We currently deliver within ${deliveryStatus.maxDistance || 10}km radius.`;
        alert(errorMsg);
        return;
    }

    // ✅ Check if location not detected
    if (deliveryStatus.isDeliverable === null) {
        alert('Please allow location access or select your location to check delivery availability.');
        return;
    }

        try {
            setLoading(true);

            // Prepare order data
            const orderData = {
                shippingAddress: {
                    fullName: user?.name || 'Customer',
                    phone: user?.phone || '',
                    address: selectedAddress.address,
                    landmark: selectedAddress.landmark || '',
                    city: selectedAddress.city,
                    pincode: selectedAddress.pincode,
                    type: selectedAddress.type || 'home'
                },
                itemsPrice: subtotal,
                deliveryPrice: deliveryCharge,
                totalPrice: total,
                notes: ''
            };

            console.log('📦 Order Data:', orderData);

            // ✅ STEP 9: Payment Method based navigation
            if (paymentMethod === 'COD') {
                // COD Order - Place directly
                const result = await dispatch(createOrder({
                    ...orderData,
                    paymentMethod: 'COD'
                }));
                
                if (result && result._id) {
                    if (result.whatsappUrl) {
                        window.open(result.whatsappUrl, '_blank');
                    }
                    navigate(`/order-success/${result._id}`);
                }
            } else {
                // Online Payment - Save address in sessionStorage and go to payment page
                sessionStorage.setItem('checkoutAddress', JSON.stringify(orderData.shippingAddress));
                sessionStorage.setItem('checkoutOrderData', JSON.stringify({
                    itemsPrice: subtotal,
                    deliveryPrice: deliveryCharge,
                    totalPrice: total,
                    paymentMethod
                }));
                
                // Navigate to payment page
                navigate('/payment');
            }
            
        } catch (error) {
            console.error('❌ Order error:', error);
            alert(error.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Address Type Icon
    const getAddressIcon = (type) => {
        switch (type) {
            case 'home': return '🏠';
            case 'work': return '💼';
            default: return '📍';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header with Back Button */}
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white rounded-full transition"
                    >
                        <FaArrowLeft className="text-gray-600 text-lg" />
                    </button>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                        Checkout
                    </h1>
                </div>

                {/* Delivery Status Banner (Optional) */}
                {deliveryStatus.isDeliverable === false && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                        ⚠️ Delivery not available in your area. Maximum delivery radius is {deliveryStatus.maxDistance || 10}km.
                    </div>
                )}

                {/* Progress Steps */}
                <div className="flex justify-between mb-6 sm:mb-8 px-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex-1 text-center">
                            <div className={`
                                w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full flex items-center justify-center font-semibold text-sm sm:text-base
                                ${step >= s ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}
                            `}>
                                {step > s ? '✓' : s}
                            </div>
                            <p className="text-xs sm:text-sm mt-1 text-gray-600">
                                {s === 1 && 'Address'}
                                {s === 2 && 'Payment'}
                                {s === 3 && 'Confirm'}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">

                    {/* Left Column - Main Form */}
                    <div className="lg:w-2/3 space-y-4 sm:space-y-6">

                        {/* Step 1: Address Selection */}
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                                    <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">
                                        1
                                    </span>
                                    Delivery Address
                                </h2>
                                <button
                                    onClick={() => {
                                        resetAddressForm();
                                        setShowAddressForm(true);
                                    }}
                                    className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm sm:text-base"
                                >
                                    <FaPlus className="text-xs" />
                                    <span>Add New</span>
                                </button>
                            </div>

                            {/* Address List */}
                            {addresses.length > 0 ? (
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr._id}
                                            className={`
                                                border rounded-xl p-3 sm:p-4 transition-all
                                                ${selectedAddress?._id === addr._id
                                                    ? 'border-red-500 bg-red-50 shadow-md'
                                                    : 'border-gray-200'
                                                }
                                            `}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div 
                                                    className="flex-1 cursor-pointer"
                                                    onClick={() => handleAddressSelect(addr)}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="text-2xl">
                                                            {getAddressIcon(addr.type)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-semibold text-gray-800 text-sm sm:text-base capitalize">
                                                                    {addr.type}
                                                                </span>
                                                                {addr.isDefault && (
                                                                    <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                                                                        Default
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                                                {addr.address}
                                                            </p>
                                                            {addr.landmark && (
                                                                <p className="text-xs text-gray-500">
                                                                    Landmark: {addr.landmark}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-gray-500">
                                                                {addr.city} - {addr.pincode}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Action Buttons */}
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleEditAddress(addr)}
                                                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition"
                                                        title="Edit address"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAddress(addr._id)}
                                                        className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition"
                                                        title="Delete address"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                    {selectedAddress?._id === addr._id && (
                                                        <FaCheck className="text-red-500 text-lg shrink-0 ml-2" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">No saved addresses yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Add your first delivery address</p>
                                </div>
                            )}

                            {/* Add/Edit Address Form */}
                            {showAddressForm && (
                                <form onSubmit={handleSaveAddress} className="mt-4 border-t pt-4">
                                    <h3 className="font-semibold text-gray-700 mb-3">
                                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Address Type */}
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                                Address Type
                                            </label>
                                            <div className="flex gap-3">
                                                {['home', 'work', 'other'].map((type) => (
                                                    <label key={type} className="flex items-center gap-1">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value={type}
                                                            checked={newAddress.type === type}
                                                            onChange={handleAddressInput}
                                                            className="text-red-500"
                                                            required
                                                        />
                                                        <span className="text-xs sm:text-sm capitalize">{type}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Address Line */}
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                                Address *
                                            </label>
                                            <textarea
                                                name="address"
                                                value={newAddress.address}
                                                onChange={handleAddressInput}
                                                rows="2"
                                                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 ${
                                                    formErrors.address ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                required
                                                placeholder="Enter your full address"
                                            />
                                            {formErrors.address && (
                                                <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>
                                            )}
                                        </div>

                                        {/* Landmark */}
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                                Landmark
                                            </label>
                                            <input
                                                type="text"
                                                name="landmark"
                                                value={newAddress.landmark}
                                                onChange={handleAddressInput}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                placeholder="Near..."
                                            />
                                        </div>

                                        {/* City */}
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={newAddress.city}
                                                onChange={handleAddressInput}
                                                className={`w-full px-3 py-2 border rounded-lg text-sm ${
                                                    formErrors.city ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                required
                                                placeholder="e.g., Bangalore"
                                            />
                                            {formErrors.city && (
                                                <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>
                                            )}
                                        </div>

                                        {/* Pincode */}
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                                Pincode *
                                            </label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={newAddress.pincode}
                                                onChange={handleAddressInput}
                                                maxLength="6"
                                                className={`w-full px-3 py-2 border rounded-lg text-sm ${
                                                    formErrors.pincode ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                required
                                                placeholder="6-digit pincode"
                                            />
                                            {formErrors.pincode && (
                                                <p className="text-xs text-red-500 mt-1">{formErrors.pincode}</p>
                                            )}
                                        </div>

                                        {/* Default Address Checkbox */}
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="isDefault"
                                                checked={newAddress.isDefault}
                                                onChange={handleAddressInput}
                                                className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                                            />
                                            <label className="ml-2 text-xs sm:text-sm text-gray-700">
                                                Set as default address
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancelAddress}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Step 2: Payment Method */}
                        {selectedAddress && (
                            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-4">
                                    <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">
                                        2
                                    </span>
                                    Payment Method
                                </h2>

                                <div className="space-y-3">
                                    {/* Cash on Delivery */}
                                    <label className={`
                                        flex items-center gap-3 p-3 sm:p-4 border rounded-xl cursor-pointer transition
                                        ${paymentMethod === 'COD'
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-200 hover:border-red-300'
                                        }
                                    `}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-red-500"
                                        />
                                        <FaMoneyBill className="text-2xl text-green-600" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                                Cash on Delivery
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Pay when you receive your order
                                            </p>
                                        </div>
                                        {paymentMethod === 'COD' && (
                                            <FaCheck className="text-red-500 text-lg" />
                                        )}
                                    </label>

                                    {/* Card Payment */}
                                    <label className={`
                                        flex items-center gap-3 p-3 sm:p-4 border rounded-xl cursor-pointer transition
                                        ${paymentMethod === 'CARD'
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-200 hover:border-red-300'
                                        }
                                    `}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="CARD"
                                            checked={paymentMethod === 'CARD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-red-500"
                                        />
                                        <FaCreditCard className="text-2xl text-blue-600" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                                Credit/Debit Card
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Pay securely with card
                                            </p>
                                        </div>
                                        {paymentMethod === 'CARD' && (
                                            <FaCheck className="text-red-500 text-lg" />
                                        )}
                                    </label>

                                    {/* UPI / Wallet */}
                                    <label className={`
                                        flex items-center gap-3 p-3 sm:p-4 border rounded-xl cursor-pointer transition
                                        ${paymentMethod === 'UPI'
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-200 hover:border-red-300'
                                        }
                                    `}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="UPI"
                                            checked={paymentMethod === 'UPI'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-red-500"
                                        />
                                        <FaWallet className="text-2xl text-purple-600" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                                UPI / Wallet
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Pay using Google Pay, PhonePe, etc.
                                            </p>
                                        </div>
                                        {paymentMethod === 'UPI' && (
                                            <FaCheck className="text-red-500 text-lg" />
                                        )}
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sticky top-20">
                            <h2 className="text-lg sm:text-xl font-bold mb-4">Order Summary</h2>

                            {/* Cart Items Preview */}
                            {cartItems?.length > 0 ? (
                                <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
                                    {cartItems.map((item) => (
                                        <div key={item.product._id} className="flex gap-2">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Qty: {item.quantity} x ₹{item.price}
                                                </p>
                                            </div>
                                            <span className="text-xs sm:text-sm font-semibold text-gray-800">
                                                ₹{item.price * item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    Your cart is empty
                                </div>
                            )}

                            {/* Price Breakdown */}
                            <div className="space-y-2 text-sm border-t pt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Charge</span>
                                    <span className="font-semibold">
                                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                                    </span>
                                </div>
                                {deliveryCharge > 0 && subtotal < 500 && (
                                    <p className="text-xs text-green-600">
                                        Add ₹{500 - subtotal} more for FREE delivery
                                    </p>
                                )}
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between font-bold text-base sm:text-lg">
                                        <span>Total</span>
                                        <span className="text-red-500">₹{total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={!selectedAddress || loading || cartItems?.length === 0}
                                className={`
                                    w-full mt-4 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg
                                    transition transform hover:scale-[1.02] active:scale-[0.98]
                                    ${!selectedAddress || loading || cartItems?.length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                    }
                                `}
                            >
                                {loading ? 'Placing Order...' : `Place Order • ₹${total}`}
                            </button>

                            {/* Security Note */}
                            <p className="text-xs text-center text-gray-400 mt-4">
                                🔒 Your payment information is secure
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;








// // updated code for location
// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import {
//     FaArrowLeft,
//     FaMapMarkerAlt,
//     FaCreditCard,
//     FaMoneyBill,
//     FaWallet,
//     FaCheck,
//     FaPlus,
//     FaEdit,
//     FaTrash
// } from 'react-icons/fa';
// import { createOrder } from '../redux/actions/orderActions';
// import { loadCart } from '../redux/actions/cartActions';
// import addressService from '../services/addressService';
// import useDeliveryCheck from '../hooks/useDeliveryCheck'; // ✅ Import hook

// const CheckoutPage = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
    
//     const { cartItems, totalPrice, loading: cartLoading } = useSelector((state) => state.cart);
//     const { user } = useSelector((state) => state.auth);

//     // ✅ Get delivery status from hook
//     const { deliveryStatus } = useDeliveryCheck();

//     // States
//     const [step, setStep] = useState(1);
//     const [addresses, setAddresses] = useState([]);
//     const [selectedAddress, setSelectedAddress] = useState(null);
//     const [paymentMethod, setPaymentMethod] = useState('COD');
//     const [loading, setLoading] = useState(false);
//     const [showAddressForm, setShowAddressForm] = useState(false);
//     const [editingAddress, setEditingAddress] = useState(null);
//     const [formErrors, setFormErrors] = useState({});

//     // New address form
//     const [newAddress, setNewAddress] = useState({
//         type: 'home',
//         address: '',
//         landmark: '',
//         city: '',
//         pincode: '',
//         isDefault: false
//     });

//     // Calculate totals
//     const calculateTotals = () => {
//         const items = cartItems || [];
//         const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//         const deliveryCharge = subtotal > 500 ? 0 : 40;
//         const total = subtotal + deliveryCharge;
        
//         return { subtotal, deliveryCharge, total };
//     };

//     const { subtotal, deliveryCharge, total } = calculateTotals();

//     // Load addresses on mount
//     useEffect(() => {
//         fetchAddresses();
//     }, []);

//     useEffect(() => {
//         console.log('Selected address changed:', selectedAddress);
//     }, [selectedAddress]);

//     const fetchAddresses = async () => {
//         try {
//             const response = await addressService.getAddresses();
//             console.log('Fetched addresses:', response.data.data);
            
//             response.data.data.forEach((addr, index) => {
//                 console.log(`Address ${index}:`, {
//                     id: addr._id,
//                     type: addr.type,
//                     address: addr.address,
//                     city: addr.city,
//                     pincode: addr.pincode,
//                     landmark: addr.landmark,
//                     isDefault: addr.isDefault
//                 });
//             });
            
//             setAddresses(response.data.data);
//             setSelectedAddress(null);
//         } catch (error) {
//             console.error('Error fetching addresses:', error);
//         }
//     };

//     // Handle address selection
//     const handleAddressSelect = (address) => {
//         setSelectedAddress(address);
//     };

//     // Handle edit address
//     const handleEditAddress = (address) => {
//         setEditingAddress(address);
//         setNewAddress({
//             type: address.type,
//             address: address.address,
//             landmark: address.landmark || '',
//             city: address.city,
//             pincode: address.pincode,
//             isDefault: address.isDefault || false
//         });
//         setShowAddressForm(true);
//     };

//     // Handle delete address
//     const handleDeleteAddress = async (addressId) => {
//         if (!window.confirm('Are you sure you want to delete this address?')) {
//             return;
//         }

//         try {
//             setLoading(true);
//             await addressService.deleteAddress(addressId);
            
//             const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
//             setAddresses(updatedAddresses);
            
//             if (selectedAddress?._id === addressId) {
//                 setSelectedAddress(null);
//             }
//         } catch (error) {
//             console.error('Error deleting address:', error);
//             alert('Failed to delete address. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle address form input
//     const handleAddressInput = (e) => {
//         const { name, value, type, checked } = e.target;
//         setNewAddress(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//         if (formErrors[name]) {
//             setFormErrors(prev => ({ ...prev, [name]: null }));
//         }
//     };

//     // Validate address form
//     const validateAddressForm = () => {
//         const errors = {};

//         if (!newAddress.address.trim()) {
//             errors.address = 'Address is required';
//         }
//         if (!newAddress.city.trim()) {
//             errors.city = 'City is required';
//         }
//         if (!newAddress.pincode.trim()) {
//             errors.pincode = 'Pincode is required';
//         } else if (!/^\d{6}$/.test(newAddress.pincode)) {
//             errors.pincode = 'Pincode must be 6 digits';
//         }

//         return errors;
//     };

//     // Add or update address
//     const handleSaveAddress = async (e) => {
//         e.preventDefault();

//         const errors = validateAddressForm();
//         if (Object.keys(errors).length > 0) {
//             setFormErrors(errors);
//             return;
//         }

//         try {
//             setLoading(true);
            
//             let response;
//             if (editingAddress) {
//                 console.log('Updating address:', editingAddress._id, newAddress);
//                 response = await addressService.updateAddress(editingAddress._id, newAddress);
//             } else {
//                 console.log('Adding new address:', newAddress);
//                 response = await addressService.addAddress(newAddress);
//             }

//             console.log('Address save response:', response.data);

//             await fetchAddresses();
            
//             if (response.data && response.data.data) {
//                 setSelectedAddress(response.data.data);
//             }
            
//             resetAddressForm();
            
//         } catch (error) {
//             console.error('Error saving address:', error);
//             console.error('Error response:', error.response?.data);
//             alert(error.response?.data?.message || 'Failed to save address. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Reset address form
//     const resetAddressForm = () => {
//         setShowAddressForm(false);
//         setEditingAddress(null);
//         setNewAddress({
//             type: 'home',
//             address: '',
//             landmark: '',
//             city: '',
//             pincode: '',
//             isDefault: false
//         });
//         setFormErrors({});
//     };

//     // Cancel address form
//     const handleCancelAddress = () => {
//         resetAddressForm();
//     };

//     const validateSelectedAddress = () => {
//         if (!selectedAddress) {
//             alert('Please select a delivery address');
//             return false;
//         }

//         console.log('Validating selected address:', selectedAddress);

//         const requiredFields = {
//             address: 'Address',
//             city: 'City',
//             pincode: 'Pincode'
//         };

//         for (const [field, label] of Object.entries(requiredFields)) {
//             if (!selectedAddress[field] || selectedAddress[field].trim() === '') {
//                 alert(`Selected address is missing ${label}. Please choose another address or edit this one.`);
//                 return false;
//             }
//         }

//         if (!/^\d{6}$/.test(selectedAddress.pincode)) {
//             alert('Invalid pincode format in selected address. Please use a 6-digit pincode.');
//             return false;
//         }

//         return true;
//     };

//     // ✅ STEP 7: Updated handlePlaceOrder with delivery check
//     const handlePlaceOrder = async () => {
//         // Validate address
//         if (!validateSelectedAddress()) {
//             return;
//         }

//         // ✅ Check delivery availability
//         if (deliveryStatus.isDeliverable === false) {
//             const errorMsg = `Delivery not available in your area. We currently deliver within ${deliveryStatus.maxDistance || 10}km radius.`;
//             alert(errorMsg);
//             return;
//         }

//         // Show warning if delivery check is still loading
//         if (deliveryStatus.loading) {
//             alert('Please wait while we check delivery availability for your location.');
//             return;
//         }

//         // Show warning if location not detected
//         if (deliveryStatus.isDeliverable === null) {
//             alert('Please allow location access or select your location to check delivery availability.');
//             return;
//         }

//         try {
//             setLoading(true);

//             const orderData = {
//                 shippingAddress: {
//                     fullName: user?.name || 'Customer',
//                     phone: user?.phone || '',
//                     address: selectedAddress.address,
//                     landmark: selectedAddress.landmark || '',
//                     city: selectedAddress.city,
//                     pincode: selectedAddress.pincode,
//                     type: selectedAddress.type || 'home'
//                 },
//                 paymentMethod,
//                 itemsPrice: subtotal,
//                 deliveryPrice: deliveryCharge,
//                 totalPrice: total,
//                 notes: ''
//             };

//             console.log('📦 Order Data:', orderData);

//             const result = await dispatch(createOrder(orderData));
            
//             if (result && result._id) {
//                 if (result.whatsappUrl) {
//                     window.open(result.whatsappUrl, '_blank');
//                 }
//                 navigate(`/order-success/${result._id}`);
//             }
            
//         } catch (error) {
//             console.error('❌ Order error:', error);
//             alert(error.response?.data?.message || 'Failed to place order. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Address Type Icon
//     const getAddressIcon = (type) => {
//         switch (type) {
//             case 'home': return '🏠';
//             case 'work': return '💼';
//             default: return '📍';
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
//             <div className="container mx-auto px-4 max-w-6xl">

//                 {/* Header with Back Button */}
//                 <div className="flex items-center gap-3 mb-4 sm:mb-6">
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="p-2 hover:bg-white rounded-full transition"
//                     >
//                         <FaArrowLeft className="text-gray-600 text-lg" />
//                     </button>
//                     <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
//                         Checkout
//                     </h1>
//                 </div>

//                 {/* Delivery Status Banner (Optional) */}
//                 {deliveryStatus.isDeliverable === false && (
//                     <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
//                         ⚠️ Delivery not available in your area. Maximum delivery radius is {deliveryStatus.maxDistance || 10}km.
//                     </div>
//                 )}

//                 {/* Progress Steps */}
//                 <div className="flex justify-between mb-6 sm:mb-8 px-2">
//                     {[1, 2, 3].map((s) => (
//                         <div key={s} className="flex-1 text-center">
//                             <div className={`
//                                 w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full flex items-center justify-center font-semibold text-sm sm:text-base
//                                 ${step >= s ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}
//                             `}>
//                                 {step > s ? '✓' : s}
//                             </div>
//                             <p className="text-xs sm:text-sm mt-1 text-gray-600">
//                                 {s === 1 && 'Address'}
//                                 {s === 2 && 'Payment'}
//                                 {s === 3 && 'Confirm'}
//                             </p>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">

//                     {/* Left Column - Main Form */}
//                     <div className="lg:w-2/3 space-y-4 sm:space-y-6">

//                         {/* Step 1: Address Selection */}
//                         <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
//                             <div className="flex items-center justify-between mb-4">
//                                 <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
//                                     <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">
//                                         1
//                                     </span>
//                                     Delivery Address
//                                 </h2>
//                                 <button
//                                     onClick={() => {
//                                         resetAddressForm();
//                                         setShowAddressForm(true);
//                                     }}
//                                     className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm sm:text-base"
//                                 >
//                                     <FaPlus className="text-xs" />
//                                     <span>Add New</span>
//                                 </button>
//                             </div>

//                             {/* Address List */}
//                             {addresses.length > 0 ? (
//                                 <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
//                                     {addresses.map((addr) => (
//                                         <div
//                                             key={addr._id}
//                                             className={`
//                                                 border rounded-xl p-3 sm:p-4 transition-all
//                                                 ${selectedAddress?._id === addr._id
//                                                     ? 'border-red-500 bg-red-50 shadow-md'
//                                                     : 'border-gray-200'
//                                                 }
//                                             `}
//                                         >
//                                             <div className="flex items-start gap-3">
//                                                 <div 
//                                                     className="flex-1 cursor-pointer"
//                                                     onClick={() => handleAddressSelect(addr)}
//                                                 >
//                                                     <div className="flex items-start gap-3">
//                                                         <div className="text-2xl">
//                                                             {getAddressIcon(addr.type)}
//                                                         </div>
//                                                         <div className="flex-1">
//                                                             <div className="flex items-center gap-2 mb-1">
//                                                                 <span className="font-semibold text-gray-800 text-sm sm:text-base capitalize">
//                                                                     {addr.type}
//                                                                 </span>
//                                                                 {addr.isDefault && (
//                                                                     <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
//                                                                         Default
//                                                                     </span>
//                                                                 )}
//                                                             </div>
//                                                             <p className="text-xs sm:text-sm text-gray-600 mb-1">
//                                                                 {addr.address}
//                                                             </p>
//                                                             {addr.landmark && (
//                                                                 <p className="text-xs text-gray-500">
//                                                                     Landmark: {addr.landmark}
//                                                                 </p>
//                                                             )}
//                                                             <p className="text-xs text-gray-500">
//                                                                 {addr.city} - {addr.pincode}
//                                                             </p>
//                                                         </div>
//                                                     </div>
//                                                 </div>
                                                
//                                                 {/* Action Buttons */}
//                                                 <div className="flex gap-1">
//                                                     <button
//                                                         onClick={() => handleEditAddress(addr)}
//                                                         className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition"
//                                                         title="Edit address"
//                                                     >
//                                                         <FaEdit />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleDeleteAddress(addr._id)}
//                                                         className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition"
//                                                         title="Delete address"
//                                                     >
//                                                         <FaTrash />
//                                                     </button>
//                                                     {selectedAddress?._id === addr._id && (
//                                                         <FaCheck className="text-red-500 text-lg shrink-0 ml-2" />
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-8 bg-gray-50 rounded-lg">
//                                     <p className="text-gray-500">No saved addresses yet</p>
//                                     <p className="text-sm text-gray-400 mt-1">Add your first delivery address</p>
//                                 </div>
//                             )}

//                             {/* Add/Edit Address Form */}
//                             {showAddressForm && (
//                                 <form onSubmit={handleSaveAddress} className="mt-4 border-t pt-4">
//                                     <h3 className="font-semibold text-gray-700 mb-3">
//                                         {editingAddress ? 'Edit Address' : 'Add New Address'}
//                                     </h3>

//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                                         {/* Address Type */}
//                                         <div className="sm:col-span-2">
//                                             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                                                 Address Type
//                                             </label>
//                                             <div className="flex gap-3">
//                                                 {['home', 'work', 'other'].map((type) => (
//                                                     <label key={type} className="flex items-center gap-1">
//                                                         <input
//                                                             type="radio"
//                                                             name="type"
//                                                             value={type}
//                                                             checked={newAddress.type === type}
//                                                             onChange={handleAddressInput}
//                                                             className="text-red-500"
//                                                             required
//                                                         />
//                                                         <span className="text-xs sm:text-sm capitalize">{type}</span>
//                                                     </label>
//                                                 ))}
//                                             </div>
//                                         </div>

//                                         {/* Address Line */}
//                                         <div className="sm:col-span-2">
//                                             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                                                 Address *
//                                             </label>
//                                             <textarea
//                                                 name="address"
//                                                 value={newAddress.address}
//                                                 onChange={handleAddressInput}
//                                                 rows="2"
//                                                 className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 ${
//                                                     formErrors.address ? 'border-red-500' : 'border-gray-300'
//                                                 }`}
//                                                 required
//                                                 placeholder="Enter your full address"
//                                             />
//                                             {formErrors.address && (
//                                                 <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>
//                                             )}
//                                         </div>

//                                         {/* Landmark */}
//                                         <div>
//                                             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                                                 Landmark
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 name="landmark"
//                                                 value={newAddress.landmark}
//                                                 onChange={handleAddressInput}
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                                                 placeholder="Near..."
//                                             />
//                                         </div>

//                                         {/* City */}
//                                         <div>
//                                             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                                                 City *
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 name="city"
//                                                 value={newAddress.city}
//                                                 onChange={handleAddressInput}
//                                                 className={`w-full px-3 py-2 border rounded-lg text-sm ${
//                                                     formErrors.city ? 'border-red-500' : 'border-gray-300'
//                                                 }`}
//                                                 required
//                                                 placeholder="e.g., Bangalore"
//                                             />
//                                             {formErrors.city && (
//                                                 <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>
//                                             )}
//                                         </div>

//                                         {/* Pincode */}
//                                         <div>
//                                             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                                                 Pincode *
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 name="pincode"
//                                                 value={newAddress.pincode}
//                                                 onChange={handleAddressInput}
//                                                 maxLength="6"
//                                                 className={`w-full px-3 py-2 border rounded-lg text-sm ${
//                                                     formErrors.pincode ? 'border-red-500' : 'border-gray-300'
//                                                 }`}
//                                                 required
//                                                 placeholder="6-digit pincode"
//                                             />
//                                             {formErrors.pincode && (
//                                                 <p className="text-xs text-red-500 mt-1">{formErrors.pincode}</p>
//                                             )}
//                                         </div>

//                                         {/* Default Address Checkbox */}
//                                         <div className="flex items-center">
//                                             <input
//                                                 type="checkbox"
//                                                 name="isDefault"
//                                                 checked={newAddress.isDefault}
//                                                 onChange={handleAddressInput}
//                                                 className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
//                                             />
//                                             <label className="ml-2 text-xs sm:text-sm text-gray-700">
//                                                 Set as default address
//                                             </label>
//                                         </div>
//                                     </div>

//                                     <div className="flex gap-2 mt-4">
//                                         <button
//                                             type="submit"
//                                             disabled={loading}
//                                             className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
//                                         >
//                                             {loading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}
//                                         </button>
//                                         <button
//                                             type="button"
//                                             onClick={handleCancelAddress}
//                                             className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
//                                         >
//                                             Cancel
//                                         </button>
//                                     </div>
//                                 </form>
//                             )}
//                         </div>

//                         {/* Step 2: Payment Method */}
//                         {selectedAddress && (
//                             <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
//                                 <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-4">
//                                     <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">
//                                         2
//                                     </span>
//                                     Payment Method
//                                 </h2>

//                                 <div className="space-y-3">
//                                     {/* Cash on Delivery */}
//                                     <label className={`
//                                         flex items-center gap-3 p-3 sm:p-4 border rounded-xl cursor-pointer transition
//                                         ${paymentMethod === 'COD'
//                                             ? 'border-red-500 bg-red-50'
//                                             : 'border-gray-200 hover:border-red-300'
//                                         }
//                                     `}>
//                                         <input
//                                             type="radio"
//                                             name="payment"
//                                             value="COD"
//                                             checked={paymentMethod === 'COD'}
//                                             onChange={(e) => setPaymentMethod(e.target.value)}
//                                             className="w-4 h-4 text-red-500"
//                                         />
//                                         <FaMoneyBill className="text-2xl text-green-600" />
//                                         <div className="flex-1">
//                                             <p className="font-semibold text-gray-800 text-sm sm:text-base">
//                                                 Cash on Delivery
//                                             </p>
//                                             <p className="text-xs text-gray-500">
//                                                 Pay when you receive your order
//                                             </p>
//                                         </div>
//                                         {paymentMethod === 'COD' && (
//                                             <FaCheck className="text-red-500 text-lg" />
//                                         )}
//                                     </label>

//                                     {/* Card Payment */}
//                                     <label className={`
//                                         flex items-center gap-3 p-3 sm:p-4 border rounded-xl cursor-pointer transition
//                                         ${paymentMethod === 'CARD'
//                                             ? 'border-red-500 bg-red-50'
//                                             : 'border-gray-200 hover:border-red-300'
//                                         }
//                                     `}>
//                                         <input
//                                             type="radio"
//                                             name="payment"
//                                             value="CARD"
//                                             checked={paymentMethod === 'CARD'}
//                                             onChange={(e) => setPaymentMethod(e.target.value)}
//                                             className="w-4 h-4 text-red-500"
//                                         />
//                                         <FaCreditCard className="text-2xl text-blue-600" />
//                                         <div className="flex-1">
//                                             <p className="font-semibold text-gray-800 text-sm sm:text-base">
//                                                 Credit/Debit Card
//                                             </p>
//                                             <p className="text-xs text-gray-500">
//                                                 Pay securely with card
//                                             </p>
//                                         </div>
//                                         {paymentMethod === 'CARD' && (
//                                             <FaCheck className="text-red-500 text-lg" />
//                                         )}
//                                     </label>

//                                     {/* UPI / Wallet */}
//                                     <label className={`
//                                         flex items-center gap-3 p-3 sm:p-4 border rounded-xl cursor-pointer transition
//                                         ${paymentMethod === 'UPI'
//                                             ? 'border-red-500 bg-red-50'
//                                             : 'border-gray-200 hover:border-red-300'
//                                         }
//                                     `}>
//                                         <input
//                                             type="radio"
//                                             name="payment"
//                                             value="UPI"
//                                             checked={paymentMethod === 'UPI'}
//                                             onChange={(e) => setPaymentMethod(e.target.value)}
//                                             className="w-4 h-4 text-red-500"
//                                         />
//                                         <FaWallet className="text-2xl text-purple-600" />
//                                         <div className="flex-1">
//                                             <p className="font-semibold text-gray-800 text-sm sm:text-base">
//                                                 UPI / Wallet
//                                             </p>
//                                             <p className="text-xs text-gray-500">
//                                                 Pay using Google Pay, PhonePe, etc.
//                                             </p>
//                                         </div>
//                                         {paymentMethod === 'UPI' && (
//                                             <FaCheck className="text-red-500 text-lg" />
//                                         )}
//                                     </label>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Right Column - Order Summary */}
//                     <div className="lg:w-1/3">
//                         <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sticky top-20">
//                             <h2 className="text-lg sm:text-xl font-bold mb-4">Order Summary</h2>

//                             {/* Cart Items Preview */}
//                             {cartItems?.length > 0 ? (
//                                 <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
//                                     {cartItems.map((item) => (
//                                         <div key={item.product._id} className="flex gap-2">
//                                             <img
//                                                 src={item.image}
//                                                 alt={item.name}
//                                                 className="w-12 h-12 object-cover rounded-lg"
//                                             />
//                                             <div className="flex-1">
//                                                 <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1">
//                                                     {item.name}
//                                                 </p>
//                                                 <p className="text-xs text-gray-500">
//                                                     Qty: {item.quantity} x ₹{item.price}
//                                                 </p>
//                                             </div>
//                                             <span className="text-xs sm:text-sm font-semibold text-gray-800">
//                                                 ₹{item.price * item.quantity}
//                                             </span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-4 text-gray-500">
//                                     Your cart is empty
//                                 </div>
//                             )}

//                             {/* Price Breakdown */}
//                             <div className="space-y-2 text-sm border-t pt-4">
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Subtotal</span>
//                                     <span className="font-semibold">₹{subtotal}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Delivery Charge</span>
//                                     <span className="font-semibold">
//                                         {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
//                                     </span>
//                                 </div>
//                                 {deliveryCharge > 0 && subtotal < 500 && (
//                                     <p className="text-xs text-green-600">
//                                         Add ₹{500 - subtotal} more for FREE delivery
//                                     </p>
//                                 )}
//                                 <div className="border-t pt-2 mt-2">
//                                     <div className="flex justify-between font-bold text-base sm:text-lg">
//                                         <span>Total</span>
//                                         <span className="text-red-500">₹{total}</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Place Order Button */}
//                             <button
//                                 onClick={handlePlaceOrder}
//                                 disabled={!selectedAddress || loading || cartItems?.length === 0}
//                                 className={`
//                                     w-full mt-4 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg
//                                     transition transform hover:scale-[1.02] active:scale-[0.98]
//                                     ${!selectedAddress || loading || cartItems?.length === 0
//                                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                         : 'bg-red-500 hover:bg-red-600 text-white'
//                                     }
//                                 `}
//                             >
//                                 {loading ? 'Placing Order...' : 'Place Order • ₹' + total}
//                             </button>

//                             {/* Security Note */}
//                             <p className="text-xs text-center text-gray-400 mt-4">
//                                 🔒 Your payment information is secure
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CheckoutPage;