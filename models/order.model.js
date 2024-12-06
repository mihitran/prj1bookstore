const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    // userId: String,
    fullName: String,
    phone: String,
    address: String,
    products: Array
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;