// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

// const firebaseConfig = {
//   apiKey: "AIzaSyCF_woqXYU5jO7TmqsIulbhapjbzg_oGGc",
//   authDomain: "otpverify-d1f9c.firebaseapp.com",
//   projectId: "otpverify-d1f9c",
//   storageBucket: "otpverify-d1f9c.firebasestorage.app",
//   messagingSenderId: "474613916435",
//   appId: "1:474613916435:web:26019a717f7436a314f0e6",
//   measurementId: "G-XNKERQQ6WV"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

// // ✅ SINGLETON PATTERN - एक ही instance बार बार use करो
// let recaptchaInitialized = false;

// export const setupRecaptcha = () => {
//   return new Promise((resolve, reject) => {
//     try {
//       // Agar already initialized hai to sidha resolve kar do
//       if (recaptchaInitialized && window.recaptchaVerifier) {
//         console.log('✅ reCAPTCHA already initialized');
//         resolve();
//         return;
//       }

//       const container = document.getElementById('recaptcha-container');
//       if (!container) {
//         reject(new Error('reCAPTCHA container not found'));
//         return;
//       }

//       // Container clear करो
//       container.innerHTML = '';

//       // नया verifier बनाओ
//       window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
//         size: 'invisible',
//         callback: () => {
//           console.log('✅ reCAPTCHA verified');
//           resolve();
//         },
//         'expired-callback': () => {
//           console.log('❌ reCAPTCHA expired');
//           recaptchaInitialized = false;
//           window.recaptchaVerifier = null;
//         }
//       });

//       // Render करो
//       window.recaptchaVerifier.render()
//         .then(() => {
//           console.log('✅ reCAPTCHA rendered');
//           recaptchaInitialized = true;
//           resolve();
//         })
//         .catch((error) => {
//           console.error('❌ reCAPTCHA render error:', error);
//           recaptchaInitialized = false;
//           reject(error);
//         });
//     } catch (error) {
//       console.error('❌ reCAPTCHA setup error:', error);
//       reject(error);
//     }
//   });
// };

// export const sendFirebaseOTP = async (phoneNumber) => {
//   try {
//     // Setup reCAPTCHA - अब ये सिर्फ एक बार होगा
//     await setupRecaptcha();
    
//     const appVerifier = window.recaptchaVerifier;
//     console.log('📤 Sending OTP to:', phoneNumber);
    
//     const confirmationResult = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, appVerifier);
//     console.log('✅ OTP sent successfully');
    
//     return { success: true, confirmationResult };
//   } catch (error) {
//     console.error('❌ Error sending OTP:', error);
    
//     // अगर error "already rendered" का हो तो retry मत करो
//     if (error.message?.includes('already been rendered')) {
//       return { success: false, error: 'reCAPTCHA error. Please refresh the page.' };
//     }
    
//     return { success: false, error: error.message };
//   }
// };

// export const verifyFirebaseOTP = async (confirmationResult, otp) => {
//   try {
//     const result = await confirmationResult.confirm(otp);
//     const idToken = await result.user.getIdToken();
//     return { success: true, idToken, user: result.user };
//   } catch (error) {
//     console.error('❌ Error verifying OTP:', error);
//     return { success: false, error: error.message };
//   }
// };