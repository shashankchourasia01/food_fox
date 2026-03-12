// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { FaArrowLeft, FaUser, FaPhone, FaLock, FaWhatsapp } from 'react-icons/fa';
// import { MdMessage, MdTimer } from 'react-icons/md';
// import { sendOTP, verifyOTP, resendOTP } from '../services/api';

// const LoginPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Form states
//   const [step, setStep] = useState(1); // 1: name, 2: phone, 3: otp
//   // const [formData, setFormData] = useState({
//   //   name: '',
//   //   phone: '',
//   //   otp: ['', '', '', ''] // 4 digit OTP
//   // });

//   // NEW CODE (6 digits)
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     otp: ['', '', '', '', '', ''] // 6 digits ✅
//   });

//   // UI states
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // OTP timer states
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);

//   // Timer for OTP resend
//   useEffect(() => {
//     let interval;
//     if (otpSent && timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//     } else if (timer === 0) {
//       setCanResend(true);
//     }
//     return () => clearInterval(interval);
//   }, [otpSent, timer]);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error when user types
//     setError('');
//   };

//   // Handle OTP input
//   const handleOTPChange = (index, value) => {
//     if (value.length > 1) return; // Only single digit

//     const newOTP = [...formData.otp];
//     newOTP[index] = value;
//     setFormData(prev => ({
//       ...prev,
//       otp: newOTP
//     }));

//     // Auto-focus next input
//     if (value && index < 3) {
//       const nextInput = document.getElementById(`otp-${index + 1}`);
//       if (nextInput) nextInput.focus();
//     }
//   };

//   // Handle OTP keydown (backspace)
//   const handleOTPKeyDown = (index, e) => {
//     if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
//       const prevInput = document.getElementById(`otp-${index - 1}`);
//       if (prevInput) prevInput.focus();
//     }
//   };

//   // Handle send OTP
//   const handleSendOTP = async () => {
//     // Validate phone
//     if (formData.phone.length !== 10) {
//       setError('Please enter a valid 10-digit phone number');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await sendOTP({
//         name: formData.name,
//         phone: formData.phone
//       });

//       console.log('OTP sent:', response.data);

//       setSuccess('OTP sent successfully!');
//       setOtpSent(true);
//       setStep(3);
//       setTimer(30);
//       setCanResend(false);

//       // For development - auto-fill OTP if returned
//       if (response.data.data?.testOTP) {
//         const testOTP = response.data.data.testOTP.split('');
//         setFormData(prev => ({
//           ...prev,
//           otp: testOTP
//         }));
//       }

//     } catch (error) {
//       console.error('Send OTP error:', error);
//       setError(error.response?.data?.message || 'Failed to send OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle verify OTP
//   const handleVerifyOTP = async () => {
//     const otpString = formData.otp.join('');

//     if (otpString.length !== 4) {
//       setError('Please enter complete OTP');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await verifyOTP({
//         phone: formData.phone,
//         otp: otpString
//       });

//       console.log('Login success:', response.data);

//       // Save token and user data to localStorage
//       localStorage.setItem('token', response.data.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.data.user));

//       setSuccess('Login successful! Redirecting...');

//       // Redirect to home page after 1 second
//       setTimeout(() => {
//         navigate('/');
//       }, 1000);

//     } catch (error) {
//       console.error('Verify OTP error:', error);
//       setError(error.response?.data?.message || 'Invalid OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle resend OTP
//   const handleResend = async () => {
//     if (!canResend) return;

//     setLoading(true);
//     setError('');

//     try {
//       await resendOTP(formData.phone);

//       setSuccess('OTP resent successfully!');
//       setTimer(30);
//       setCanResend(false);

//     } catch (error) {
//       console.error('Resend OTP error:', error);
//       setError(error.response?.data?.message || 'Failed to resend OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle next step from name to phone
//   const handleNextFromName = () => {
//     if (!formData.name.trim()) {
//       setError('Please enter your name');
//       return;
//     }
//     setStep(2);
//     setError('');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-6 sm:py-8">
//       <div className="container mx-auto px-4">
//         {/* Header with Back Button */}
//         <div className="flex items-center gap-4 mb-6">
//           <button
//             onClick={() => {
//               if (step === 1) {
//                 navigate(-1);
//               } else {
//                 setStep(step - 1);
//                 setError('');
//               }
//             }}
//             className="p-2 hover:bg-white rounded-full transition"
//           >
//             <FaArrowLeft className="text-gray-600" />
//           </button>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
//             {step === 1 && "What's your name?"}
//             {step === 2 && "Your phone number?"}
//             {step === 3 && "Verify OTP"}
//           </h1>
//         </div>

//         {/* Error/Success Messages */}
//         {error && (
//           <div className="max-w-md mx-auto mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
//             ❌ {error}
//           </div>
//         )}
//         {success && (
//           <div className="max-w-md mx-auto mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
//             ✅ {success}
//           </div>
//         )}

