import React, { useState } from 'react';
import userService from '../services/userService';

const TestUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.create(formData);
      setMessage(`✅ User created: ${response.data.name}`);
      setFormData({ name: '', phone: '', email: '' });
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Test User Creation</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone (10 digits)"
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email (optional)"
          className="w-full p-2 border rounded mb-2"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Create User
        </button>
      </form>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
};

export default TestUser;