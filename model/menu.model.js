const mongoose = require("mongoose");

const menuSchame = mongoose.Schema(
  {
    vendor_id: {
      type: String,
      required: true,
    },

    namePr: {
      type: String,
      required: true,
    },
    imagePr: {
      type: String,
      required: true,
    },
    pricePr: {
      type: Number,
      required: true,
      default: 0,
    },
    
  },
  {
    versionKey: false,
  }
);
// menuSchame.vitural("id").get(function () {
//   return this._id.toHexString();
// });
// menuSchame.set("toJSON", {
//   vitural: true,
// });
module.exports = mongoose.model("menu_cakes", menuSchame);
