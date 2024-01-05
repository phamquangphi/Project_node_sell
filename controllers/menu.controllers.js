const Product = require("../model/menu.model");
const User = require("../model/user.model");
module.exports = {
  createProduct: async (req, res) => {
    try {
      const userData = await User.findOne({ _id: req.body.vendor_id });
      if (userData) {
        const vendorData = await Product.findOne({
          vendor_id: req.body.vendor_id,
        });
        if (vendorData) {
          return res
            .status(200)
            .send({
              success: false,
              message: "this vendor is already created a Product ",
            });
        } else {
          const product = new Product({
            vendor_id: req.body.vendor_id,
            namePr: req.body.namePr,
            imagePr: req.body.imagePr,
            pricePr: req.body.pricePr,
          });
           await product.save();
      return res
        .status(200)
        .send({ success: true, message: "add Product success", data: product });
        }
      }
    } catch (err) {
      return res
        .status(400)
        .send({ success: false, message: "Internal server error" });
    }
  },
  getProduct: async (req, res) => {
    try {
      const productList = await menuModel.find();
      if (!productList) {
        res.status(500).json({ success: false });
      }
      res.status(200).send({ success: true, data: productList });
    } catch (error) {
      return res
        .status(400)
        .send({ success: false, message: "Internal server error" });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const deletePr = await menuModel.findByIdAndDelete(id);
      return res.status(200).send({ success: true, data: deletePr });
    } catch (error) {
      return res
        .status(400)
        .send({ success: false, message: "Internal server error" });
    }
  },
};
