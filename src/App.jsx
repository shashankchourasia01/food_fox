import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Navbar from './components/Navbar';
import AccountSidebar from './components/AccountSidebar';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import CartPage from './pages/CartPage'; 
import LocationPage from './pages/LocationPage';
import FeedbackPage from './pages/FeedbackPage';
import LoginPage from './pages/LoginPage';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <AccountSidebar />
          <main className="min-h-screen">
            <Routes>
              {/* Home Route - ab HomePage render hoga */}
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/location" element={<LocationPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Other routes - commented for now */}
              {/* <Route path="/cart" element={<CartPage />} /> */}
              {/* <Route path="/account/*" element={<AccountPage />} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;