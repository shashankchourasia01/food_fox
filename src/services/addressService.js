import api from './api';

const addressService = {
  // Get user addresses
  getAddresses: () => api.get('/users/addresses'),
  
  // Add new address
  addAddress: (addressData) => api.post('/users/addresses', addressData),
  
  // Update address
  updateAddress: (id, addressData) => api.put(`/users/addresses/${id}`, addressData),
  
  // Delete address
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
  
  // Set default address
  setDefaultAddress: (id) => api.put(`/users/addresses/${id}/default`)
};

export default addressService;