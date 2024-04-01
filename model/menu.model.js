const mongoose = require("mongoose");

const menuSchame = mongoose.Schema({
  namePr: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },

  pricePr: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Product", menuSchame);
