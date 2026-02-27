import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaCreditCard,
    FaMoneyBill,
    FaWallet,
    FaTruck,
    FaPlus,
    FaCheck,
    FaEdit,
    FaTrash
} from 'react-icons/fa';
import { createOrder } from '../redux/actions/orderActions';
import { loadCart } from '../redux/actions/cartActions';
import addressService from '../services/addressService';

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems, totalPrice } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    // States
    const [step, setStep] = useState(1); // 1: address, 2: payment, 3: confirm
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);


    // ✅ DEBUG CODE - Exactly yahan pe dalo
  useEffect(() => {
    console.log('========== ADDRESS DEBUG ==========');
    console.log('📍 Selected Address:', selectedAddress);
    console.log('📍 Address ID:', selectedAddress?._id);
    console.log('📍 Type:', selectedAddress?.type);
    console.log('📍 Address Line:', selectedAddress?.address);
    console.log('📍 Landmark:', selectedAddress?.landmark);
    console.log('📍 City:', selectedAddress?.city);
    console.log('📍 PINCODE:', selectedAddress?.pincode);  // 👈 Check if this exists
    console.log('📍 Is Default:', selectedAddress?.isDefault);
    console.log('====================================');
  }, [selectedAddress]);


    // New address form
    const [newAddress, setNewAddress] = useState({
        type: 'home',
        address: '',
        landmark: '',
        city: 'Bangalore',
        pincode: '',
        isDefault: false
    });

    // Delivery charge calculation
    const subtotal = totalPrice || 0;
    const deliveryCharge = subtotal > 500 ? 0 : 40;
    const total = subtotal + deliveryCharge;

    // Load addresses on mount
    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await addressService.getAddresses();
            setAddresses(response.data.data);

            // Set default address as selected
            const defaultAddr = response.data.data.find(addr => addr.isDefault);
            if (defaultAddr) {
                setSelectedAddress(defaultAddr);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    // Handle address selection
    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
    };

    // Handle address form input
