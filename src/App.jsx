import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Navbar from './components/Navbar';
import AccountSidebar from './components/AccountSidebar';
import HomePage from './pages/HomePage';  // ✅ Import HomePage
import CartPage from './pages/CartPage'; 

// Import other pages (will create later)
// import CartPage from './pages/CartPage';
// import AccountPage from './pages/AccountPage';

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
              
              {/* Other routes - commented for now */}
              {/* <Route path="/cart" element={<CartPage />} /> */}
              {/* <Route path="/account/*" element={<AccountPage />} /> */}
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;