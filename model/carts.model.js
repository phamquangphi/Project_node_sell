const mongoose = require("mongoose");

const cartSchame = mongoose.Schema({
  orderItems: {
    type: mongoose.Types.ObjectId,
    ref: "OrderItem",
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});
module.exports = mongoose.model("cart", cartSchame);