//         {/* Main Card */}
//         <div className="max-w-md mx-auto">
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

//             {/* Progress Bar */}
//             <div className="h-1 bg-gray-100">
//               <div
//                 className="h-full bg-red-500 transition-all duration-500"
//                 style={{ width: `${(step / 3) * 100}%` }}
//               ></div>
//             </div>

//             {/* Content */}
//             <div className="p-6 sm:p-8">

//               {/* Step 1: Name Input */}
//               {step === 1 && (
//                 <div className="space-y-6">
//                   <div className="text-center mb-8">
//                     <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
//                       <FaUser className="text-4xl text-red-500" />
//                     </div>
//                     <p className="text-gray-600">
//                       Please enter your name to continue
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Your Name
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       placeholder="e.g., John Doe"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                       autoFocus
//                     />
//                   </div>

//                   <button
//                     onClick={handleNextFromName}
//                     disabled={!formData.name.trim()}
//                     className={`w-full py-4 rounded-xl font-semibold text-lg transition
//                       ${formData.name.trim()
//                         ? 'bg-red-500 hover:bg-red-600 text-white transform hover:scale-[1.02]'
//                         : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
//                   >
//                     Continue
//                   </button>
//                 </div>
//               )}

//               {/* Step 2: Phone Input */}
//               {step === 2 && (
//                 <div className="space-y-6">
//                   <div className="text-center mb-8">
//                     <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
//                       <FaPhone className="text-4xl text-red-500" />
//                     </div>
//                     <p className="text-gray-600">
//                       We'll send a 4-digit OTP to verify
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Phone Number
//                     </label>
//                     <div className="flex">
//                       <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
//                         +91
//                       </span>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         placeholder="9876543210"
//                         maxLength="10"
//                         className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                         autoFocus
//                       />
//                     </div>
//                     <p className="text-xs text-gray-500 mt-2">
//                       Enter 10-digit mobile number
//                     </p>
//                   </div>

//                   <button
//                     onClick={handleSendOTP}
//                     disabled={formData.phone.length !== 10 || loading}
//                     className={`w-full py-4 rounded-xl font-semibold text-lg transition
//                       ${formData.phone.length === 10 && !loading
//                         ? 'bg-red-500 hover:bg-red-600 text-white transform hover:scale-[1.02]'
//                         : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
//                   >
//                     {loading ? 'Sending...' : 'Send OTP'}
//                   </button>
//                 </div>
//               )}

//               {/* Step 3: OTP Verification */}
//               {step === 3 && (
//                 <div className="space-y-6">
//                   <div className="text-center mb-8">
//                     <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
//                       <FaLock className="text-4xl text-red-500" />
//                     </div>
//                     <p className="text-gray-600">
//                       Enter 4-digit OTP sent to
//                     </p>
//                     <p className="font-semibold text-gray-800">
//                       +91 {formData.phone}
//                     </p>
//                   </div>

//                   {/* OTP Input Boxes */}
//                   {/* <div className="flex justify-center gap-3">
//                     {[0, 1, 2, 3].map((index) => (
//                       <input
//                         key={index}
//                         id={`otp-${index}`}
//                         type="text"
//                         maxLength="1"
//                         value={formData.otp[index]}
//                         onChange={(e) => handleOTPChange(index, e.target.value)}
//                         onKeyDown={(e) => handleOTPKeyDown(index, e)}
//                         className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
//                         autoFocus={index === 0}
//                       />
//                     ))}
//                   </div> */}


//                   {/* NEW CODE - 6 boxes */}
//                   <div className="flex justify-center gap-2 sm:gap-3">
//                     {[0, 1, 2, 3, 4, 5].map((index) => (  // 👈 6 digits
//                       <input
//                         key={index}
//                         id={`otp-${index}`}
//                         type="text"
//                         maxLength="1"
//                         value={formData.otp[index]}
//                         onChange={(e) => handleOTPChange(index, e.target.value)}
//                         onKeyDown={(e) => handleOTPKeyDown(index, e)}
//                         className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
//                         autoFocus={index === 0}
//                       />
//                     ))}
//                   </div>

//                   {/* Timer and Resend */}
//                   <div className="text-center">
//                     {!canResend ? (
//                       <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
//                         <MdTimer className="text-red-500" />
//                         Resend OTP in {timer}s
//                       </p>
//                     ) : (
//                       <button
//                         onClick={handleResend}
//                         disabled={loading}
//                         className="text-red-500 hover:text-red-600 font-semibold text-sm disabled:opacity-50"
//                       >
//                         Resend OTP
//                       </button>
//                     )}
//                   </div>

