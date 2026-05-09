const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  email: { type: String, required: true },
  items: [{ name: String, price: Number, qty: Number }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: { type: String, enum: ['COD', 'Card'], default: 'COD' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