const handleAddressInput = (e) => {
  const { name, value, type, checked } = e.target;
  setNewAddress(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
};

    // Add new address
const handleAddAddress = async (e) => {
  e.preventDefault();
  
  // ✅ Validate all required fields
  if (!newAddress.address) {
    alert('Please enter address');
    return;
  }
  if (!newAddress.city) {
    alert('Please enter city');
    return;
  }
  if (!newAddress.pincode || newAddress.pincode.length !== 6) {
    alert('Please enter a valid 6-digit pincode');
    return;
  }
  
  try {
    setLoading(true);
    const response = await addressService.addAddress(newAddress);
    setAddresses([...addresses, response.data.data]);
    setShowAddressForm(false);
    setNewAddress({
      type: 'home',
      address: '',
      landmark: '',
      city: 'Bangalore',
      pincode: '',
      isDefault: false
    });
  } catch (error) {
    console.error('Error adding address:', error);
    alert('Failed to add address. Please try again.');
  } finally {
    setLoading(false);
  }
};

    // Place order
    // const handlePlaceOrder = async () => {
    //     if (!selectedAddress) {
    //         alert('Please select a delivery address');
    //         return;
    //     }

    //     // ✅ Validate pincode
    //     if (!selectedAddress.pincode) {
    //         alert('Selected address is missing pincode. Please add pincode.');
    //         return;
    //     }

    //     try {
    //         setLoading(true);

    //         // ✅ Complete order data
    //         const orderData = {
    //             shippingAddress: {
    //                 fullName: user?.name || 'Customer',
    //                 phone: user?.phone || '',
    //                 address: selectedAddress.address,
    //                 landmark: selectedAddress.landmark || '',
    //                 city: selectedAddress.city || 'Bangalore',
    //                 pincode: selectedAddress.pincode,
    //                 type: selectedAddress.type || 'home'
    //             },
    //             paymentMethod,
    //             itemsPrice: subtotal,
    //             deliveryPrice: deliveryCharge,
    //             totalPrice: total,
    //             notes: '' // Optional
    //         };

    //         console.log('📦 Sending order data:', orderData);

    //         const result = await dispatch(createOrder(orderData));

    //         if (result && result._id) {
    //             navigate(`/order-success/${result._id}`);
    //         } else {
    //             throw new Error('Order created but no ID returned');
    //         }

    //     } catch (error) {
    //         console.error('❌ Order error:', error);
    //         alert(error.response?.data?.message || 'Failed to place order. Please try again.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handlePlaceOrder = async () => {
  if (!selectedAddress) {
    alert('Please select a delivery address');
    return;
  }

  // ✅ Bangalore-specific pincodes
  const getBangalorePincode = (area) => {
    const areaLower = area?.toLowerCase() || '';
    
    // Bangalore area-wise pincode mapping
    const pincodeMap = {
      // South Bangalore
      'jayanagar': '560041',
      'jp nagar': '560078',
      'banashankari': '560050',
      'basavanagudi': '560004',
      'kumaraswamy layout': '560078',
      'padmanabhanagar': '560070',
      'yelahanka': '560064',
      
      // East Bangalore
      'indiranagar': '560038',
      'kormangala': '560095',
      'marathahalli': '560037',
      'whitefield': '560066',
      'hoodi': '560048',
      'mahadevapura': '560048',
      'cv raman nagar': '560093',
      
      // West Bangalore
      'rajajinagar': '560010',
      'malleshwaram': '560003',
      'vijayanagar': '560040',
      'nagasandra': '560073',
      'peenya': '560058',
      
      // North Bangalore
      'hebbal': '560024',
      'yeswanthpur': '560022',
      'dasarahalli': '560057',
      'jalahalli': '560013',
      
      // Central Bangalore
      'mg road': '560001',
      'brigade road': '560001',
      'commercial street': '560001',
      'church street': '560001',
      'shivaji nagar': '560051',
      'fraser town': '560005',
      
      // Electronic City
      'electronic city': '560100',
      'bommanahalli': '560068',
      
      // Other areas
      'koramangala': '560034',
      'btm layout': '560076',
      'hsr layout': '560102',
      'bellandur': '560103',
      'sarjapur': '560035',
      'kengeri': '560060',
      'rr nagar': '560098',
      'nagarbhavi': '560072',
      'magadi road': '560023',
      'tumkur road': '560022',
      'mysore road': '560026',
      'kanakapura road': '560062',
      
      // Default Bangalore pincode
      'default': '560001'
    };

    // Check which area matches
    for (let [key, value] of Object.entries(pincodeMap)) {
      if (areaLower.includes(key)) {
        return value;
      }
    }
    
    return pincodeMap.default;
  };

  // ✅ Extract area from address
  const extractArea = (address) => {
    const addressLower = address?.toLowerCase() || '';
    
    // Common Bangalore areas
    const areas = [
      'jayanagar', 'jp nagar', 'banashankari', 'basavanagudi', 'indiranagar',
      'kormangala', 'marathahalli', 'whitefield', 'rajajinagar', 'malleshwaram',
      'vijayanagar', 'hebbal', 'yeswanthpur', 'mg road', 'electronic city',
      'koramangala', 'btm layout', 'hsr layout', 'bellandur', 'sarjapur'
    ];
    
    for (let area of areas) {
      if (addressLower.includes(area)) {
        return area;
      }
    }
    
    return 'bangalore'; // Default
  };

  // ✅ Set city to Bangalore if not specified
  const addressWithDefaults = {
    ...selectedAddress,
    city: 'Bangalore', // Force Bangalore as city
    pincode: selectedAddress.pincode || getBangalorePincode(extractArea(selectedAddress.address))
  };

  console.log('📍 Bangalore Address:', addressWithDefaults);

  try {
    setLoading(true);
    
    const orderData = {
      shippingAddress: {
        fullName: user?.name || 'Customer',
        phone: user?.phone || '',
        address: addressWithDefaults.address,
        landmark: addressWithDefaults.landmark || '',
        city: 'Bangalore', // Always Bangalore
        pincode: addressWithDefaults.pincode,
        type: addressWithDefaults.type || 'home'
      },
      paymentMethod,
      itemsPrice: subtotal,
      deliveryPrice: deliveryCharge,
      totalPrice: total
    };

    console.log('📦 Order Data:', orderData);

    const result = await dispatch(createOrder(orderData));
    
    if (result && result._id) {
      navigate(`/order-success/${result._id}`);
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

                {/* Progress Steps - Mobile Friendly */}
                <div className="flex justify-between mb-6 sm:mb-8 px-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex-1 text-center">
                            <div className={`
                w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full flex items-center justify-center font-semibold text-sm sm:text-base
                ${step >= s
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }
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
                                    onClick={() => setShowAddressForm(!showAddressForm)}
                                    className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm sm:text-base"
                                >
                                    <FaPlus className="text-xs" />
                                    <span>Add New</span>
                                </button>
                            </div>

                            {/* Address List */}
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {addresses.map((addr) => (
                                    <div
                                        key={addr._id}
                                        onClick={() => handleAddressSelect(addr)}
                                        className={`
                      border rounded-xl p-3 sm:p-4 cursor-pointer transition-all
                      ${selectedAddress?._id === addr._id
                                                ? 'border-red-500 bg-red-50 shadow-md'
                                                : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                                            }
                    `}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl">
                                                {getAddressIcon(addr.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                                        {addr.type === 'home' ? 'Home' : addr.type === 'work' ? 'Work' : 'Other'}
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
                                            {selectedAddress?._id === addr._id && (
                                                <FaCheck className="text-red-500 text-lg" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add New Address Form */}
                            {showAddressForm && (
                               // Add New Address Form - Ensure these fields are present
<form onSubmit={handleAddAddress} className="mt-4 border-t pt-4">
  <h3 className="font-semibold text-gray-700 mb-3">Add New Address</h3>
  
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
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
        required
        placeholder="Enter your full address"
      />
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
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
        placeholder="Near..."
      />
    </div>

    {/* City - REQUIRED */}
    <div>
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
        City *
      </label>
      <input
        type="text"
        name="city"
        value={newAddress.city}
        onChange={handleAddressInput}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
        required
        placeholder="e.g., Bangalore"
      />
    </div>

    {/* Pincode - REQUIRED */}
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
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
        required
        placeholder="6-digit pincode"
      />
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
      {loading ? 'Saving...' : 'Save Address'}
    </button>
    <button
      type="button"
      onClick={() => setShowAddressForm(false)}
      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
    >
      Cancel
    </button>
  </div>
</form>
                            )}
                        </div>

                        {/* Step 2: Payment Method (shown after address selection) */}
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
                            <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
                                {cartItems?.map((item) => (
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
                                {deliveryCharge > 0 && (
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
                                disabled={!selectedAddress || loading}
                                className={`
                  w-full mt-4 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg
                  transition transform hover:scale-[1.02] active:scale-[0.98]
                  ${!selectedAddress || loading
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                    }
                `}
                            >
                                {loading ? 'Placing Order...' : 'Place Order • ₹' + total}
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