import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<div>Home Page - Coming Soon</div>} />
            <Route path="/cart" element={<div>Cart Page - Coming Soon</div>} />
            <Route path="/account" element={<div>Account Page - Coming Soon</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;