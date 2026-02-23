import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import  store  from './redux/store';
import Navbar from './components/Navbar';
import AccountSidebar from './components/AccountSidebar';
// ... other imports

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <AccountSidebar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<div>Home Page - Coming Soon</div>} />
              <Route path="/cart" element={<div>Cart Page - Coming Soon</div>} />
              <Route path="/account/*" element={<div>Account Page - Coming Soon</div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;