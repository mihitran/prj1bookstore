const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    // userId: String,
    products: Array,
    expireAt: {
      type: Date,
      expires: 0
    }
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.model("Cart", cartSchema, "carts");
module.exports = Cart;