//                   <button
//                     onClick={handleVerifyOTP}
//                     disabled={formData.otp.join('').length !== 4 || loading}
//                     className={`w-full py-4 rounded-xl font-semibold text-lg transition
//                       ${formData.otp.join('').length === 4 && !loading
//                         ? 'bg-red-500 hover:bg-red-600 text-white transform hover:scale-[1.02]'
//                         : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
//                   >
//                     {loading ? 'Verifying...' : 'Verify & Login'}
//                   </button>

//                   {/* WhatsApp Option */}
//                   <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                       <div className="w-full border-t border-gray-300"></div>
//                     </div>
//                     <div className="relative flex justify-center text-sm">
//                       <span className="px-2 bg-white text-gray-500">Or</span>
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => window.open('https://wa.me/919876543210', '_blank')}
//                     className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
//                   >
//                     <FaWhatsapp className="text-xl" />
//                     Continue with WhatsApp
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Terms */}
//           <p className="text-xs text-center text-gray-500 mt-6">
//             By continuing, you agree to our Terms of Service and Privacy Policy
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;





import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaPhone, FaLock, FaWhatsapp } from 'react-icons/fa';
import { MdTimer } from 'react-icons/md';
import { sendOTP, verifyOTP, resendOTP } from '../services/api';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form states
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    otp: ['', '', '', '', '', ''] // ✅ 6 digit OTP
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;

    const newOTP = [...formData.otp];
    newOTP[index] = value;
    setFormData(prev => ({ ...prev, otp: newOTP }));

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSendOTP = async () => {
    if (formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await sendOTP({
        name: formData.name,
        phone: formData.phone
      });

      setSuccess('OTP sent successfully!');
      setOtpSent(true);
      setStep(3);
      setTimer(30);
      setCanResend(false);

      if (response.data.data?.testOTP) {
        const testOTP = response.data.data.testOTP.split('');
        const paddedOTP = [...testOTP, ...Array(6 - testOTP.length).fill('')];
        setFormData(prev => ({ ...prev, otp: paddedOTP }));
      }

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = formData.otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verifyOTP({
        phone: formData.phone,
        otp: otpString
      });

      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1000);

    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');

    try {
      await resendOTP(formData.phone);
      setSuccess('OTP resent successfully!');
      setTimer(30);
      setCanResend(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleNextFromName = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    setStep(2);
    setError('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => {
              if (step === 1) navigate(-1);
              else setStep(step - 1);
            }}
            className="p-2 hover:bg-white rounded-full transition"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {step === 1 && "What's your name?"}
            {step === 2 && "Your phone number?"}
            {step === 3 && "Verify OTP"}
          </h1>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="max-w-md mx-auto mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="max-w-md mx-auto mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
            ✅ {success}
          </div>
        )}

        {/* Main Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-gray-100">
              <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Step 1: Name Input */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <FaUser className="text-4xl text-red-500" />
                    </div>
                    <p className="text-gray-600">Please enter your name to continue</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={handleNextFromName}
                    disabled={!formData.name.trim()}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
                      formData.name.trim()
                        ? 'bg-red-500 hover:bg-red-600 text-white transform hover:scale-[1.02]'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: Phone Input */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <FaPhone className="text-4xl text-red-500" />
                    </div>
                    <p className="text-gray-600">
                      We'll send a <span className="font-bold">6-digit OTP</span> to verify
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        maxLength="10"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Enter 10-digit mobile number</p>
                  </div>
                  <button
                    onClick={handleSendOTP}
                    disabled={formData.phone.length !== 10 || loading}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
                      formData.phone.length === 10 && !loading
                        ? 'bg-red-500 hover:bg-red-600 text-white transform hover:scale-[1.02]'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              )}

              {/* Step 3: OTP Verification */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <FaLock className="text-4xl text-red-500" />
                    </div>
                    <p className="text-gray-600">
                      Enter <span className="font-bold">6-digit OTP</span> sent to
                    </p>
                    <p className="font-semibold text-gray-800">+91 {formData.phone}</p>
                  </div>

                  {/* 6-digit OTP Input Boxes */}
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={formData.otp[index]}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(index, e)}
                        className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>

                  {/* Timer and Resend */}
                  <div className="text-center">
                    {!canResend ? (
                      <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                        <MdTimer className="text-red-500" />
                        Resend OTP in {timer}s
                      </p>
                    ) : (
                      <button
                        onClick={handleResend}
                        disabled={loading}
                        className="text-red-500 hover:text-red-600 font-semibold text-sm disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  {/* Verify Button */}
                  <button
                    onClick={handleVerifyOTP}
                    disabled={formData.otp.join('').length !== 6 || loading}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
                      formData.otp.join('').length === 6 && !loading
                        ? 'bg-red-500 hover:bg-red-600 text-white transform hover:scale-[1.02]'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </button>

                  {/* WhatsApp Option */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <FaWhatsapp className="text-xl" />
                    Continue with WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-gray-500 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;